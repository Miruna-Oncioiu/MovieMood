import React, { useState } from "react";
import CastInfo from "./castInfo";
import "./App.css";

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

export default function SearchByActor({ currentUser, addTmdbToWatched, addTmdbToWatchlist }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/search_by_actor?name=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data.results || []);
      setSelectedMovie(null); 
    } catch (err) {
      alert("Eroare la căutare");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Search Movies & TV Shows by Actor</h2>

      <input
        type="text"
        placeholder="Enter actor name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: 8, width: "60%", marginRight: 8 }}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Loading..." : "Search"}
      </button>

      {!selectedMovie ? (
        <>
          {results.length === 0 ? (
            <p style={{ marginTop: 20 }}>No results</p>
          ) : (
            <div
              className="trending-grid"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "15px",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              {results.map((item) => {
                const title = item.title || item.name || "Untitled";
                const posterPath = item.poster_path
                  ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                  : "https://via.placeholder.com/200x300?text=No+Image";
                return (
                  <div
                    key={item.credit_id || item.id}
                    onClick={() => setSelectedMovie(item)}
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
          )}
        </>
      ) : (
        <div style={{ maxWidth: 600, margin: "20px auto", textAlign: "left" }}>
          <button onClick={() => setSelectedMovie(null)} style={{ marginBottom: 20 }}>
            ← Back to Results
          </button>

          <h2>
            {selectedMovie.title || selectedMovie.name} (
            {(selectedMovie.release_date || selectedMovie.first_air_date)?.slice(0, 4) || "N/A"})
          </h2>

          <img
            src={
              selectedMovie.poster_path
                ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Image"
            }
            alt={selectedMovie.title || selectedMovie.name}
            style={{ width: "100%", borderRadius: "8px" }}
          />

          <p style={{ marginTop: 15 }}>
            {selectedMovie.overview || "No description available."}
          </p>

          <p>
            <strong>Rating:</strong> ⭐{" "}
            {selectedMovie.vote_average?.toFixed(1) || "N/A"}
          </p>

          <p>
            <strong>Genres:</strong>{" "}
            {selectedMovie.genre_ids
              ? selectedMovie.genre_ids
                  .map((id) => genreMap[id])
                  .filter(Boolean)
                  .join(", ")
              : "N/A"}
          </p>

          <CastInfo tmdb_id={selectedMovie.id} />

          <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
            <button
              onClick={() => addTmdbToWatched(selectedMovie)}
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
              onClick={() => addTmdbToWatchlist(selectedMovie)}
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
    </div>
  );
}
