export default function NotFound() {
  return (
    <div className="text-center space-y-3 py-16">
      <h1 className="text-2xl font-semibold">No encontrado</h1>
      <p className="text-white/70">No pudimos encontrar ese contenido.</p>
      <a href="/" className="btn-primary inline-block">Volver al inicio</a>
    </div>
  );
}

