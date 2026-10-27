// Estado vacío (RF-012): alterna entre el grid de items y el bloque `.empty-state`
// según el conteo real de hijos del grid. Sin red, sin build — misma convención que
// nav-toggle.js / theme-manager.js (funciones globales cargadas por <script>).
function toggleEmptyState(gridSelector, emptyStateId) {
    var grid = document.querySelector(gridSelector);
    var empty = document.getElementById(emptyStateId);
    if (!grid || !empty) return;
    var hayItems = grid.children.length > 0;
    grid.hidden = !hayItems;
    empty.hidden = hayItems;
}

document.addEventListener('DOMContentLoaded', function () {
    toggleEmptyState('.blog-grid', 'blogEmptyState');
    toggleEmptyState('.product-grid', 'productosEmptyState');
});
