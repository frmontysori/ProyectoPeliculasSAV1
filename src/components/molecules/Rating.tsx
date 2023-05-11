// src/components/MovieRating.tsx
import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import StarRatings from "react-star-ratings";
import { usePeliculasContext } from "@/contexts/peliculas-context";
import { useFirebaseAuth } from "@/contexts/firebase-auth-context";

interface MovieRatingProps {
  movieId: number;
  changeRating: (newRating: number, movieId: number) => Promise<void>;
}

const MovieRating: React.FC<MovieRatingProps> = ({ movieId }) => {
  const [userRating, setUserRating] = useState<number | null>(null);
  const { createMovieRating, getUserMovieRating, updateUserMovieRating } =
    usePeliculasContext();
  const { user } = useFirebaseAuth();

  useEffect(() => {
    const fetchUserRating = async () => {
      if (user) {
        const rating = await getUserMovieRating(movieId, user);
        setUserRating(rating);
      }
    };
    fetchUserRating();
  }, [movieId, user, getUserMovieRating]);

  const handleRatingChange = async (rating: number) => {
    if (!user) return;

    if (userRating === null) {
      await createMovieRating(movieId, rating, user);
    } else {
      await updateUserMovieRating(movieId, rating, user);
    }
    setUserRating(rating);
  };

  return (
    <StarRatings
      rating={userRating || 0}
      starRatedColor="gold"
      changeRating={handleRatingChange}
      numberOfStars={5}
      name="rating"
      starDimension="20px"
      starSpacing="2px"
    />
  );
};

export default MovieRating;
