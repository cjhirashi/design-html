function toggleNav() {
    const links = document.getElementById('navLinks');
    const scrim = document.getElementById('navScrim');
    const btn = document.getElementById('navToggleBtn');
    if (!links) return;
    const open = links.classList.toggle('nav-open');
    if (scrim) scrim.classList.toggle('scrim-visible', open);
    if (btn) btn.setAttribute('aria-expanded', String(open));
}

function closeNav() {
    const links = document.getElementById('navLinks');
    const scrim = document.getElementById('navScrim');
    const btn = document.getElementById('navToggleBtn');
    if (links) links.classList.remove('nav-open');
    if (scrim) scrim.classList.remove('scrim-visible');
    if (btn) btn.setAttribute('aria-expanded', 'false');
}

function toggleSidebar(side) {
    const el = document.querySelector(side === 'left' ? '.sidebar-left' : '.sidebar-right');
    const scrim = document.getElementById('sidebarScrim');
    if (!el) return;
    const open = el.classList.toggle('sidebar-open');
    if (scrim) scrim.classList.toggle('scrim-visible', open);
}

function closeSidebars() {
    document.querySelectorAll('.sidebar-left, .sidebar-right').forEach(el => el.classList.remove('sidebar-open'));
    const scrim = document.getElementById('sidebarScrim');
    if (scrim) scrim.classList.remove('scrim-visible');
}
