// Copy del landing (P7: español, dominio técnico). Fuente: glassmorphism/index.html.
import type { Tone } from "@/components/glass/badge";

export const nav = [
  { href: "#inicio", label: "Inicio", active: true },
  { href: "#sistema", label: "Sistema" },
  { href: "#galeria", label: "Galería" },
] as const;

export const hero = {
  badges: [
    { tone: "primary", label: "Núcleo violeta" },
    { tone: "secondary", label: "Acento rosa" },
  ] satisfies { tone: Tone; label: string }[],
  title: "Glassmorphism avanzado para agentes IA",
  lead: "Superficies translúcidas, desenfoque atmosférico y una separación cromática clara entre acentos y estados semánticos.",
  primaryCta: "Abrir dashboard",
  secondaryCta: "Ver sistema",
  mockupFile: "glass-telemetry.ui",
  telemetry: [
    { tone: "success", message: "[OK] Capa atmosférica estable", label: "Correcto" },
    { tone: "warning", message: "[WARN] Índice de blur alto", label: "Aviso" },
    { tone: "error", message: "[ERR] Desbordamiento de transparencia", label: "Error" },
  ] as const,
};

export const features = {
  eyebrow: "Validaciones",
  title: "Capas y retroalertas de vidrio",
  items: [
    {
      tone: "success",
      badge: "Estado correcto",
      title: "Operación óptima",
      body: "Indicadores verdes translúcidos para transacciones confirmadas y estabilidad general de nodos.",
    },
    {
      tone: "warning",
      badge: "Estado de aviso",
      title: "Precaución activa",
      body: "Alertas ámbar suaves que advierten sobre umbrales de recursos y latencias en la red.",
    },
    {
      tone: "error",
      badge: "Estado de error",
      title: "Fallo crítico",
      body: "Notificaciones rojas dedicadas en exclusiva a interrupciones y excepciones.",
    },
  ] as const,
};

export const gallery = {
  eyebrow: "Galería visual",
  title: "Carrusel glassmorphism",
  items: [
    {
      src: "/gallery/vidrio-01.jpg",
      width: 1200,
      height: 912,
      alt: "Ondas abstractas en degradado violeta, cian y naranja",
      tag: "Vidrio 01",
      title: "Geometría translúcida",
      body: "Composiciones con profundidad en capas y acentos violeta.",
    },
    {
      src: "/gallery/vidrio-02.jpg",
      width: 1200,
      height: 1531,
      alt: "Portátil abierto sobre una mesa de madera en una terraza",
      tag: "Vidrio 02",
      title: "Paneles atmosféricos",
      body: "Estructuras modulares con contrastes secundarios en tonos rosa.",
    },
    {
      src: "/gallery/vidrio-03.jpg",
      width: 1200,
      height: 800,
      alt: "Computadoras retro y casetes bajo luz magenta y cian",
      tag: "Vidrio 03",
      title: "Agentes en capas",
      body: "Monitoreo continuo de salud con códigos cromáticos estrictos.",
    },
  ],
};

export const footer = "© 2026 Carlos Alberto Jiménez Hirashi. Glassmorphism Design Architecture.";
