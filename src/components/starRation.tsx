"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  initialRating?: number; // Default rating (optional)
  onChange?: (rating: number) => void; // Callback when rating changes
  interactive?: boolean; // Whether user can hover/click to select
}

const StarRating = ({
  initialRating = 0,
  onChange,
  interactive = false,
}: StarRatingProps) => {
  const [rating, setRating] = useState(initialRating); // Final selected rating
  const [hover, setHover] = useState<number | null>(null); // Hovered rating
  const [windowWidth, setWindowWidth] = useState(0);

  // Handle window resize for responsive star size
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const starSize = windowWidth < 640 ? 10 : 20;

  const handleMouseOver = (newRating: number) => {
    if (interactive) setHover(newRating);
  };

  const handleMouseLeave = () => {
    if (interactive) setHover(null);
  };

  const handleClick = (newRating: number) => {
    if (interactive) {
      setRating(newRating);
      if (onChange) onChange(newRating);
    }
  };

  // Calculate the fill percentage for partial stars
  const getStarFillPercentage = (starPosition: number) => {
    const displayRating = hover !== null ? hover : rating;

    if (displayRating >= starPosition) return 100;
    if (displayRating < starPosition - 1) return 0;

    // Calculate partial fill for decimal values
    return Math.round((displayRating - Math.floor(displayRating)) * 100);
  };

  return (
    <div className="flex items-center space-x-1 sm:space-x-2">
      <span className="text-sm font-medium ml-2 text-gray-700">
        {(hover !== null ? hover : rating).toFixed(1)}
      </span>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`cursor-${
            interactive ? "pointer" : "default"
          } transition-all duration-300 relative`}
          onMouseOver={() => handleMouseOver(i)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(i)}
        >
          {/* Background star (empty) */}
          <Star size={starSize} className="text-gray-400" />

          {/* Foreground star (filled) with clip path for partial fill */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              width: `${getStarFillPercentage(i)}%`,
            }}
          >
            <Star size={starSize} className="text-yellow-500 fill-yellow-500" />
          </div>
        </span>
      ))}
    </div>
  );
};

export default StarRating;
