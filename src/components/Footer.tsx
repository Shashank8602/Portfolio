import { ArrowUp } from "lucide-react";

export function Footer({ name }: { name: string }) {
  return (
    <footer className="border-t border-border">
      <div className="container-x flex flex-col items-start justify-between gap-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] text-sm text-subtle sm:flex-row sm:items-center">
        <p>
          © {name} · Built with Next.js, Tailwind CSS &amp; a hand-rolled neural net.
        </p>
        <a href="#top" className="inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-fg">
          Back to top
          <ArrowUp className="size-4" />
        </a>
      </div>
    </footer>
  );
}
