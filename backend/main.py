from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from collections import Counter
import lyricsgenius
import requests
from bs4 import BeautifulSoup
import re
import os
from nltk.stem import WordNetLemmatizer

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GENIUS_TOKEN = os.getenv("GENIUS_API_TOKEN")

genius = lyricsgenius.Genius(GENIUS_TOKEN, verbose=False, remove_section_headers=False)


BROWSER_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

BROWSER_HEADERS = {
    "User-Agent": BROWSER_UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
}


def clean_lyrics(raw_lyrics: str) -> str:
    """strip Genius metadata from scraped lyrics"""
    # find the first section header like [Verse 1], [Chorus], [Intro], etc.
    section_match = re.search(
        r'\[(?:Chorus|Verse|Intro|Outro|Bridge|Pre-Chorus|Hook|Refrain|Interlude|Part|Instrumental).*?\]',
        raw_lyrics, re.IGNORECASE
    )
    if section_match:
        raw_lyrics = raw_lyrics[section_match.start():]

    # remove trailing "Embed" or "123Embed"
    raw_lyrics = re.sub(r'\d*Embed$', '', raw_lyrics)

    return raw_lyrics.strip()


def scrape_lyrics(song_url: str):
    """scrape lyrics from a Genius page with a browser User-Agent"""
    page = requests.get(song_url, headers=BROWSER_HEADERS)
    page.raise_for_status()

    soup = BeautifulSoup(page.text, "html.parser")
    containers = soup.find_all("div", {"data-lyrics-container": "true"})
    if not containers:
        return None

    raw = "\n".join(c.get_text(separator="\n") for c in containers)
    return clean_lyrics(raw)


def parse_artists(artist_str: str) -> list[str]:
    """split an artist string like 'A, B feat. C & D' into individual names"""
    parts = re.split(r',|feat\.?|ft\.?|&|\+|x(?:\s)', artist_str, flags=re.IGNORECASE)
    return [p.strip().lower() for p in parts if p.strip()]


def artists_match(query_artist: str, hit_artist: str) -> bool:
    """check if any artist name from the query appears in the hit artist or vice versa"""
    query_names = parse_artists(query_artist)
    hit_names = parse_artists(hit_artist)
    for qn in query_names:
        for hn in hit_names:
            if qn in hn or hn in qn:
                return True
    return False


def find_song(track: str, artist: str):
    """search via authenticated API, scrape lyrics directly"""
    response = genius.search_songs(f"{track} {artist}")
    hits = response.get("hits", [])
    if not hits:
        return None

    # filter to actual song results with lyrics, preferring artist matches
    song_info = None

    # first pass: match artist and has complete lyrics
    for hit in hits:
        result = hit["result"]
        if result.get("lyrics_state") != "complete":
            continue
        if artists_match(artist, result["primary_artist"]["name"]):
            song_info = result
            break

    if not song_info:
        return None

    lyrics = scrape_lyrics(song_info["url"])

    return {
        "title": song_info["title"],
        "artist": song_info["primary_artist"]["name"],
        "url": song_info["url"],
        "lyrics": lyrics,
    }


@app.get("/lyrics")
def get_lyrics(artist: str, track: str):
    """get lyrics for a track from Genius for frontend"""
    if not GENIUS_TOKEN:
        raise HTTPException(status_code=500, detail="Genius API token not configured")

    try:
        song = find_song(track, artist)
        if not song:
            raise HTTPException(status_code=404, detail="Song not found")

        return song
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def tokenize_text(text: str) -> list[str]:
    """remove punctuation, bracketed words, and lowercase all words"""
    text = re.sub(r"\[.*?\]", "", text)
    text = text.lower()
    words = re.findall(r"[a-z]+", text)
    return words


def lyrical_complexity(lyrics: str) -> dict:
    """score how lyrically complex a song is based on vocabulary metrics"""
    tokens = tokenize_text(lyrics)
    if len(tokens) < 10:
        return None

    total = len(tokens)
    freq = Counter(tokens)
    unique_count = len(freq)

    # vocabulary diversity: unique words / total words (type-token ratio)
    ttr = unique_count / total

    # average word length: proxy for vocabulary sophistication
    avg_len = sum(len(w) for w in tokens) / total

    # rare word ratio: words appearing only once (hapax legomena) / unique words
    hapax_count = sum(1 for c in freq.values() if c == 1)
    hapax_ratio = hapax_count / unique_count

    # normalize avg word length to 0-1 (typical range 2-7 chars)
    avg_len_norm = min(max((avg_len - 2) / 5, 0), 1)

    score = (ttr * 0.3 + avg_len_norm * 0.3 + hapax_ratio * 0.4) * 100

    return {
        "score": round(score, 1),
        "vocabulary_diversity": round(ttr, 3),
        "average_word_length": round(avg_len, 2),
        "rare_word_ratio": round(hapax_ratio, 3),
        "total_words": total,
        "unique_words": unique_count,
    }


@app.get("/lyrics/complexity")
def get_complexity(names: str, artists: str):
    """get lyrical complexity scores for a batch of songs"""
    if not GENIUS_TOKEN:
        raise HTTPException(status_code=500, detail="Genius API token not configured")

    track_names = names.split(",")
    artist_names = artists.split(",")
    results = []

    for track, artist in zip(track_names, artist_names):
        try:
            song = find_song(track.strip(), artist.strip())
            if not song or not song["lyrics"]:
                continue

            score = lyrical_complexity(song["lyrics"])
            if not score:
                continue

            results.append({**score, "title": song["title"], "artist": song["artist"]})
        except Exception as e:
            print(f"Error processing {track} by {artist}: {e}")
            continue

    return {"results": results}


@app.get("/lyrics/tokens")
def tokenize_lyrics(names: str, artists: str):
    track_names = names.split(",")
    artist_names = artists.split(",")

    all_tokens = []

    for track, artist in zip(track_names, artist_names):
        try:
            song = find_song(track.strip(), artist.strip())
            if song and song["lyrics"]:
                tokens = tokenize_text(song["lyrics"])
                all_tokens.extend(tokens)
        except Exception:
            continue

    return {"tokens": all_tokens, "count": len(all_tokens)}


@app.get("/lyrics/top-words")
def get_top_words(names: str, artists: str, playcounts: str, limit: int = 20):
    """gets top words from lyrics of a list of songs"""
    track_names = names.split(",")
    artist_names = artists.split(",")
    play_counts = [int(p.strip()) for p in playcounts.split(",")]

    stop_words = {
        "myself", "our", "ours", "you", "your", "yours",
         "him", "his", "she", "her", "hers", "its", "they", "them",
        "what", "which", "who", "whom", "this", "that", "these", "those",
        "is", "are", "was", "were", "been", "being", "have", "has", "had",
        "does", "did", "doing", "the", "and", "but",
        "because",  "until", "while", "for", "with",
        "about", "against", "between", "into", "through", "during", "before",
        "after", "above", "below", "to", "from", "down", "out",
        "off", "over", "under", "again", "further", "then", "once", "here",
        "there", "when", "where", "why", "how", "all", "each", "few", "more",
        "most", "other", "some", "such",  "nor", "not", "only", "own",
        "same", "so", "than", "too", "very", "can", "will", "just",
        "don", "should", "now", "ain", "nigga",
        "aren", "couldn", "didn", "doesn", "hadn", "hasn", "haven", "isn",
         "mightn", "mustn", "needn", "shan", "shouldn", "wasn", "weren",
        "won", "wouldn", "ive", "youre", "youve", "youll", "youd",
        "an", "as", "at", "be", "by", "do", "go", "he", "if", "in",
        "it", "me", "my", "no", "of", "on", "or", "up", "us", "we",
        "am", "ah", "oh", "ok", "em", "re"
    }

    lemmatizer = WordNetLemmatizer()
    word_counts = Counter()
    word_sources: dict[str, list[dict]] = {}
    total_tokens = 0

    for track, artist, playcount in zip(track_names, artist_names, play_counts):
        try:
            song = find_song(track.strip(), artist.strip())
            if song and song["lyrics"]:
                tokens = tokenize_text(song["lyrics"])
                unique_words = set(t for t in tokens if t not in stop_words and len(t) > 1)
                lemmatized_words = set(lemmatizer.lemmatize(word) for word in unique_words)
                for word in lemmatized_words:
                    word_counts[word] += playcount
                    if word not in word_sources:
                        word_sources[word] = []
                    word_sources[word].append({"title": song["title"], "artist": song["artist"]})
                total_tokens += len(lemmatized_words) * playcount
        except Exception as e:
            print(f"Error processing {track} by {artist}: {e}")
            continue

    top_words = word_counts.most_common(limit)

    return {
        "words": [{"word": word, "count": count, "sources": word_sources.get(word, [])} for word, count in top_words],
        "total_tokens": total_tokens,
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}
