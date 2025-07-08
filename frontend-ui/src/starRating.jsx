import { useState } from "react";

export default function StarRating({ initialRating = 0, onRate }) {
  const [rating, setRating] = useState(initialRating);

  const handleClick = (value) => {
    setRating(value);
    if (onRate) onRate(value); 
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          style={{
            cursor: "pointer",
            color: star <= rating ? "#FFD700" : "#ccc",
            fontSize: "24px",
            marginRight: 5,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
