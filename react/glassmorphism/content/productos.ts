// Datos del listado de Productos (RF-005). Presentacional: simulan la fuente real
// sin leer ningún archivo — la ficha de producto (T-011) describe cada uno en texto
// plano (decisión de spec: sin Markdown en Producto Detalle).
export type Product = {
  slug: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  name: string;
  /** Precio ya formateado (p.ej. "$149.00 MXN"). */
  price: string;
};

export const heading = {
  eyebrow: "Productos",
  title: "Piezas de vidrio para el catálogo",
};

export const products: Product[] = [
  {
    slug: "panel-vidrio-esmerilado",
    src: "/gallery/vidrio-01.jpg",
    width: 1200,
    height: 912,
    alt: "Panel de vidrio esmerilado translúcido con capas superpuestas en violeta y cian",
    name: "Panel de vidrio esmerilado",
    price: "$1,490.00 MXN",
  },
  {
    slug: "divisor-vidrio-templado",
    src: "/gallery/vidrio-02.jpg",
    width: 1200,
    height: 1531,
    alt: "Divisor de vidrio templado reflejando luz sobre una superficie de madera",
    name: "Divisor de vidrio templado",
    price: "$2,180.00 MXN",
  },
  {
    slug: "panel-vidrio-texturizado",
    src: "/gallery/vidrio-03.jpg",
    width: 1200,
    height: 800,
    alt: "Panel de vidrio texturizado con reflejos magenta y cian bajo luz baja",
    name: "Panel de vidrio texturizado",
    price: "$1,790.00 MXN",
  },
];
