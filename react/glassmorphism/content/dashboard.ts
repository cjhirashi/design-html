// Datos de maqueta del dashboard (P7). Fuente: glassmorphism/dashboard.html.
import type { Tone } from "@/components/glass/badge";
import type { ChatMessage } from "@/components/glass/chat-panel";

export const user = { initials: "CH", name: "Charlie H.", role: "Ingeniero UI" };

export const breadcrumb = { root: "Glass", current: "Panel principal" };
export const searchPlaceholder = "Buscar capas, nodos, tokens…";

export const menu = [
  {
    label: "General",
    items: [
      { href: "#", label: "Panel principal", icon: "dashboard", active: true },
      { href: "#", label: "Monitoreo glass", icon: "activity" },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "#", label: "Tokens CSS", icon: "tokens" },
      { href: "#", label: "Configuración", icon: "settings" },
    ],
  },
] as const;

export const header = {
  title: "Panel de control atmosférico",
  subtitle: "Telemetría y métricas de la capa de vidrio",
  exportLabel: "Exportar registros",
  createLabel: "Nuevo nodo",
};

export const stats: {
  label: string;
  value: string;
  trend?: { direction: "up" | "down"; value: string; label: string };
  status: { tone: Tone; label: string };
}[] = [
  {
    label: "Nodos activos",
    value: "12 / 12",
    trend: { direction: "up", value: "1.8%", label: "Sube" },
    status: { tone: "success", label: "100 % operativo" },
  },
  {
    label: "Latencia de capa",
    value: "18.2 ms",
    trend: { direction: "down", value: "6.1%", label: "Baja" },
    status: { tone: "warning", label: "Rango normal" },
  },
  {
    label: "Fallos críticos",
    value: "1 alerta",
    status: { tone: "error", label: "Requiere acción" },
  },
];

export const alert = {
  label: "Error crítico",
  message: "Fallo de renderizado en la capa translúcida #4. Se requiere optimizar el blur.",
  action: "Resolver",
};

export type ServiceRow = {
  id: string;
  name: string;
  status: { tone: Tone; label: string };
  token: { tone: Tone; label: string };
  checkedAt: string;
};

export const tableCaption = "Estado de servicios y capas";

export const services: ServiceRow[] = [
  {
    id: "motor",
    name: "Motor Glassmorphism",
    status: { tone: "success", label: "Operativo" },
    token: { tone: "primary", label: "Núcleo violeta" },
    checkedAt: "Hace 1 min",
  },
  {
    id: "blur",
    name: "Sincronizador de blur",
    status: { tone: "warning", label: "Carga alta" },
    token: { tone: "secondary", label: "Acento rosa" },
    checkedAt: "Hace 5 min",
  },
  {
    id: "buffer",
    name: "Búfer atmosférico",
    status: { tone: "error", label: "Desbordado" },
    token: { tone: "primary", label: "Núcleo violeta" },
    checkedAt: "Hace 12 min",
  },
];

export const chat: { title: string; placeholder: string; sendLabel: string; messages: ChatMessage[] } = {
  title: "Asistente Glass UI",
  placeholder: "Enviar comando al agente…",
  sendLabel: "Enviar",
  messages: [
    {
      id: "m1",
      from: "agent",
      text: "Hola, Charlie. Estilo glassmorphism activo, con fondo atmosférico y capas translúcidas.",
    },
    { id: "m2", from: "user", text: "Mucho mejor, esto sí se siente de nivel superior." },
  ],
};
