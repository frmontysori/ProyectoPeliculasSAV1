import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useFirebaseAuth } from "@/contexts/firebase-auth-context";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { logout } = useFirebaseAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
      <nav className="flex items-center justify-between p-6 bg-[#497740]">
        <div className="flex space-x-4">
          <Link href="/" passHref className="font-bold text-white">
            Home
          </Link>
          <Link
            href="/favoriteMovies"
            passHref
            className="font-bold text-white"
          >
            Favoritos
          </Link>
          <Link
            href="/trendingMovies"
            className="font-bold text-white"
            passHref
          >
            Películas en Tendencia
          </Link>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleLogout}
            className="focus:outline-none font-bold text-white"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>
      <main className="flex-grow">{children}</main>
      <footer className="p-6 text-center">
        <p>© {new Date().getFullYear()} Francisco Raudez</p>
      </footer>
    </div>
  );
};
