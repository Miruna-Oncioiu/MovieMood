import React, { useState, useEffect } from "react";
import SearchMovies from "./search.jsx";
import MoodRecommendations from "./mood.jsx";
import TrendingMovies from "./trending.jsx";
import MovieList from "./movieList.jsx";
import SearchByActor from "./searchByActor.jsx";
import './App.css';
const API_URL = "http://127.0.0.1:8000";
const TMDB_API_KEY = "06ade31fb061203acc17db7ec37baeec";

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [mood, setMood] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("watched");
  const [trending, setTrending] = useState([]);
  const [selectedTrendingMovie, setSelectedTrendingMovie] = useState(null);
  const [selectedSearchedMovie, setSelectedSearchedMovie] = useState(null);
  const [selectedMoodMovie, setSelectedMoodMovie] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/users`)
      .then((res) => res.json())
      .then(setUsers)
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode]);

  useEffect(() => {
    if (!selectedUserId) return;

    fetch(`${API_URL}/movies`)
      .then((res) => res.json())
      .then(setMovies);

    fetch(`${API_URL}/users/${selectedUserId}/watched`)
      .then((res) => res.json())
      .then(enrichMoviesWithTmdb)
      .then(setWatched);

    fetch(`${API_URL}/users/${selectedUserId}/watchlist`)
      .then((res) => res.json())
      .then(enrichMoviesWithTmdb)
      .then(setWatchlist);
  }, [selectedUserId]);

  function toggleDarkMode() {
    setDarkMode((prev) => !prev);
  }

  function fetchTrendingMovies() {
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=06ade31fb061203acc17db7ec37baeec `)
      .then(res => res.json())
      .then(data => setTrending(data.results || []))
      .catch(err => console.error("Failed to fetch trending movies:", err));
  }

  function handleLogin() {
    const username = newUsername.trim();
    if (!username || !password) return;

    fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid credentials");
        return res.json();
      })
      .then((data) => {
        setCurrentUser(data.user);
        setSelectedUserId(data.user.id);
        setActiveSection("trending");
        setShowWelcome(true);
        fetchTrendingMovies();
        resetAuth();
      })
      .catch((err) => alert("Login failed: " + err.message));
  }

  function handleCreate() {
    const username = newUsername.trim();
    if (!username || !password) return;

    const exists = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    if (exists) {
      alert("User already exists. Try login.");
      return;
    }

    fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create user");
        return res.json();
      })
      .then((data) => {
        setUsers((prev) => [...prev, data.user]);
        setCurrentUser(data.user);
        setSelectedUserId(data.user.id);
        setActiveSection("trending");
        setShowWelcome(true);
        fetchTrendingMovies();
        resetAuth();
      })
      .catch((err) => alert("Error: " + err.message));
  }

  function resetAuth() {
    setAuthMode(null);
    setNewUsername("");
    setPassword("");
  }

function addTmdbToWatched(movie) {
  fetch(`${API_URL}/users/${selectedUserId}/watched_tmdb`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movie),
  })
  .then(() => {
    // Actualizează listele local după modificarea backend-ului
    fetch(`${API_URL}/movies`)
      .then((res) => res.json())
      .then(setMovies);

    fetch(`${API_URL}/users/${selectedUserId}/watched`)
      .then((res) => res.json())
      .then(setWatched);

    fetch(`${API_URL}/users/${selectedUserId}/watchlist`)
      .then((res) => res.json())
      .then(setWatchlist);
  })
  .catch((err) => {
    console.error("Eroare la actualizarea listei watched/watchlist:", err);
  });
}

  function addTmdbToWatchlist(movie) {
    fetch(`${API_URL}/users/${selectedUserId}/watchlist_tmdb`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movie),
    }).then(() => {
      fetch(`${API_URL}/movies`)
        .then((res) => res.json())
        .then(setMovies);

      fetch(`${API_URL}/users/${selectedUserId}/watchlist`)
        .then((res) => res.json())
        .then(setWatchlist);
    });
  }

  function getMoodRecommendations(mood) {
    setMood(mood);
    fetch(`${API_URL}/recommend_tmdb/${mood}`)
      .then((res) => res.json())
      .then((data) => setRecommendations(data || []))
      .catch((err) => console.error("Recommendation error:", err));
  }

  function handleLogout() {
    setCurrentUser(null);
    setSelectedUserId(null);
    setWatched([]);
    setWatchlist([]);
    setRecommendations([]);
    setSearchResults([]);
    setSearchQuery("");
    setSearched(false);
    setActiveSection("watched");
  }

  function handleSearch() {
    if (!searchQuery.trim()) return;

    fetch(`${API_URL}/search_movies?q=${encodeURIComponent(searchQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        setSearchResults(data.results || []);
        setSearched(true);
      })
      .catch((err) => {
        console.error("Error searching movies:", err);
        setSearchResults([]);
        setSearched(true);
      });
  }

  const fetchTmdbDetails = async (tmdb_id) => {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${tmdb_id}?api_key=${TMDB_API_KEY}&language=en-US`);
    if (!res.ok) throw new Error("TMDb fetch failed");
    return await res.json();
  } catch (err) {
    console.error(`Eroare TMDb la filmul ${tmdb_id}`, err);
    return null;
  }
};

const enrichMoviesWithTmdb = async (moviesFromDb) => {
  return Promise.all(
    moviesFromDb.map(async (movie) => {
      const tmdb = await fetchTmdbDetails(movie.tmdb_id);
      return {
        ...movie,
        ...tmdb,
      };
    })
  );
};

  return (
    <div
  style={{
    padding: currentUser ? "80px 20px 20px 20px" : "20px",
    textAlign: "center",
    minHeight: "100vh"
  }}
>

      {currentUser && (
        <header style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          backgroundColor: "#222",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          zIndex: 1000,
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
        }}>
          <span
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ cursor: "pointer", fontWeight: "bold" }}
          >
            👤 {currentUser.username}
          </span>
          <div>
            <button
              onClick={toggleDarkMode}
              style={{
                backgroundColor: darkMode ? "#ccc" : "#444",
                color: darkMode ? "#000" : "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "10px"
              }}
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </div>
        </header>
      )}

      {sidebarOpen && (
  <div
    style={{
      position: "fixed",
      top: 60,
      left: 0,
      bottom: 0,
      width: 200,
      backgroundColor: "#222",
      padding: "10px",
      boxShadow: "2px 0 5px rgba(0,0,0,0.2)",
      zIndex: 999
    }}
  >
    <button onClick={() => setActiveSection("watched")}>Watched Movies</button><br /><br />
    <button onClick={() => setActiveSection("watchlist")}>Watchlist</button><br /><br />
    <button onClick={() => setActiveSection("mood")}>Get Recommendations by Mood</button><br /><br />
    <button onClick={() => setActiveSection("search")}>Search</button><br /><br />
    <button onClick={() => setActiveSection("trending")}>Trending</button>
    <button onClick={() => setActiveSection("searchByActor")}>Search by Actor</button>
  </div>
)}
      <h1>Movie Recommender</h1>

      {!currentUser ? (
        <div style={{ marginTop: 60 }}>
          {authMode === null ? (
            <>
              <button onClick={() => setAuthMode("login")}>Login</button>{" "}
              <button onClick={() => setAuthMode("create")}>Create</button>
            </>
          ) : (
            <div style={{ marginTop: 30 }}>
              <h2>{authMode === "login" ? "Login" : "Create Account"}</h2>
              <input
                type="text"
                placeholder="Enter username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              /><br /><br />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              /><br /><br />
              <button
                onClick={authMode === "login" ? handleLogin : handleCreate}
              >
                {authMode === "login" ? "Login" : "Create"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {activeSection === "watched" && (
  <MovieList
    movies={watched}
    title="Watched Movies"
    addTmdbToWatched={addTmdbToWatched}
    addTmdbToWatchlist={addTmdbToWatchlist}
    currentUser={currentUser}
  />
)}

{activeSection === "watchlist" && (
  <MovieList
    movies={watchlist}
    title="Watchlist"
    addTmdbToWatched={addTmdbToWatched}
    addTmdbToWatchlist={addTmdbToWatchlist}
  />
)}

{activeSection === "mood" && (
  <MoodRecommendations
    recommendations={recommendations}
    selectedMoodMovie={selectedMoodMovie}
    setSelectedMoodMovie={setSelectedMoodMovie}
    getMoodRecommendations={getMoodRecommendations}
    addTmdbToWatched={addTmdbToWatched}
    addTmdbToWatchlist={addTmdbToWatchlist}
  />
)}

{activeSection === "search" && (
  <SearchMovies
    searchQuery={searchQuery}
    setSearchQuery={setSearchQuery}
    handleSearch={handleSearch}
    searched={searched}
    searchResults={searchResults}
    selectedSearchedMovie={selectedSearchedMovie}
    setSelectedSearchedMovie={setSelectedSearchedMovie}
    addTmdbToWatched={addTmdbToWatched}
    addTmdbToWatchlist={addTmdbToWatchlist}
  />
)}

    {activeSection === "trending" && (
  <TrendingMovies
    trending={trending}
    selectedTrendingMovie={selectedTrendingMovie}
    setSelectedTrendingMovie={setSelectedTrendingMovie}
    addTmdbToWatched={addTmdbToWatched}
    addTmdbToWatchlist={addTmdbToWatchlist}
    currentUser={currentUser}
    showWelcome={showWelcome}
    setShowWelcome={setShowWelcome}

  />
)}

    {activeSection === "searchByActor" && (
  <SearchByActor
    addTmdbToWatched={addTmdbToWatched}
    addTmdbToWatchlist={addTmdbToWatchlist}
  />
)}

        </>
      )}
    </div>
  );
}
export default App;