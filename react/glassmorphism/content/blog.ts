// Datos del listado de Blog (RF-003). Presentacional: simulan la fuente real
// (`content/blog/<slug>.md`) sin leer el archivo — el componente Markdown (T-022/T-023)
// renderiza el cuerpo completo en `app/blog/[slug]`.
export type Post = {
  slug: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  excerpt: string;
  /** Fecha ya formateada en español (p.ej. "24 de octubre de 2026"). */
  date: string;
};

export const heading = {
  eyebrow: "Blog",
  title: "Notas del laboratorio de diseño",
};

export const posts: Post[] = [
  {
    slug: "estructura-catalogo",
    src: "/gallery/vidrio-01.jpg",
    width: 1200,
    height: 912,
    alt: "Capas de vidrio translúcido superpuestas sobre un fondo degradado violeta y cian",
    title: "La estructura del catálogo ampliado de Glassmorphism",
    excerpt:
      "Por qué fijamos primero las siete vistas del catálogo — y sus secciones — antes de explorar variantes visuales, con el componente Markdown como caso de prueba.",
    date: "16 de octubre de 2026",
  },
  {
    slug: "paridad-entre-pistas",
    src: "/gallery/vidrio-02.jpg",
    width: 1200,
    height: 1531,
    alt: "Portátil abierto sobre una mesa de madera en una terraza",
    title: "Paridad entre la pista vanilla y la pista React",
    excerpt:
      "Cómo mantenemos los mismos componentes y el mismo contenido en HTML/CSS/JS y en Next.js sin duplicar la fuente de verdad.",
    date: "18 de octubre de 2026",
  },
  {
    slug: "tokens-de-vidrio",
    src: "/gallery/vidrio-03.jpg",
    width: 1200,
    height: 800,
    alt: "Computadoras retro y casetes bajo luz magenta y cian",
    title: "Una sola receta de vidrio para todos los componentes",
    excerpt:
      "La familia de tokens P3 y por qué el desenfoque `backdrop-*` vive en un único módulo (`surface.ts`) en lugar de repetirse por componente.",
    date: "20 de octubre de 2026",
  },
];
