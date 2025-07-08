import React, { useEffect, useState } from "react";
import './App.css';
const TMDB_API_KEY = "06ade31fb061203acc17db7ec37baeec";

function CastInfo({ tmdb_id, type = "movie" }) {
  const [cast, setCast] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tmdb_id) return;

    const fetchCast = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${type}/${tmdb_id}/credits?api_key=${TMDB_API_KEY}`
        );

        if (!response.ok) throw new Error("Failed to fetch cast");

        const data = await response.json();
        setCast(data.cast?.slice(0, 5) || []);
      } catch (err) {
        console.error("Eroare la încărcarea actorilor:", err);
        setError("Nu s-a putut încărca distribuția.");
      }
    };

    fetchCast();
  }, [tmdb_id, type]);

  if (error) return <p><strong>Actors:</strong> {error}</p>;
  if (!cast.length) return null;

  return (
    <p>
      <strong>Actors:</strong>{" "}
      {cast.map((actor, index) => (
        <span key={actor.id}>
          {actor.name}
          {index < cast.length - 1 ? ", " : ""}
        </span>
      ))}
    </p>
  );
}

export default CastInfo;
