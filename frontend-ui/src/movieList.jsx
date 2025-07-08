import React, { useState } from "react";
import CastInfo from "./castInfo";
import StarRating from "./starRating";
import "./App.css";

const genreMap = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance",
  878: "Science Fiction", 10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

export default function MovieList({ movies, title, addTmdbToWatched, addTmdbToWatchlist, currentUser }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  
const handleRating = async (movieId, rating) => {
  try {
    const res = await fetch(`http://localhost:8000/users/${currentUser.id}/watched/${movieId}/rating`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating }),
    });

    if (!res.ok) throw new Error("Rating failed");

    alert("Rating salvat cu succes!");

    setSelectedMovie((prev) => ({
      ...prev,
      rating: rating,
    }));
  } catch (err) {
    console.error(err);
    alert("Eroare la trimiterea rating-ului");
  }
};

  return (
    <>
      <h2 style={{ textAlign: "center" }}>{title}</h2>
      {!selectedMovie ? (
        <div className="movies-grid" style={{ display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "center" }}>
          {movies.length === 0 && <p>No movies found.</p>}
          {movies.map((movie) => (
            <div key={movie.id} onClick={() => setSelectedMovie(movie)} style={{ cursor: "pointer", width: 150 }}>
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : "https://via.placeholder.com/200x300?text=No+Image"}
                alt={movie.title}
                style={{ width: "100%", borderRadius: "8px" }}
              />
              <p style={{ fontWeight: "bold" }}>{movie.title}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "left" }}>
          <button onClick={() => setSelectedMovie(null)} style={{ marginBottom: 20 }}>
            ← Back to {title}
          </button>
          <h2>
            {selectedMovie.title} ({selectedMovie.release_date?.slice(0, 4) || "N/A"})
          </h2>
          <img
            src={selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image"}
            alt={selectedMovie.title}
            style={{ width: "100%", borderRadius: "8px" }}
          />
          <p style={{ marginTop: 15 }}>
            {selectedMovie.overview || "No description available."}
          </p>
          <p>
            <strong>Rating:</strong> ⭐ {selectedMovie.vote_average?.toFixed(1) || "N/A"}
          </p>
          <p>
            <strong>Genres:</strong>{" "}
            {selectedMovie.genres?.length
              ? selectedMovie.genres.map((g) => g.name).join(", ")
              : "N/A"}
          </p>

          {title === "Watched Movies" && selectedMovie && (
            <div style={{ marginTop: 15 }}>
                <strong>Rating:</strong>
                <StarRating
  initialRating={selectedMovie.rating || 0}
  onRate={(rating) => {
    const internalId = selectedMovie.movie_id ?? selectedMovie.id;
    console.log("Trimitem rating pentru movie ID:", internalId);
    handleRating(internalId, rating);
  }}
/>
            </div>
            )}

          <CastInfo tmdb_id={selectedMovie.id} type="movie" />

          <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
            <button
              onClick={() => addTmdbToWatched(selectedMovie)}
              style={{
                backgroundColor: "#4caf50",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Add to Watched
            </button>
            <button
              onClick={() => addTmdbToWatchlist(selectedMovie)}
              style={{
                backgroundColor: "#2196f3",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Add to Watchlist
            </button>
          </div>
        </div>
      )}
    </>
  );
}
