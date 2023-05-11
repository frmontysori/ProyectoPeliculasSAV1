import { FirebaseApp, initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import React from "react";

export interface FirebaseContextProps {
  firebaseApp: FirebaseApp | null;
  firebaseAuth: Auth | null;
}

const firebaseConfig = {
  apiKey: "AIzaSyBO8MyeKEg705hqwJ0BDr-h0_34uXG8iWw",
  authDomain: "proyectoreactpeliculas.firebaseapp.com",
  projectId: "proyectoreactpeliculas",
  storageBucket: "proyectoreactpeliculas.appspot.com",
  messagingSenderId: "710472542622",
  appId: "1:710472542622:web:60f42b2ff039d028954e8f",
  measurementId: "G-XS692503W3",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

const initFirebase = () => {
  if (!app || getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  }

  return app;
};

const FirebaseContext = React.createContext<FirebaseContextProps>({
  firebaseApp: initFirebase(),
  firebaseAuth: null,
});

export const FirebaseContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [firebaseApp, setFirebaseApp] = React.useState<FirebaseApp | null>(app);
  const [firebaseAuth, setFirebaseAuth] = React.useState<Auth | null>(auth);

  React.useEffect(() => {
    if (!firebaseApp) {
      setFirebaseApp(initFirebase());
    }

    if (!firebaseAuth) {
      setFirebaseAuth(getAuth());
    }
  }, [firebaseApp, firebaseAuth]);

  const contextValue: FirebaseContextProps = React.useMemo(
    () => ({
      firebaseApp,
      firebaseAuth,
    }),
    [firebaseApp, firebaseAuth]
  );

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebaseContext = () =>
  React.useContext<FirebaseContextProps>(FirebaseContext);
