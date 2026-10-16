import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden px-4">
      <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative text-center">
        <p className="font-mono text-sm text-accent">error 404 · hallucination detected</p>
        <h1 className="text-accent mt-4 font-display text-[clamp(4rem,18vw,9rem)] leading-none font-bold">404</h1>
        <p className="mx-auto mt-6 max-w-md text-muted">
          This page isn&apos;t in my training data. Let&apos;s get you back to something grounded.
        </p>
        <Link
          href="/"
          className="bg-accent mt-8 inline-flex min-h-12 items-center rounded-full px-6 font-medium text-accent-fg"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
