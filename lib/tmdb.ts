const TMDB_API = "https://api.themoviedb.org/3";

function getKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("Configurar TMDB_API_KEY");
  return key;
}

export async function fetchTMDB(path: string, params?: Record<string, string | number | undefined>, cache: RequestCache = "force-cache") {
  const url = new URL(`${TMDB_API}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }
  if (!url.searchParams.has("language")) url.searchParams.set("language", "es-ES");
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${getKey()}` },
    cache,
    // Revalidate server fetches periodically
    next: { revalidate: 60 * 60 },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "TMDB request failed");
  }
  return res.json();
}

export async function getDetails(type: "movie" | "tv", id: string | number) {
  return fetchTMDB(`/${type}/${id}`, { append_to_response: "credits" });
}

export async function getReviews(type: "movie" | "tv", id: string | number) {
  return fetchTMDB(`/${type}/${id}/reviews`);
}

export async function getProviders(type: "movie" | "tv", id: string | number) {
  return fetchTMDB(`/${type}/${id}/watch/providers`);
}

export function verdict(voteAverage: number | undefined, voteCount: number | undefined) {
  if (!voteAverage || !voteCount) return { label: "Sin datos", color: "bg-white/10" };
  if (voteAverage >= 7.5 && voteCount >= 1000) return { label: "Sí, muy recomendable", color: "bg-green-600" };
  if (voteAverage >= 6.5 && voteCount >= 300) return { label: "Sí, recomendable", color: "bg-emerald-600" };
  if (voteAverage >= 6) return { label: "Depende de tus gustos", color: "bg-yellow-600" };
  return { label: "Meh, probablemente no", color: "bg-red-600" };
}

export function yearOf(date?: string | null) {
  if (!date) return "";
  return date.split("-")[0] || "";
}

