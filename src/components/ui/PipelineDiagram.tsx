/**
 * A compact architecture diagram: steps joined by connectors with flowing data
 * packets. Stays on one line; scrolls sideways on narrow cards instead of wrapping.
 */
export function PipelineDiagram({ steps }: { steps: string[] }) {
  return (
    <div className="no-scrollbar -mx-5 overflow-x-auto px-5 [mask-image:linear-gradient(to_right,transparent,#000_20px,#000_calc(100%-28px),transparent)] sm:-mx-6 sm:px-6">
      <ol aria-label={`Architecture: ${steps.join(" → ")}`} className="flex w-max items-center py-1">
        {steps.map((step, i) => {
          const last = i === steps.length - 1;
          return (
            <li key={`${step}-${i}`} className="flex items-center">
              <span
                className={`rounded-lg border px-2 py-1.5 font-mono text-[11px] whitespace-nowrap ${
                  last
                    ? "border-accent/60 bg-accent/10 text-fg"
                    : i === 0
                      ? "border-border bg-surface text-fg"
                      : "border-border bg-surface text-muted"
                }`}
              >
                {step}
              </span>
              {!last && (
                <span aria-hidden="true" className="relative mx-1 h-px w-6 overflow-hidden bg-border">
                  <span
                    className="flow-dot absolute -top-[2px] left-0 size-[5px] rounded-full bg-accent"
                    style={{ animationDelay: `${i * 0.25}s` }}
                  />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
