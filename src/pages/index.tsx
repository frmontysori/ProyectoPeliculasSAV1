import React from "react";
import Image from "next/image";
import { MainLayout } from "@/components/layouts/MainLayout";
import { usePeliculasContext } from "@/contexts/peliculas-context";
import { useFirebaseAuth } from "@/contexts/firebase-auth-context";
import { saveFavoriteMovie } from "@/services/firebase";
import MovieRating from "@/components/molecules/Rating";
import { ProtectedPage } from "@/components/layouts/ProtectedPage";

export default function Home() {
  const {
    popularMovies,
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

  return (
    <ProtectedPage>
      <MainLayout>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <h1 className="text-4xl font-bold text-center mb-8">Peliculas</h1>
          <ul className="flex flex-wrap gap-6">
            {popularMovies.map((movie) => (
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
                  <button
                    onClick={() => user && saveFavoriteMovie(movie, user)}
                    className="bg-[#497740] text-black font-semibold px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200 mt-auto"
                  >
                    Guardar en Favoritos
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </main>
      </MainLayout>
    </ProtectedPage>
  );
}
