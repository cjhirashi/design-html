"use client";

import { useCallback, useState } from "react";

import { AuroraBackground } from "@/components/background/aurora-background";
import { Alert } from "@/components/glass/alert";
import { Breadcrumb, NotificationBell, ProfileChip, SearchField } from "@/components/glass/app-bar";
import { Identity } from "@/components/glass/avatar";
import { Badge } from "@/components/glass/badge";
import { Button } from "@/components/glass/button";
import { ChatPanel } from "@/components/glass/chat-panel";
import { DataTable, type Column } from "@/components/glass/data-table";
import { GlassCard } from "@/components/glass/glass-card";
import {
  ActivityIcon,
  ArrowLeftIcon,
  ChatIcon,
  DashboardIcon,
  DownloadIcon,
  MenuIcon,
  PlusIcon,
  SettingsIcon,
  TokensIcon,
} from "@/components/glass/icons";
import { LogoMark } from "@/components/glass/logo";
import { Metric } from "@/components/glass/metric";
import { BarButton, Navbar } from "@/components/glass/navbar";
import { Sidebar, SidebarItem, SidebarLabel } from "@/components/glass/sidebar";
import { ThemeSwitch } from "@/components/glass/theme-switch";
import {
  alert,
  breadcrumb,
  chat,
  header,
  menu,
  searchPlaceholder,
  services,
  stats,
  tableCaption,
  user,
  type ServiceRow,
} from "@/content/dashboard";

const ICONS = {
  dashboard: <DashboardIcon />,
  activity: <ActivityIcon />,
  tokens: <TokensIcon />,
  settings: <SettingsIcon />,
};

const columns: Column<ServiceRow>[] = [
  { key: "name", header: "Servicio / capa", cell: (r) => <strong className="font-semibold">{r.name}</strong> },
  { key: "status", header: "Estado actual", cell: (r) => <Badge tone={r.status.tone}>{r.status.label}</Badge> },
  { key: "token", header: "Token asignado", cell: (r) => <Badge tone={r.token.tone}>{r.token.label}</Badge> },
  { key: "checked", header: "Última verificación", cell: (r) => r.checkedAt, className: "font-mono text-muted" },
];

/** Dashboard: mismos componentes base que el landing con otra composición (RF-007). */
export function DashboardShell() {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const closeLeft = useCallback(() => setLeftOpen(false), []);
  const closeRight = useCallback(() => setRightOpen(false), []);

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
        <Breadcrumb root={breadcrumb.root} current={breadcrumb.current} />
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
          <nav aria-label="Secciones del panel" className="flex flex-col gap-1 p-4 lg:pt-6">
            {menu.map((group) => (
              <div key={group.label} className="flex flex-col gap-1 pb-4">
                <SidebarLabel>{group.label}</SidebarLabel>
                {group.items.map((item) => (
                  <SidebarItem
                    key={item.label}
                    href={item.href}
                    active={"active" in item && item.active}
                    icon={ICONS[item.icon]}
                    onNavigate={closeLeft}
                  >
                    {item.label}
                  </SidebarItem>
                ))}
              </div>
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
                <p className="text-sm text-fg-2">{header.subtitle}</p>
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

            <section aria-label="Métricas" className="grid grid-cols-[repeat(auto-fit,minmax(13.5rem,1fr))] gap-4">
              {stats.map((s) => (
                <GlassCard key={s.label} as="div" className="p-6">
                  <Metric {...s} />
                </GlassCard>
              ))}
            </section>

            <Alert label={alert.label} message={alert.message} action={<Button size="sm">{alert.action}</Button>} />

            <DataTable caption={tableCaption} columns={columns} rows={services} rowKey={(r) => r.id} />
          </div>
        </main>

        <Sidebar id="asistente" side="right" label="Asistente" open={rightOpen} onClose={closeRight} dockAt="xl">
          <ChatPanel {...chat} />
        </Sidebar>
      </div>
    </div>
  );
}
