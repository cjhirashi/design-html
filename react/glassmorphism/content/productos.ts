// Datos del listado y detalle de Productos (RF-005, RF-006). Presentacional: simulan
// la fuente real sin leer ningún archivo — la ficha de producto describe cada uno en
// texto plano (decisión de spec: sin Markdown en Producto Detalle).
export type Product = {
  slug: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  name: string;
  /** Precio ya formateado (p.ej. "$149.00 MXN"). */
  price: string;
  /** Descripción en texto plano (párrafos), sin marcado enriquecido (RF-006). */
  description: string[];
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
    description: [
      "Panel de vidrio esmerilado de 10 milímetros de espesor, con acabado translúcido que difumina la luz sin perder privacidad. Ideal para divisiones interiores, puertas de oficina o fachadas de baño.",
      "El esmerilado se aplica por ambos lados mediante arenado industrial, lo que evita marcas de dedos y facilita la limpieza con un paño húmedo.",
      "Incluye bordes pulidos y perforaciones para herrajes estándar bajo pedido. Tiempo de entrega: de 5 a 8 días hábiles según cantidad.",
    ],
  },
  {
    slug: "divisor-vidrio-templado",
    src: "/gallery/vidrio-02.jpg",
    width: 1200,
    height: 1531,
    alt: "Divisor de vidrio templado reflejando luz sobre una superficie de madera",
    name: "Divisor de vidrio templado",
    price: "$2,180.00 MXN",
    description: [
      "Divisor de vidrio templado de 12 milímetros, hasta cinco veces más resistente al impacto que un vidrio flotado del mismo espesor. Al romperse se fragmenta en piezas pequeñas y poco cortantes.",
      "Se monta sobre perfil de piso o pinzas de sujeción superior, sin marco perimetral, para mantener una vista limpia entre ambientes.",
      "Disponible en medidas estándar o a la medida del espacio. Requiere instalación profesional; el precio no incluye herrajes.",
    ],
  },
  {
    slug: "panel-vidrio-texturizado",
    src: "/gallery/vidrio-03.jpg",
    width: 1200,
    height: 800,
    alt: "Panel de vidrio texturizado con reflejos magenta y cian bajo luz baja",
    name: "Panel de vidrio texturizado",
    price: "$1,790.00 MXN",
    description: [
      "Panel de vidrio texturizado con relieve geométrico en una de sus caras, pensado para fachadas interiores y puertas que buscan un efecto decorativo sin perder el paso de luz natural.",
      "La textura se obtiene por laminado en caliente, por lo que es permanente y no se desgasta con la limpieza habitual.",
      "Compatible con marcos de aluminio y madera estándar. Se recomienda cotizar instalación por separado.",
    ],
  },
];
