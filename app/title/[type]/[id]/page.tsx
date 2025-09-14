import { getDetails, getProviders, getReviews, verdict, yearOf } from "@/lib/tmdb";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RatingBadge from "@/components/RatingBadge";
import ProviderBadge from "@/components/ProviderBadge";

type Params = { params: { type: "movie" | "tv"; id: string }, searchParams: { region?: string } };

function RegionLinks({ current }: { current: string }) {
  const regions = ["AR", "ES", "MX", "US"];
  return (
    <div className="flex flex-wrap gap-2 text-sm">
      {regions.map((r) => (
        <a
          key={r}
          href={`?region=${r}`}
          className={`px-2 py-1 rounded-xl ring-1 ${current === r ? "bg-brand-600 text-white ring-transparent" : "bg-white/5 text-white/90 ring-white/15 hover:bg-white/10"}`}
        >
          {r}
        </a>
      ))}
    </div>
  );
}

export default async function TitlePage({ params, searchParams }: Params) {
  const { type, id } = params;
  const region = (searchParams.region || "AR").toUpperCase();

  let details: any;
  try {
    details = await getDetails(type, id);
  } catch (e) {
    return notFound();
  }

  const [reviewsRes, providersRes] = await Promise.all([
    getReviews(type, id),
    getProviders(type, id),
  ]);

  const poster = details.poster_path ? `https://image.tmdb.org/t/p/w342${details.poster_path}` : null;
  const title = type === "movie" ? details.title : details.name;
  const year = type === "movie" ? yearOf(details.release_date) : yearOf(details.first_air_date);
  const v = verdict(details.vote_average, details.vote_count);

  const providersForRegion = providersRes?.results?.[region] || null;
  const flatrate = providersForRegion?.flatrate || [];
  const rent = providersForRegion?.rent || [];
  const buy = providersForRegion?.buy || [];

  return (
    <div className="space-y-10">
      <div className="card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {poster ? (
            <img src={poster} alt={title} className="w-40 sm:w-56 rounded-xl ring-1 ring-white/15" />
          ) : (
            <div className="w-40 sm:w-56 h-64 rounded-xl bg-white/10 grid place-items-center">Sin imagen</div>
          )}
          <div className="flex-1 space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight">
              <span className="gradient-text">{title}</span> {year && <span className="text-white/70 font-medium">({year})</span>}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {details.genres?.length ? (
                <span className="text-white/80">{details.genres.map((g: any) => g.name).join(" • ")}</span>
              ) : null}
              {details.runtime ? <span className="text-white/60">• {details.runtime} min</span> : null}
              {details.number_of_seasons ? <span className="text-white/60">• {details.number_of_seasons} temporadas</span> : null}
            </div>
            <p className="text-white/90 leading-relaxed max-w-3xl">{details.overview || "Sin sinopsis disponible."}</p>
            <div className="flex items-center gap-3">
              <span className={`text-xs rounded-full px-2 py-1 ${v.color}`}>{v.label}</span>
              <RatingBadge value={details.vote_average} count={details.vote_count} />
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Donde ver</h2>
          <div className="flex items-center gap-3 text-sm text-white/80">
            <span>Region:</span>
            <RegionLinks current={region} />
          </div>
        </div>
        {!providersForRegion ? (
          <div className="text-white/70">No se encontraron plataformas para {region}.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4">
              <h3 className="font-medium mb-2">Suscripcion</h3>
              <div className="flex flex-wrap gap-2">
                {flatrate.length ? flatrate.map((p: any) => <ProviderBadge key={p.provider_id} p={p} />) : <span className="text-white/60 text-sm">Sin opciones</span>}
              </div>
            </div>
            <div className="card p-4">
              <h3 className="font-medium mb-2">Alquiler</h3>
              <div className="flex flex-wrap gap-2">
                {rent.length ? rent.map((p: any) => <ProviderBadge key={p.provider_id} p={p} />) : <span className="text-white/60 text-sm">Sin opciones</span>}
              </div>
            </div>
            <div className="card p-4">
              <h3 className="font-medium mb-2">Compra</h3>
              <div className="flex flex-wrap gap-2">
                {buy.length ? buy.map((p: any) => <ProviderBadge key={p.provider_id} p={p} />) : <span className="text-white/60 text-sm">Sin opciones</span>}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="section-title">Resenas</h2>
        {reviewsRes?.results?.length ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviewsRes.results.slice(0, 6).map((r: any) => (
              <li key={r.id} className="card p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium">{r.author}</div>
                  {r.author_details?.rating ? (
                    <span className="chip">⭐ {r.author_details.rating}/10</span>
                  ) : null}
                </div>
                <p className="text-white/90 text-sm mt-2 leading-relaxed">{r.content}</p>
                {r.url ? (
                  <a href={r.url} target="_blank" className="text-sm text-brand-300 hover:text-brand-200 mt-2 inline-block">Leer mas</a>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-white/70">Sin resenas disponibles.</div>
        )}
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { type: "movie" | "tv"; id: string } }): Promise<Metadata> {
  try {
    const d = await getDetails(params.type, params.id);
    const name = params.type === "movie" ? d.title : d.name;
    const y = params.type === "movie" ? yearOf(d.release_date) : yearOf(d.first_air_date);
    const desc = d.overview || "Resenas y donde ver";
    return {
      title: `${name} ${y ? `(${y})` : ""} — Franquito puto`,
      description: desc,
      openGraph: {
        title: `${name} ${y ? `(${y})` : ""} — Franquito puto`,
        description: desc,
      },
    };
  } catch {
    return { title: "Detalle — Franquito puto" };
  }
}

