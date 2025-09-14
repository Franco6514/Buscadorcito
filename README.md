# CinéGuía

Buscador de películas y series con Next.js + Tailwind. Sin backend propio: usa la API de TMDB desde componentes del servidor y rutas API de Next.

## Requisitos

- Node.js 18+
- Una API Key de TMDB en formato Bearer (TMDB v4).

## Configuración

1. Crear `.env.local` en la raíz con:

```
TMDB_API_KEY=tu_token_bearer_v4_aqui
```

2. Instalar dependencias y correr en local:

```
npm install
npm run dev
```

3. Abrir `http://localhost:3000`.

## Deploy en Vercel

- Importar el repo en Vercel.
- En Project Settings → Environment Variables, agregar `TMDB_API_KEY` con tu token Bearer v4.
- Deploy automático.

## Notas

- La búsqueda usa `/api/search` para no exponer la API key en el cliente.
- La página de detalle obtiene reseñas y plataformas (watch/providers) para la región elegida (AR/ES/MX/US).
- La indicación “¿vale la pena?” se infiere de la puntuación y cantidad de votos en TMDB.

