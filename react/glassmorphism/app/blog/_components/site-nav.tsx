import { Logo } from "@/components/glass/logo";
import { Navbar, NavLink } from "@/components/glass/navbar";
import { ThemeSwitch } from "@/components/glass/theme-switch";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/blog", label: "Blog" },
  { href: "/productos", label: "Productos" },
  { href: "/contacto", label: "Contacto" },
] as const;

/**
 * Navbar compartida de las vistas de catálogo (Blog, Productos, Contacto): mismo
 * `Navbar` de vidrio que el landing y el dashboard, con los enlaces entre vistas en vez
 * del ancla de secciones (RF-003, RF-005, RF-007). Sin cajón móvil propio: a este tamaño
 * de catálogo los enlaces caben en una sola fila incluso en pantallas pequeñas.
 */
export function SiteNav({ active }: { active?: (typeof LINKS)[number]["href"] }) {
  return (
    <Navbar>
      <Logo />
      <nav aria-label="Principal" className="ml-auto flex items-center gap-6 overflow-x-auto">
        {LINKS.map((l) => (
          <NavLink key={l.href} href={l.href} active={l.href === active}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <ThemeSwitch />
    </Navbar>
  );
}
