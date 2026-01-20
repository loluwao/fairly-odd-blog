from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup
import os

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
GENIUS_API_URL = "https://api.genius.com"

HEADERS = {
    "Authorization": f"Bearer {GENIUS_TOKEN}",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}


def search_song(track: str, artist: str):
    """search for a song on Genius"""
    search_url = f"{GENIUS_API_URL}/search"
    params = {"q": f"{track} {artist}"}

    response = requests.get(search_url, headers=HEADERS, params=params)
    response.raise_for_status()

    hits = response.json()["response"]["hits"]

    for hit in hits:
        if hit["type"] == "song":
            return hit["result"]
    return None


def scrape_lyrics(song_url: str):
    """Scrape lyrics from a Genius song page."""
    page = requests.get(song_url, headers={"User-Agent": HEADERS["User-Agent"]})
    page.raise_for_status()

    soup = BeautifulSoup(page.text, "html.parser")

    lyrics_containers = soup.find_all("div", {"data-lyrics-container": "true"})

    if lyrics_containers:
        lyrics = "\n".join([container.get_text(separator="\n") for container in lyrics_containers])
        return lyrics.strip()

    return None


@app.get("/lyrics")
def get_lyrics(artist: str, track: str):
    """Fetch lyrics for a track from Genius."""
    if not GENIUS_TOKEN:
        raise HTTPException(status_code=500, detail="Genius API token not configured")

    try:
        song = search_song(track, artist)
        if not song:
            raise HTTPException(status_code=404, detail="Song not found")

        lyrics = scrape_lyrics(song["url"])

        return {
            "title": song["title"],
            "artist": song["primary_artist"]["name"],
            "lyrics": lyrics,
            "url": song["url"],
        }
    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/lyrics/tokens")
def tokenize_lyrics(names: str, artists: str):
    """gets lyrics of list of songs and tokenizes them"""
    track_names = names.split(",")
    artist_names = artists.split(",")

    # TODO: implement tokenization logic
    return {"tracks": track_names, "artists": artist_names}

@app.get("/health")
def health_check():
    return {"status": "ok"}
