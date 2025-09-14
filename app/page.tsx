"use client";
import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import RatingBadge from "@/components/RatingBadge";

type SearchResult = {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
};

export default function HomePage() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    async function run() {
      if (!q.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error("Error de búsqueda");
        const data = await res.json();
        setResults(data.results || []);
      } catch (e: any) {
        if (e.name !== "AbortError") setError(e.message || "Error");
      } finally {
        setLoading(false);
      }
    }
    const t = setTimeout(run, 300);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  const hasResults = results.length > 0;

  return (
    <div className="space-y-10">
      <section className="text-center space-y-5">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          <span className="gradient-text">Encontrá qué ver</span> al instante
        </h1>
        <p className="text-white/80 max-w-2xl mx-auto">
          Buscá una película o serie, leé reseñas reales y descubrí en qué plataforma verla.
        </p>
        <div className="max-w-2xl mx-auto card p-3 sm:p-4">
          <SearchBar value={q} onChange={setQ} placeholder="Buscar: Oppenheimer, The Bear, etc." />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="section-title">Resultados</h2>
        <div className="min-h-[3rem]">
          {loading && <div className="text-white/70">Buscando…</div>}
          {error && <div className="text-rose-400">{error}</div>}
          {!loading && !error && !hasResults && q && (
            <div className="text-white/60">Sin resultados</div>
          )}
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {results.map((r) => {
            const title = r.title || r.name;
            const date = (r.media_type === "movie" ? r.release_date : r.first_air_date) || "";
            const year = date ? date.split("-")[0] : "";
            return (
              <li key={`${r.media_type}-${r.id}`} className="card card-hover overflow-hidden">
                <a href={`/title/${r.media_type}/${r.id}`} className="flex gap-4 p-3">
                  {r.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${r.poster_path}`}
                      alt={title || "Poster"}
                      className="h-28 w-20 object-cover rounded-lg"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-28 w-20 rounded-lg bg-white/10 grid place-items-center text-xs text-white/60">
                      Sin imagen
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-tight line-clamp-2">{title}</h3>
                      <span className="chip uppercase">{r.media_type}</span>
                    </div>
                    <p className="text-white/60 text-sm mt-1">{year || "Sin fecha"}</p>
                    <div className="mt-2">
                      <RatingBadge value={r.vote_average} />
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
