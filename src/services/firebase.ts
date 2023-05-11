import { IMovie } from "@/contexts/peliculas-context";
import { User } from "firebase/auth";
import {
  addDoc,
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc, //
  setDoc, //
  updateDoc, //
} from "firebase/firestore";
  

export const saveFavoriteMovie = async (movie: IMovie, firebaseUser: User) => {
  try {
    const docRef = await addDoc(collection(getFirestore(), "movies"), {
      userId: firebaseUser.uid,
      ...movie,
    });

    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error(error);
  }
};

export const getTodos = async (firebaseUser: User) => {
  const firebaseQuery = query(
    collection(getFirestore(), "movies"),
    where("userId", "==", firebaseUser.uid)
  );

  const querySnapshot = await getDocs(firebaseQuery);
  const movies: IMovie[] = [];

  querySnapshot.forEach((doc) => {
    movies.push({ ...(doc.data() as IMovie) });
  });

  return movies;
};


//

export const createMovieRating = async (
  movieId: number,
  rating: number,
  firebaseUser: User
) => {
  try {
    const docRef = await addDoc(collection(getFirestore(), "ratings"), {
      movieId,
      userId: firebaseUser.uid,
      rating,
    });

    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error(error);
  }
};

export const getUserMovieRating = async (
  movieId: number,
  firebaseUser: User
) => {
  const firebaseQuery = query(
    collection(getFirestore(), "ratings"),
    where("movieId", "==", movieId),
    where("userId", "==", firebaseUser.uid)
  );

  const querySnapshot = await getDocs(firebaseQuery);
  if (querySnapshot.docs.length > 0) {
    return querySnapshot.docs[0].data().rating;
  }

  return null;
};

export const updateUserMovieRating = async (
  movieId: number,
  rating: number,
  firebaseUser: User
) => {
  const firebaseQuery = query(
    collection(getFirestore(), "ratings"),
    where("movieId", "==", movieId),
    where("userId", "==", firebaseUser.uid)
  );

  const querySnapshot = await getDocs(firebaseQuery);
  const docRef = querySnapshot.docs[0].ref;

  await updateDoc(docRef, {
    rating,
  });
};