"use client";

import { useCallback, useState } from "react";

import { AuroraBackground } from "@/components/background/aurora-background";
import { Breadcrumb, NotificationBell, ProfileChip, SearchField } from "@/components/glass/app-bar";
import { Identity } from "@/components/glass/avatar";
import { Button } from "@/components/glass/button";
import { ChatPanel } from "@/components/glass/chat-panel";
import {
  ActivityIcon,
  ArrowLeftIcon,
  ChatIcon,
  DashboardIcon,
  DownloadIcon,
  LayersIcon,
  MenuIcon,
  PlusIcon,
  SettingsIcon,
  TokensIcon,
} from "@/components/glass/icons";
import { LogoMark } from "@/components/glass/logo";
import { BarButton, Navbar } from "@/components/glass/navbar";
import { Sidebar, SidebarItem, SidebarLabel } from "@/components/glass/sidebar";
import { ThemeSwitch } from "@/components/glass/theme-switch";
import {
  breadcrumb,
  chat,
  dashboardViews,
  header,
  searchPlaceholder,
  user,
  type DashboardViewId,
} from "@/content/dashboard";

import { ViewControles } from "./views/view-controles";
import { ViewFormulario } from "./views/view-formulario";
import { ViewMarkdown } from "./views/view-markdown";
import { ViewMetricas } from "./views/view-metricas";
import { ViewTabla } from "./views/view-tabla";
import { ViewTareas } from "./views/view-tareas";

const ICONS = {
  dashboard: <DashboardIcon />,
  activity: <ActivityIcon />,
  tokens: <TokensIcon />,
  layers: <LayersIcon />,
  plus: <PlusIcon />,
  settings: <SettingsIcon />,
} as const;

/**
 * Dashboard (RF-002, enmienda 2026-10-25): mismos componentes base que el landing con otra
 * composición (RF-007). El sidebar-left activa una de las vistas de `dashboardViews` en el
 * main-content (catálogo conmutable, ya no 5 bloques fijos). El contenido Markdown lo
 * renderiza el `page.tsx` server y llega por `markdownSlot` (ver `ViewMarkdown`).
 */
export function DashboardShell({ markdownSlot }: { markdownSlot?: React.ReactNode }) {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [view, setView] = useState<DashboardViewId>("tabla");
  const closeLeft = useCallback(() => setLeftOpen(false), []);
  const closeRight = useCallback(() => setRightOpen(false), []);

  const activeView = dashboardViews.find((v) => v.id === view) ?? dashboardViews[0];

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <AuroraBackground />

      <Navbar variant="app">
        <BarButton
          className="lg:hidden"
          label="Abrir menú lateral"
          expanded={leftOpen}
          controls="sidebar-izquierdo"
          onClick={() => setLeftOpen(true)}
        >
          <MenuIcon />
        </BarButton>
        <LogoMark className="hidden lg:flex" />
        <Breadcrumb root={breadcrumb.root} current={activeView.label} />
        <SearchField placeholder={searchPlaceholder} className="mx-auto hidden md:flex" />
        <div className="ml-auto flex items-center gap-1 sm:gap-2 md:ml-0">
          <BarButton
            className="xl:hidden"
            label="Abrir asistente"
            expanded={rightOpen}
            controls="asistente"
            onClick={() => setRightOpen(true)}
          >
            <ChatIcon />
          </BarButton>
          <NotificationBell label="Notificaciones: 1 sin leer" />
          <Identity {...user} hideTextBelow="md" />
        </div>
      </Navbar>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_320px]">
        <Sidebar
          id="sidebar-izquierdo"
          side="left"
          label="Navegación del panel"
          open={leftOpen}
          onClose={closeLeft}
          dockAt="lg"
        >
          <nav aria-label="Vistas del panel" className="flex flex-col gap-1 p-4 lg:pt-6">
            <SidebarLabel>Catálogo de vistas</SidebarLabel>
            {dashboardViews.map((item) => (
              <SidebarItem
                key={item.id}
                active={item.id === view}
                icon={ICONS[item.icon]}
                controls="dashboard-view-panel"
                onSelect={() => {
                  setView(item.id);
                  closeLeft();
                }}
              >
                {item.label}
              </SidebarItem>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-4 p-4 pt-0">
            <ProfileChip {...user} />
            <SidebarItem href="/" icon={<ArrowLeftIcon />}>
              Volver al landing
            </SidebarItem>
            <ThemeSwitch className="self-center" />
          </div>
        </Sidebar>

        <main className="min-h-0 overflow-y-auto">
          <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-10">
            <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight text-fg sm:text-[1.75rem]">{header.title}</h1>
                <p className="text-sm text-fg-2">{activeView.caption}</p>
              </div>
              <div className="grid gap-3 sm:flex">
                <Button variant="secondary">
                  <DownloadIcon />
                  {header.exportLabel}
                </Button>
                <Button>
                  <PlusIcon />
                  {header.createLabel}
                </Button>
              </div>
            </header>

            {/* RF-002: el main-content muestra la vista activa del catálogo. `data-view`
                ancla los tests de navegación (e2e) y de paridad vanilla↔react. */}
            <section id="dashboard-view-panel" data-view={view} aria-live="polite">
              <h2 className="sr-only">{activeView.label}</h2>
              {view === "tabla" && <ViewTabla />}
              {view === "metricas" && <ViewMetricas />}
              {view === "markdown" && <ViewMarkdown slot={markdownSlot} />}
              {view === "tareas" && <ViewTareas />}
              {view === "formulario" && <ViewFormulario />}
              {view === "controles" && <ViewControles />}
            </section>
          </div>
        </main>

        <Sidebar id="asistente" side="right" label="Asistente" open={rightOpen} onClose={closeRight} dockAt="xl">
          <ChatPanel {...chat} />
        </Sidebar>
      </div>
    </div>
  );
}
