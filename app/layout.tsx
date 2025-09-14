import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Franquito puto — Buscador de Películas y Series",
  description:
    "Busca películas y series, lee reseñas y descubre en qué plataforma verlas.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="relative">
          <header className="sticky top-0 z-40 bg-black/20 backdrop-blur supports-[backdrop-filter]:bg-black/20 border-b border-white/10">
            <div className="container-page flex items-center justify-between py-4">
              <a href="/" className="text-lg font-semibold gradient-text">Franquito puto</a>
              <nav className="text-sm text-white/80 flex items-center gap-2">
                <span className="hidden sm:inline text-white/50">Datos por</span>
                <a href="https://www.themoviedb.org/" target="_blank" className="btn-ghost">TMDB</a>
              </nav>
            </div>
          </header>
          <main className="container-page py-10 sm:py-12">{children}</main>
          <footer className="border-t border-white/10">
            <div className="container-page py-8 text-xs text-white/70 flex items-center justify-between">
              <span>Chino se la come</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
