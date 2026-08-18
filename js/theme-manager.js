function setThemeMode(mode) {
    const root = document.documentElement;
    const switcher = document.getElementById('themeSwitcher');
    
    let activeTheme = mode;
    if (mode === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        activeTheme = prefersDark ? 'dark' : 'light';
    }

    if (activeTheme === 'dark') {
        root.setAttribute('data-theme', 'dark');
    } else {
        root.removeAttribute('data-theme');
    }

    if (switcher) {
        switcher.setAttribute('data-theme-mode', mode);
    }

    localStorage.setItem('theme-mode', mode);
}

// Inicialización automática al cargar cualquier página
window.addEventListener('DOMContentLoaded', () => {
    const savedMode = localStorage.getItem('theme-mode') || 'system';
    setThemeMode(savedMode);
});

// Escuchar cambios en el sistema operativo si está en modo 'system'
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const currentMode = localStorage.getItem('theme-mode');
    if (currentMode === 'system') {
        setThemeMode('system');
    }
});