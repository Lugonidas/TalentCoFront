import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Rating({ initialRating = 0, onRatingChange, readOnly = false }) {
  const [rating, setRating] = useState(initialRating);
  const { user } = useAuth({ middleware: "auth" });

  // Actualiza el rating si initialRating cambia
  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleClick = (index, isHalf = false) => {
    if (readOnly) return; // No hacer nada si está en modo solo lectura

    const newRating = isHalf ? index + 0.5 : index + 1;
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const isFilled = i < Math.floor(rating);
      const isHalfFilled = i == Math.floor(rating) && rating % 1 !== 0;

      stars.push(
        <i
          key={i}
          className={`fa-solid fa-star ${
            isFilled ? "text-yellow-500" : "text-gray-300"
          } ${isHalfFilled ? "fa-star-half-alt" : ""} transition-all ease-linear ${
            user ? "hover:scale-125 hover:text-yellow-500 cursor-pointer" : ""
          } ${readOnly ? "cursor-default" : ""}`}
          onClick={() => handleClick(i, isHalfFilled)}
        ></i>
      );
    }
    return stars;
  };

  return <div className="flex">{renderStars()}</div>;
}
