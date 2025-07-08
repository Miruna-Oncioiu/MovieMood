import React from "react";
import './App.css';
import CastInfo from "./castInfo";
const genreMap = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

export default function MoodRecommendations({
  recommendations,
  selectedMoodMovie,
  setSelectedMoodMovie,
  getMoodRecommendations,
  addTmdbToWatched,
  addTmdbToWatchlist,
}) {
  return (
    <>
      {!selectedMoodMovie && (
        <>
          <h2>Get Recommendations by Mood</h2>
          <div style={{ marginBottom: 10 }}>
            {["happy", "sad", "curious", "excited"].map((m) => (
              <button
                key={m}
                onClick={() => getMoodRecommendations(m)}
                style={{ margin: "0 5px" }}
              >
                {m}
              </button>
            ))}
          </div>
          <h3>Recommendations</h3>
          <div
            className="mood-grid"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
              justifyContent: "center",
            }}
          >
            {recommendations.length > 0 ? (
              recommendations.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => setSelectedMoodMovie(movie)}
                  style={{ cursor: "pointer", width: 150 }}
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                        : "https://via.placeholder.com/200x300?text=No+Image"
                    }
                    alt={movie.title}
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                  <p style={{ fontWeight: "bold" }}>{movie.title}</p>
                </div>
              ))
            ) : (
              <p>No recommendations yet. Choose a mood above.</p>
            )}
          </div>
        </>
      )}

      {selectedMoodMovie && (
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "left" }}>
          <button
            onClick={() => setSelectedMoodMovie(null)}
            style={{ marginBottom: 20 }}
          >
            ← Back to Recommendations
          </button>
          <h2>
            {selectedMoodMovie.title} (
            {selectedMoodMovie.release_date?.slice(0, 4) || "N/A"})
          </h2>
          <img
            src={
              selectedMoodMovie.poster_path
                ? `https://image.tmdb.org/t/p/w500${selectedMoodMovie.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Image"
            }
            alt={selectedMoodMovie.title}
            style={{ width: "100%", borderRadius: "8px" }}
          />
          <p style={{ marginTop: 15 }}>
            {selectedMoodMovie.overview || "No description available."}
          </p>
          <p>
            <strong>Rating:</strong> ⭐{" "}
            {selectedMoodMovie.vote_average?.toFixed(1) || "N/A"}
          </p>
          <p>
            <strong>Genres:</strong>{" "}
            {selectedMoodMovie.genre_ids
              ? selectedMoodMovie.genre_ids
                  .map((id) => genreMap[id])
                  .filter(Boolean)
                  .join(", ")
              : "N/A"}
          </p>

          {/* Aici afișezi distribuția */}
          <CastInfo tmdb_id={selectedMoodMovie.id} type="movie" />
            
          <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
            <button
              onClick={() => addTmdbToWatched(selectedMoodMovie)}
              style={{
                backgroundColor: "#4caf50",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Add to Watched
            </button>
            <button
              onClick={() => addTmdbToWatchlist(selectedMoodMovie)}
              style={{
                backgroundColor: "#2196f3",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "5px",
                cursor: "pointer",
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