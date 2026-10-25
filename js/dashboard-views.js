// Conmutador de vistas del dashboard (RF-002, paridad con el shell react): el sidebar-left
// activa una de las vistas del catálogo en el main-content. Mismo patrón global que
// theme-manager.js / nav-toggle.js (sin módulos, sin dependencias). Un solo panel visible a
// la vez; el resto lleva el atributo `hidden`. Degrada con elegancia: sin JS, el panel por
// defecto (sin `hidden` en el HTML) sigue visible.
(function () {
  function activateView(id) {
    var panels = document.querySelectorAll("[data-view]");
    var navs = document.querySelectorAll("[data-view-target]");
    panels.forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-view") !== id;
    });
    navs.forEach(function (btn) {
      var on = btn.getAttribute("data-view-target") === id;
      btn.classList.toggle("active", on);
      if (on) {
        btn.setAttribute("aria-current", "page");
      } else {
        btn.removeAttribute("aria-current");
      }
    });
  }

  function initDashboardViews() {
    var navs = document.querySelectorAll("[data-view-target]");
    if (!navs.length) return;
    navs.forEach(function (btn) {
      btn.addEventListener("click", function () {
        activateView(btn.getAttribute("data-view-target"));
        // Cerrar el cajón lateral en móvil tras elegir (mismo gesto que nav-toggle).
        if (typeof closeSidebars === "function") closeSidebars();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDashboardViews);
  } else {
    initDashboardViews();
  }
})();
