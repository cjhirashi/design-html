import { cn } from "@/lib/utils";

import { Button } from "./button";
import { SendIcon } from "./icons";
import { glass } from "./surface";

export type ChatMessage = { id: string; from: "agent" | "user"; text: string };

/** Asistente lateral del dashboard (maqueta, sin envío real). */
export function ChatPanel({
  title,
  messages,
  placeholder,
  sendLabel,
}: {
  title: string;
  messages: ChatMessage[];
  placeholder: string;
  sendLabel: string;
}) {
  return (
    <section aria-label={title} className="flex h-full min-h-0 flex-col p-6 pt-4 xl:pt-6">
      <h2 className="border-b border-glass-line pb-3 text-[0.9375rem] font-semibold text-fg">{title}</h2>
      <ol className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto py-4">
        {messages.map((m) => (
          <li
            key={m.id}
            className={cn(
              "max-w-[88%] rounded-glass-sm px-4 py-3 text-[0.8125rem] leading-relaxed",
              m.from === "agent"
                ? cn(glass.control, "self-start text-fg")
                : "self-end bg-linear-135 from-primary-solid to-primary-hover font-semibold text-on-primary",
            )}
          >
            <span className="sr-only">{m.from === "agent" ? "Asistente: " : "Tú: "}</span>
            {m.text}
          </li>
        ))}
      </ol>
      <div className="flex gap-2 border-t border-glass-line pt-4">
        <label htmlFor="chat-input" className="sr-only">
          {placeholder}
        </label>
        <input
          id="chat-input"
          type="text"
          placeholder={placeholder}
          className={cn(
            glass.control,
            "h-10 min-w-0 flex-1 rounded-glass-sm px-3 text-sm text-fg placeholder:text-muted",
            "transition-[border-color,box-shadow] duration-200 ease-glass focus:border-primary focus:shadow-glow focus:outline-none motion-reduce:transition-none",
          )}
        />
        <Button size="md" className="px-3" aria-label={sendLabel}>
          <SendIcon />
        </Button>
      </div>
    </section>
  );
}
