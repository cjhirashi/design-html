// Enlaces de navegación compartidos entre las vistas de catálogo (Blog, Productos,
// Contacto): mismo `Navbar` de vidrio que el landing y el dashboard, con los enlaces
// entre vistas en vez del ancla de secciones (RF-003, RF-005, RF-007). Única fuente de
// verdad para evitar duplicar el arreglo de links por ruta.
export const catalogNav = [
  { href: "/", label: "Inicio" },
  { href: "/blog", label: "Blog" },
  { href: "/productos", label: "Productos" },
  { href: "/contacto", label: "Contacto" },
] as const;

export type CatalogNavHref = (typeof catalogNav)[number]["href"];
