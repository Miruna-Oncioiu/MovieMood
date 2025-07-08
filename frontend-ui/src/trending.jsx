import React from "react";
import CastInfo from "./castInfo";
import './App.css';

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

export default function TrendingMovies({
  trending,
  selectedTrendingMovie,
  setSelectedTrendingMovie,
  addTmdbToWatched,
  addTmdbToWatchlist,
  currentUser,
  showWelcome,
  setShowWelcome
}) {
  return (
    <>
      {showWelcome && currentUser && (
        <>
          <h2>Welcome, {currentUser.username}!</h2>
          <p>Millions of artistic movies and series to discover. Explore now.</p>
          <br />
        </>
      )}

      <h2 style={{ textAlign: "center" }}>Trending Movies & Series</h2>

      {!selectedTrendingMovie ? (
        <div
          className="trending-grid"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            justifyContent: "center",
          }}
        >
          {trending.map((item) => {
            const title = item.title || item.name || "Untitled";
            const posterPath = item.poster_path
              ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
              : "https://via.placeholder.com/200x300?text=No+Image";
            return (
              <div
                key={item.id}
                onClick={() => {
                  setShowWelcome(false);
                  setSelectedTrendingMovie(item);
                }}
                style={{ cursor: "pointer", width: 150 }}
              >
                <img
                  src={posterPath}
                  alt={title}
                  style={{ width: "100%", borderRadius: "8px" }}
                />
                <p style={{ fontWeight: "bold" }}>{title}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "left" }}>
          <button
            onClick={() => setSelectedTrendingMovie(null)}
            style={{ marginBottom: 20 }}
          >
            ← Back to Trending
          </button>

          <h2>
            {selectedTrendingMovie.title || selectedTrendingMovie.name} (
            {(selectedTrendingMovie.release_date || selectedTrendingMovie.first_air_date)?.slice(0, 4) || "N/A"})
          </h2>

          <img
            src={
              selectedTrendingMovie.poster_path
                ? `https://image.tmdb.org/t/p/w500${selectedTrendingMovie.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Image"
            }
            alt={selectedTrendingMovie.title || selectedTrendingMovie.name}
            style={{ width: "100%", borderRadius: "8px" }}
          />

          <p style={{ marginTop: 15 }}>
            {selectedTrendingMovie.overview || "No description available."}
          </p>

          <p>
            <strong>Rating:</strong> ⭐{" "}
            {selectedTrendingMovie.vote_average?.toFixed(1) || "N/A"}
          </p>

          <p>
            <strong>Genres:</strong>{" "}
            {selectedTrendingMovie.genre_ids
              ? selectedTrendingMovie.genre_ids
                  .map((id) => genreMap[id])
                  .filter(Boolean)
                  .join(", ")
              : "N/A"}
          </p>
          <CastInfo tmdb_id={selectedTrendingMovie.id} />

          <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
            <button
              onClick={() => addTmdbToWatched(selectedTrendingMovie)}
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
              onClick={() => addTmdbToWatchlist(selectedTrendingMovie)}
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
