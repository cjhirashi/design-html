// Validación del formulario de contacto (T-026, RF-007/RF-013): valida en cliente y, si
// todo es válido, muestra el estado de éxito SIMULADO — sin red (P5). Mismo patrón global
// que theme-manager.js / nav-toggle.js. Degrada con elegancia: sin JS el `<form novalidate>`
// no envía a ningún lado (no hay action). Paridad con el ContactForm de react (T-025).
(function () {
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(id, msg) {
    var el = document.getElementById(id);
    if (!el) return;
    if (msg) {
      el.textContent = msg;
      el.hidden = false;
    } else {
      el.textContent = "";
      el.hidden = true;
    }
  }

  function init() {
    var form = document.querySelector("form[data-contact]");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = (form.elements.nombre.value || "").trim();
      var email = (form.elements.email.value || "").trim();
      var mensaje = (form.elements.mensaje.value || "").trim();
      var ok = true;

      if (!nombre) {
        setError("contacto-nombre-error", "Ingresa tu nombre.");
        ok = false;
      } else setError("contacto-nombre-error");

      if (!email) {
        setError("contacto-email-error", "Ingresa tu correo electrónico.");
        ok = false;
      } else if (!EMAIL_RE.test(email)) {
        setError("contacto-email-error", "Ese correo no tiene un formato válido.");
        ok = false;
      } else setError("contacto-email-error");

      if (!mensaje) {
        setError("contacto-mensaje-error", "Escribe un mensaje.");
        ok = false;
      } else setError("contacto-mensaje-error");

      if (ok) {
        var success = document.getElementById("contacto-success");
        if (success) success.hidden = false;
        form.hidden = true;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
