import axios from "axios";
import React from "react";
import { User } from "firebase/auth";
import { getTodos } from "@/services/firebase";
import {
  createMovieRating,
  getUserMovieRating,
  updateUserMovieRating,
} from "@/services/firebase";

const MOVIESDB_API_KEY = "0059339d711d4c0ac1f478249c434f02";

export interface IMovie {
  poster_path: string;
  adult: boolean;
  overview: string;
  release_date: string;
  genre_ids: number[];
  id: number;
  original_title: string;
  original_language: string;
  title: string;
  backdrop_path: string;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
}

interface PeliculasContextProps {
  popularMovies: IMovie[];
  trendingMovies: IMovie[];
  favoriteMovies: IMovie[]; // Nuevo campo
  getFavoriteMovies: (firebaseUser: User) => Promise<void>; // Nuevo campo
  /////////////////////////////////
  createMovieRating: (
    movieId: number,
    rating: number,
    firebaseUser: User
  ) => Promise<void>;
  getUserMovieRating: (
    movieId: number,
    firebaseUser: User
  ) => Promise<number | null>;
  updateUserMovieRating: (
    movieId: number,
    rating: number,
    firebaseUser: User
  ) => Promise<void>;
}

const PeliculasContext = React.createContext<PeliculasContextProps>({
  popularMovies: [],
  trendingMovies: [],
  favoriteMovies: [], // Nuevo valor inicial
  getFavoriteMovies: async () => {}, // Nuevo valor inicial
  ///////////////////////////////////////////
  createMovieRating: async () => {}, //
  getUserMovieRating: async () => null, //
  updateUserMovieRating: async () => {}, //
});

export const PeliculasContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [popularMovies, setPopularMovies] = React.useState<IMovie[]>([]);
  const [trendingMovies, setTrendingMovies] = React.useState<IMovie[]>([]);
  const [favoriteMovies, setFavoriteMovies] = React.useState<IMovie[]>([]); // Nuevo estado

  const getPopularMovies = React.useCallback(async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${MOVIESDB_API_KEY}&language=en-US&page=1`
    );
    console.log(response.data.results);
    setPopularMovies(response.data.results);
  }, []);

  const getTrendingMovies = React.useCallback(async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${MOVIESDB_API_KEY}&language=en-US&page=1`
    );
    console.log(response.data.results);
    setTrendingMovies(response.data.results);
  }, []);

  const getFavoriteMovies = React.useCallback(async (firebaseUser: User) => {
    const movies = await getTodos(firebaseUser);
    console.log("Favorite Movies:", movies); // Agregado console.log
    setFavoriteMovies(movies);
  }, []);

  React.useEffect(() => {
    getPopularMovies();
    getTrendingMovies();
  }, [getPopularMovies, getTrendingMovies]);

  const contextValue = React.useMemo(
    () => ({
      popularMovies,
      trendingMovies,
      favoriteMovies, // Agregado al valor del contexto
      getFavoriteMovies, // Agregado al valor del contexto
      createMovieRating, //
      getUserMovieRating, //
      updateUserMovieRating, //
    }),
    [popularMovies, trendingMovies, favoriteMovies, getFavoriteMovies]
  );

  return (
    <PeliculasContext.Provider value={contextValue}>
      {children}
    </PeliculasContext.Provider>
  );
};

export const usePeliculasContext = () =>
  React.useContext<PeliculasContextProps>(PeliculasContext);
