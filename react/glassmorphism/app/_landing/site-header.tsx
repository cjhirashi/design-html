"use client";

import { useCallback, useState } from "react";

import { MenuIcon } from "@/components/glass/icons";
import { Logo } from "@/components/glass/logo";
import { BarButton, Navbar, NavLink } from "@/components/glass/navbar";
import { Sidebar, SidebarItem } from "@/components/glass/sidebar";
import { ThemeSwitch } from "@/components/glass/theme-switch";
import { nav } from "@/content/landing";

/** Navbar del landing: enlaces en desktop; bajo `lg`, cajón lateral (RF-006). */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <Navbar>
        <Logo />
        <nav aria-label="Principal" className="ml-auto hidden items-center gap-8 lg:flex">
          {nav.map((l) => (
            <NavLink key={l.href} href={l.href} active={"active" in l && l.active}>
              {l.label}
            </NavLink>
          ))}
          <NavLink href="/dashboard">Dashboard →</NavLink>
        </nav>
        <ThemeSwitch className="ml-auto lg:ml-0" />
        <BarButton
          className="lg:hidden"
          label="Abrir menú"
          expanded={open}
          controls="menu-movil"
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </BarButton>
      </Navbar>
      <Sidebar id="menu-movil" side="right" label="Menú principal" open={open} onClose={close}>
        <nav aria-label="Principal (móvil)" className="flex flex-col gap-1 p-4">
          {nav.map((l) => (
            <SidebarItem key={l.href} href={l.href} active={"active" in l && l.active} onNavigate={close}>
              {l.label}
            </SidebarItem>
          ))}
          <SidebarItem href="/dashboard" onNavigate={close}>
            Dashboard →
          </SidebarItem>
        </nav>
      </Sidebar>
    </>
  );
}
