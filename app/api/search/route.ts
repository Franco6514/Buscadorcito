import { NextRequest, NextResponse } from "next/server";

const TMDB_API = "https://api.themoviedb.org/3";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if (!q || !q.trim()) {
    return NextResponse.json({ results: [] });
  }
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Falta TMDB_API_KEY en variables de entorno" },
      { status: 500 }
    );
  }

  const url = new URL(`${TMDB_API}/search/multi`);
  url.searchParams.set("query", q);
  url.searchParams.set("include_adult", "false");
  url.searchParams.set("language", "es-ES");
  url.searchParams.set("page", "1");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${key}` },
    // Do not cache user search
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text || "TMDB error" }, { status: 500 });
  }
  const data = await res.json();

  const results = (data.results || [])
    .filter((r: any) => r.media_type === "movie" || r.media_type === "tv")
    .map((r: any) => ({
      id: r.id,
      media_type: r.media_type,
      title: r.title,
      name: r.name,
      poster_path: r.poster_path,
      release_date: r.release_date,
      first_air_date: r.first_air_date,
      vote_average: r.vote_average,
    }));

  return NextResponse.json({ results });
}

