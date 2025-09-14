export default function RatingBadge({ value, count }: { value?: number; count?: number }) {
  if (!value) return null;
  const color = value >= 7.5 ? "bg-emerald-600" : value >= 6.5 ? "bg-lime-600" : value >= 6 ? "bg-amber-600" : "bg-rose-600";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${color} text-white px-2 py-0.5 rounded-full`}>⭐ {value.toFixed(1)}{count ? ` (${count})` : ""}</span>
  );
}

