from fastapi import FastAPI, HTTPException, Body, Query
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
from threading import Lock

DB_FILE = "db.json"
TMDB_API_KEY = "06ade31fb061203acc17db7ec37baeec"

app = FastAPI(title="Movie Recommender API")
lock = Lock()

def read_db():
    with lock:
        with open(DB_FILE, "r") as f:
            return json.load(f)

def write_db(data):
    with lock:
        with open(DB_FILE, "w") as f:
            json.dump(data, f, indent=4)

def get_user_by_id(user_id):
    data = read_db()
    return next((u for u in data["users"] if u["id"] == user_id), None)

def update_user(user_id, new_data):
    data = read_db()
    for i, user in enumerate(data["users"]):
        if user["id"] == user_id:
            data["users"][i].update(new_data)
            write_db(data)
            return True
    return False

def search_tmdb(query):
    url = "https://api.themoviedb.org/3/search/movie"
    params = {"api_key": TMDB_API_KEY, "query": query, "language": "en-US", "include_adult": False}
    response = requests.get(url, params=params)
    return response.json().get("results", []) if response.status_code == 200 else []

def save_movie_tmdb(movie):
    data = read_db()
    existing = next((m for m in data["movies"] if m.get("tmdb_id") == movie["id"]), None)
    if existing:
        return existing["id"]

    new_movie = {
        "id": max((m["id"] for m in data["movies"]), default=0) + 1,
        "title": movie["title"],
        "description": movie.get("overview", ""),
        "poster_path": movie.get("poster_path"),
        "tmdb_id": movie["id"]
    }
    data["movies"].append(new_movie)
    write_db(data)
    return new_movie["id"]

def update_user_movie_list(user_id, list_type, movie_id):
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    movie_list = user.get(list_type, [])
    if list_type == "watched":
        if not any(item["movie_id"] == movie_id for item in movie_list):
            movie_list.append({"movie_id": movie_id, "rating": None})
    else:
        if movie_id not in movie_list:
            movie_list.append(movie_id)
    update_user(user_id, {list_type: movie_list})


@app.get("/")
def root():
    return {"message": "API is running."}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/users")
def list_users():
    return read_db().get("users", [])

@app.post("/login")
def login(data: dict = Body(...)):
    username, password = data.get("username"), data.get("password")
    user = next((u for u in read_db()["users"] if u["username"] == username and u["password"] == password), None)
    if user: return {"user": user}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/users")
def create_user(user: dict):
    data = read_db()
    if any(u["username"] == user["username"] for u in data["users"]):
        raise HTTPException(status_code=400, detail="User already exists")
    new_user = {
        "id": max((u["id"] for u in data["users"]), default=0) + 1,
        "username": user["username"],
        "password": user["password"],
        "watched": [],
        "watchlist": [],
        "moods": []
    }
    data["users"].append(new_user)
    write_db(data)
    return {"user": new_user}

@app.get("/movies")
def get_movies():
    return read_db()["movies"]

@app.get("/users/{user_id}/watched")
def list_watched(user_id: int):
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    watched_items = user.get("watched", [])
    all_movies = read_db()["movies"]
    result = []
    for item in watched_items:
        movie = next((m for m in all_movies if m["id"] == item["movie_id"]), None)
        if movie:
            movie_copy = movie.copy()
            movie_copy["rating"] = item.get("rating")
            movie_copy["movie_id"] = item["movie_id"]
            result.append(movie_copy)
    return result

@app.get("/users/{user_id}/watchlist")
def list_watchlist(user_id: int):
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    movie_ids = user.get("watchlist", [])
    all_movies = read_db()["movies"]
    return [m for m in all_movies if m["id"] in movie_ids]

@app.get("/search_movies")
def search_movies(q: str = Query(..., min_length=1)):
    return {"results": search_tmdb(q)}

@app.post("/users/{user_id}/watched_tmdb")
def add_tmdb_to_watched(user_id: int, movie: dict = Body(...)):
    movie_id = save_movie_tmdb(movie)
    update_user_movie_list(user_id, "watched", movie_id)

    data = read_db()
    for user in data["users"]:
        if user["id"] == user_id:
            if movie_id in user.get("watchlist", []):
                user["watchlist"].remove(movie_id)
                write_db(data)
            break
    return {"message": "Movie added to watched and removed from watchlist if existed"}

@app.post("/users/{user_id}/watchlist_tmdb")
def add_to_watchlist(user_id: int, movie: dict = Body(...)):
    movie_id = save_movie_tmdb(movie)
    update_user_movie_list(user_id, "watchlist", movie_id)
    return {"message": "Movie added to watchlist"}


@app.get("/recommend_tmdb/{mood}")
def recommend_tmdb_by_mood(mood: str):
    mood_mapping = {
        "cheerful": 35,
        "depression": 18,
        "anxiety": 53,
        "calm": 10751,
        "gloomy": 27,
        "humorous": 35,
        "hopeful": 18,
        "idyllic": 14,
        "irritability": 80,
        "joyful": 10402,
        "melancholic": 10749,
        "nostalgic": 36,
        "optimistic": 12,
        "fearful": 27,
        "lonely": 18,
        "peaceful": 16,
        "whimsical": 14,
        "angry": 28,
        "content": 10751,
        "eerie": 9648,
        "grateful": 99,
        "hopeless": 18,
        "mysterious": 9648,
    }

    genre_id = mood_mapping.get(mood.lower())
    if not genre_id:
        raise HTTPException(status_code=400, detail=f"Unsupported mood: {mood}")

    url = "https://api.themoviedb.org/3/discover/movie"
    params = {
        "api_key": TMDB_API_KEY,
        "with_genres": genre_id,
        "sort_by": "popularity.desc",
        "language": "en-US",
        "include_adult": False
    }

    response = requests.get(url, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="TMDb error")

    return response.json().get("results", [])

@app.post("/users/{user_id}/watched/{movie_id}/rating")
def set_movie_rating(user_id: int, movie_id: int, data: dict = Body(...)):
    rating = data.get("rating")
    if rating is None or not (1 <= rating <= 5):
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    watched_items = user.get("watched", [])
    for item in watched_items:
        if item["movie_id"] == movie_id:
            item["rating"] = rating
            update_user(user_id, {"watched": watched_items})
            return {"message": "Rating updated"}
    raise HTTPException(status_code=404, detail="Movie not found in watched list")

@app.get("/search_by_actor")
def search_by_actor(name: str = Query(..., min_length=1)):
    search_url = "https://api.themoviedb.org/3/search/person"
    params = {
        "api_key": TMDB_API_KEY,
        "query": name,
        "language": "en-US",
        "include_adult": False
    }
    search_resp = requests.get(search_url, params=params)
    if search_resp.status_code != 200:
        raise HTTPException(status_code=500, detail="TMDb error searching actor")
    
    results = search_resp.json().get("results", [])
    if not results:
        return {"results": []}
    
    actor_id = results[0]["id"]

    credits_url = f"https://api.themoviedb.org/3/person/{actor_id}/combined_credits"
    credits_params = {
        "api_key": TMDB_API_KEY,
        "language": "en-US"
    }
    credits_resp = requests.get(credits_url, params=credits_params)
    if credits_resp.status_code != 200:
        raise HTTPException(status_code=500, detail="TMDb error fetching credits")
    
    credits_data = credits_resp.json()
    cast_credits = credits_data.get("cast", [])
    return {"results": cast_credits}

@app.delete("/users/{user_id}/watched/{movie_id}")
def remove_from_watched(user_id: int, movie_id: int):
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    watched = user.get("watched", [])
    updated_watched = [item for item in watched if item["movie_id"] != movie_id]

    if len(updated_watched) == len(watched):
        raise HTTPException(status_code=404, detail="Movie not found in watched list")

    update_user(user_id, {"watched": updated_watched})
    return {"message": "Movie removed from watched"}

@app.delete("/users/{user_id}/watchlist/{movie_id}")
def remove_from_watchlist(user_id: int, movie_id: int):
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    watchlist = user.get("watchlist", [])
    if movie_id not in watchlist:
        raise HTTPException(status_code=404, detail="Movie not found in watchlist")

    watchlist.remove(movie_id)
    update_user(user_id, {"watchlist": watchlist})
    return {"message": "Movie removed from watchlist"}