export default function ProviderBadge({ p }: { p: any }) {
  const logo = p?.logo_path ? `https://image.tmdb.org/t/p/w45${p.logo_path}` : null;
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/10 ring-1 ring-white/15 px-2.5 py-1.5 hover:bg-white/15 transition">
      {logo ? <img src={logo} alt={p.provider_name} className="h-6 w-6 rounded" /> : null}
      <span className="text-sm text-white/90">{p?.provider_name || "Proveedor"}</span>
    </div>
  );
}

