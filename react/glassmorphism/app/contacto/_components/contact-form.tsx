"use client";

import { Button } from "@/components/glass/button";
import { Field } from "@/components/glass/field";

/**
 * Formulario de contacto (RF-007/RF-013) — MAQUETA (T-013): compone `Field` para
 * nombre/email/mensaje. El campo de email ya cablea la prop `error` (contrato visual
 * de RF-013: mensaje inline bajo el input) pero sin estado/validación — `emailError`
 * es una constante vacía, así que hoy no se renderiza ningún mensaje. T-025 conecta
 * la lógica real que calcula y pasa ese valor. El `onSubmit` solo previene el
 * comportamiento por defecto del navegador, sin validar ni enviar nada.
 */
export function ContactForm() {
  const emailError: string | undefined = undefined;

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Field label="Nombre" name="nombre" type="text" placeholder="Tu nombre" autoComplete="name" />
      <Field
        label="Correo electrónico"
        name="email"
        type="email"
        placeholder="tu@correo.com"
        autoComplete="email"
        error={emailError}
      />
      <Field label="Mensaje" name="mensaje" type="text" placeholder="¿En qué podemos ayudarte?" />

      <Button type="submit" className="self-start">
        Enviar mensaje
      </Button>
    </form>
  );
}
