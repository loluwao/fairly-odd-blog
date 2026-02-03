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


BROWSER_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"


def scrape_lyrics(song_url: str):
    """scrape lyrics from a Genius page with a browser User-Agent"""
    page = requests.get(song_url, headers={"User-Agent": BROWSER_UA})
    page.raise_for_status()

    soup = BeautifulSoup(page.text, "html.parser")
    containers = soup.find_all("div", {"data-lyrics-container": "true"})
    if not containers:
        return None

    return "\n".join(c.get_text(separator="\n") for c in containers)


def find_song(track: str, artist: str):
    """search via authenticated API, scrape lyrics directly"""
    response = genius.search_songs(f"{track} {artist}")
    hits = response.get("hits", [])
    if not hits:
        return None

    song_info = hits[0]["result"]
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
    }

    lemmatizer = WordNetLemmatizer()
    word_counts = Counter()
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
                total_tokens += len(lemmatized_words) * playcount
        except Exception as e:
            print(f"Error processing {track} by {artist}: {e}")
            continue

    top_words = word_counts.most_common(limit)

    return {
        "words": [{"word": word, "count": count} for word, count in top_words],
        "total_tokens": total_tokens,
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}
