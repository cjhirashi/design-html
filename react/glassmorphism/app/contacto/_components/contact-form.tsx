"use client";

// Formulario de contacto FUNCIONAL (T-025, RF-007/RF-013): valida en cliente y, si todo
// es válido, muestra un estado de éxito SIMULADO — sin ninguna llamada de red (P5). Cada
// campo inválido muestra su error inline bajo el control (vía la prop `error` de `Field`,
// que ya lo pinta con role="alert"). No hay backend (§2): el "envío" solo cambia de estado.
import { useState } from "react";

import { Button } from "@/components/glass/button";
import { Field } from "@/components/glass/field";

type Errors = { nombre?: string; email?: string; mensaje?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nombre = String(data.get("nombre") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const mensaje = String(data.get("mensaje") ?? "").trim();

    const next: Errors = {};
    if (!nombre) next.nombre = "Ingresa tu nombre.";
    if (!email) next.email = "Ingresa tu correo electrónico.";
    else if (!EMAIL_RE.test(email)) next.email = "Ese correo no tiene un formato válido.";
    if (!mensaje) next.mensaje = "Escribe un mensaje.";

    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  }

  if (sent) {
    return (
      <div role="status" className="flex flex-col items-start gap-4">
        <span className="rounded-glass-sm bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
          Mensaje enviado
        </span>
        <p className="text-sm text-fg-2">
          Gracias por escribir. Te responderemos pronto. (Demostración: no se envió nada a ningún servidor.)
        </p>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setSent(false);
            setErrors({});
          }}
        >
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <form aria-label="Formulario de contacto" className="flex flex-col gap-5" noValidate onSubmit={handleSubmit}>
      <Field label="Nombre" name="nombre" type="text" placeholder="Tu nombre" autoComplete="name" error={errors.nombre} />
      <Field
        label="Correo electrónico"
        name="email"
        type="email"
        placeholder="tu@correo.com"
        autoComplete="email"
        error={errors.email}
      />
      <Field label="Mensaje" name="mensaje" as="textarea" placeholder="¿En qué podemos ayudarte?" error={errors.mensaje} />

      <Button type="submit" className="self-start">
        Enviar mensaje
      </Button>
    </form>
  );
}
