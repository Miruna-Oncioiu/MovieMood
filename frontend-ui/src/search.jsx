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

export default function SearchMovies({
  searchQuery,
  setSearchQuery,
  handleSearch,
  searched,
  searchResults,
  selectedSearchedMovie,
  setSelectedSearchedMovie,
  addTmdbToWatched,
  addTmdbToWatchlist,
}) {
  return (
    <>
      <h2 style={{ textAlign: "center" }}>Search Movies</h2>

      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          style={{
            padding: "10px",
            width: "250px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 15px",
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {!selectedSearchedMovie ? (
        <div
          className="search-grid"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            justifyContent: "center",
          }}
        >
          {searched ? (
            searchResults.length > 0 ? (
              searchResults.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => setSelectedSearchedMovie(movie)}
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
              <p>No results found.</p>
            )
          ) : null}
        </div>
      ) : (
        <div
          style={{
            maxWidth: 600,
            margin: "0 auto",
            textAlign: "left",
          }}
        >
          <button
            onClick={() => setSelectedSearchedMovie(null)}
            style={{ marginBottom: 20 }}
          >
            ← Back to Search
          </button>
          <h2>
            {selectedSearchedMovie.title} (
            {selectedSearchedMovie.release_date?.slice(0, 4) || "N/A"})
          </h2>
          <img
            src={
              selectedSearchedMovie.poster_path
                ? `https://image.tmdb.org/t/p/w500${selectedSearchedMovie.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Image"
            }
            alt={selectedSearchedMovie.title}
            style={{ width: "100%", borderRadius: "8px" }}
          />
          <p style={{ marginTop: 15 }}>
            {selectedSearchedMovie.overview || "No description available."}
          </p>
          <p>
            <strong>Rating:</strong> ⭐{" "}
            {selectedSearchedMovie.vote_average?.toFixed(1) || "N/A"}
          </p>
          <p>
            <strong>Genres:</strong>{" "}
            {selectedSearchedMovie.genre_ids
              ? selectedSearchedMovie.genre_ids
                  .map((id) => genreMap[id])
                  .filter(Boolean)
                  .join(", ")
              : "N/A"}
          </p>

          <CastInfo tmdb_id={selectedSearchedMovie.id} />

          <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
            <button
              onClick={() => addTmdbToWatched(selectedSearchedMovie)}
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
              onClick={() => addTmdbToWatchlist(selectedSearchedMovie)}
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