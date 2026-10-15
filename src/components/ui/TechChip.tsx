import { techIcon } from "@/lib/tech-icons";

export function TechChip({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const icon = techIcon(name);
  const sm = size === "sm";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated/70 font-mono text-muted transition-colors hover:border-accent/60 hover:text-fg ${
        sm ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
      }`}
    >
      {icon && (
        <svg aria-hidden="true" className={sm ? "size-3" : "size-3.5"} fill="currentColor">
          <use href={`#ti-${icon.slug}`} />
        </svg>
      )}
      {name}
    </span>
  );
}

/** Defines each brand logo once; chips reference them with <use>, keeping the HTML small. */
export function TechIconSprite({ names }: { names: string[] }) {
  const icons = new Map(names.map((n) => techIcon(n)).filter((i) => !!i).map((i) => [i.slug, i]));
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      {[...icons.values()].map((i) => (
        <symbol key={i.slug} id={`ti-${i.slug}`} viewBox="0 0 24 24">
          <path d={i.path} />
        </symbol>
      ))}
    </svg>
  );
}
