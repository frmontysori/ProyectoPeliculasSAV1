import React, { useEffect } from "react";
import Image from "next/image";
import { MainLayout } from "@/components/layouts/MainLayout";
import { usePeliculasContext } from "@/contexts/peliculas-context";
import { useFirebaseAuth } from "@/contexts/firebase-auth-context";
import { ProtectedPage } from "@/components/layouts/ProtectedPage";
import {
  createMovieRating,
  getUserMovieRating,
  updateUserMovieRating,
} from "@/services/firebase";
import MovieRating from "@/components/molecules/Rating";

const Favoritas = () => {
  const {
    favoriteMovies,
    getFavoriteMovies,
    createMovieRating,
    getUserMovieRating,
    updateUserMovieRating,
  } = usePeliculasContext();
  const { user } = useFirebaseAuth();

  const handleRatingChange = async (newRating: number, movieId: number) => {
    if (!user) return;

    //todo take the function of the file
    const currentRating = await getUserMovieRating(movieId, user);
    if (currentRating === null) {
      await createMovieRating(movieId, newRating, user);
    } else {
      await updateUserMovieRating(movieId, newRating, user);
    }
  };

  useEffect(() => {
    if (user) {
      getFavoriteMovies(user);
    }
  }, [user, getFavoriteMovies]);

  return (
    <ProtectedPage>
      <MainLayout>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <h1 className="text-4xl font-bold text-center mb-8">
            Tus Películas Favoritas
          </h1>
          {user ? (
            <ul className="flex flex-wrap gap-6">
              {favoriteMovies.map((movie) => (
                <li
                  key={movie.id}
                  className="bg-white shadow-md rounded-lg p-4 w-64 h-96 flex flex-col items-center"
                >
                  <div className="relative w-full h-3/5">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      width={200}
                      height={200}
                      priority={true}
                      style={{ objectFit: "contain" }}
                      className="absolute top-0 left-0 w-full h-full"
                    />
                  </div>
                  <div className="h-2/5 flex flex-col justify-center items-center">
                    <p className="mt-2 mb-4 text-center line-clamp-2">
                      {movie.title}
                    </p>

                    <div className="px-3 py-1 mt-auto">
                      <MovieRating
                        movieId={movie.id}
                        changeRating={handleRatingChange}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center">
              Debes estar autenticado para ver tus películas favoritas.
            </p>
          )}
        </main>
      </MainLayout>
    </ProtectedPage>
  );
};

export default Favoritas;
