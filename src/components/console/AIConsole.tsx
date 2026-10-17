"use client";

import { ArrowUpRight, CornerDownLeft, Download, Eye, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import type { ConsoleAction, KnowledgeBase } from "@/content/types";
import { setTheme } from "@/lib/theme";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { FOCUS_CONSOLE_EVENT, REVEAL_PHONE_EVENT } from "@/lib/events";
import { respond, toTokens, type ReplyTable } from "./engine";

type Stats = { ttft: number; tokens: number; tps: number };
type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
  streaming?: boolean;
  chips?: string[];
  actions?: ConsoleAction[];
  table?: ReplyTable;
  stats?: Stats;
};
type Status = "ready" | "thinking" | "streaming";

// Timing helpers live outside the component: they only run from event handlers.
const clock = () => performance.now();
const jitter = (min: number, max: number) => min + Math.random() * (max - min);

function triggerDownload(href: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = "";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function AIConsole({ kb }: { kb: KnowledgeBase }) {
  const greeting = useCallback(
    (): Message => ({ id: 0, role: "assistant", text: kb.greeting, chips: kb.suggestions }),
    [kb],
  );
  const [messages, setMessages] = useState<Message[]>(() => [greeting()]);
  const [status, setStatus] = useState<Status>("ready");
  const [input, setInput] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const reduced = useReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const finishCurrent = useRef<(() => void) | null>(null);
  const history = useRef<string[]>([]);
  const historyIndex = useRef(-1);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Keep the newest tokens in view (scrolls the log, never the page).
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  useEffect(() => {
    const onFocus = () => {
      rootRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      inputRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener(FOCUS_CONSOLE_EVENT, onFocus);
    return () => window.removeEventListener(FOCUS_CONSOLE_EVENT, onFocus);
  }, [reduced]);

  const send = (raw: string) => {
    const question = raw.trim();
    if (!question) return;
    finishCurrent.current?.();
    history.current.push(question);
    historyIndex.current = -1;
    setInput("");

    const reply = respond(question, kb);

    if (reply.effect?.type === "clear") {
      setMessages([greeting()]);
      setStatus("ready");
      return;
    }
    if (reply.effect?.type === "theme") setTheme(reply.effect);
    if (reply.effect?.type === "download") triggerDownload(reply.effect.href);

    const botId = nextId.current + 1;
    nextId.current += 2;
    setMessages((m) => [...m, { id: botId - 1, role: "user", text: question }]);
    setStatus("thinking");

    const tokens = toTokens(reply.text);
    const tableText = reply.table ? reply.table.rows.flat().join(" ") + " " + (reply.table.footnote ?? "") : "";
    const tokenCount = tokens.filter((t) => t.trim()).length; // only the streamed text, so tok/s stays honest
    const askedAt = clock();
    let firstTokenAt = 0;
    let shown = 0;

    const complete = () => {
      clearTimeout(timer.current);
      finishCurrent.current = null;
      const now = clock();
      if (!firstTokenAt) firstTokenAt = now;
      const seconds = Math.max(0.05, (now - firstTokenAt) / 1000);
      const final: Message = {
        id: botId,
        role: "assistant",
        text: reply.text,
        chips: reply.chips,
        actions: reply.actions,
        table: reply.table,
        stats: { ttft: Math.round(firstTokenAt - askedAt), tokens: tokenCount, tps: Math.round(tokenCount / seconds) },
      };
      setMessages((m) => (m.some((x) => x.id === botId) ? m.map((x) => (x.id === botId ? final : x)) : [...m, final]));
      setStatus("ready");
      setAnnouncement(reply.table ? `${reply.text} ${tableText}` : reply.text);
    };
    finishCurrent.current = complete;

    const tick = () => {
      shown = Math.min(tokens.length, shown + Math.floor(jitter(1, 4)));
      const partial = tokens.slice(0, shown).join("");
      setMessages((m) => m.map((x) => (x.id === botId ? { ...x, text: partial } : x)));
      if (shown >= tokens.length) complete();
      else timer.current = setTimeout(tick, jitter(16, 42));
    };

    timer.current = setTimeout(
      () => {
        firstTokenAt = clock();
        if (reduced) return complete();
        setMessages((m) => [...m, { id: botId, role: "assistant", text: "", streaming: true }]);
        setStatus("streaming");
        tick();
      },
      reduced ? 0 : jitter(280, 640),
    );
  };

  const runCommand = (cmd: string) => {
    if (cmd.includes("<")) {
      setInput(cmd.split("<")[0]);
      inputRef.current?.focus({ preventScroll: true });
    } else send(cmd);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const h = history.current;
    if (e.key === "ArrowUp" && h.length) {
      e.preventDefault();
      historyIndex.current = historyIndex.current < 0 ? h.length - 1 : Math.max(0, historyIndex.current - 1);
      setInput(h[historyIndex.current]);
    } else if (e.key === "ArrowDown" && historyIndex.current >= 0) {
      e.preventDefault();
      historyIndex.current += 1;
      if (historyIndex.current >= h.length) {
        historyIndex.current = -1;
        setInput("");
      } else setInput(h[historyIndex.current]);
    } else if (e.key === "Escape") {
      finishCurrent.current?.();
    }
  };

  const runAction = (action: ConsoleAction) => {
    const behavior = reduced ? "auto" : "smooth";
    if (action.type === "scroll") {
      document.getElementById(action.target)?.scrollIntoView({ behavior, block: "start" });
    } else if (action.type === "reveal-phone") {
      window.dispatchEvent(new Event(REVEAL_PHONE_EVENT));
      document.getElementById("contact")?.scrollIntoView({ behavior, block: "start" });
    }
  };

  const last = messages[messages.length - 1];
  const chips = status === "ready" && last.role === "assistant" ? last.chips : undefined;

  return (
    <div
      ref={rootRef}
      id="ask"
      className="card flex h-[min(64svh,560px)] min-h-[440px] scroll-mt-24 flex-col overflow-hidden bg-surface/80 shadow-2xl shadow-black/25 backdrop-blur-sm lg:h-[540px]"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="size-2.5 rounded-full bg-[#28c840]/80" />
        </div>
        <p className="truncate font-mono text-xs">
          <span className="text-fg">{kb.modelName}</span>
          <span className="text-subtle"> · local inference</span>
        </p>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 font-mono text-[10.5px] text-muted">
          <span
            className={`size-1.5 rounded-full ${status === "ready" ? "bg-emerald-400" : "animate-pulse bg-accent"}`}
            aria-hidden="true"
          />
          {status}
        </span>
      </div>

      {/* Conversation */}
      <div
        ref={listRef}
        role="log"
        aria-label={`Conversation with ${kb.firstName}'s portfolio assistant`}
        className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5"
      >
        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl rounded-br-md border border-border bg-elevated px-3.5 py-2 text-[14px] text-fg">
                {m.text}
              </p>
            </div>
          ) : (
            <div key={m.id} className="flex gap-3">
              <span className="bg-accent mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg text-accent-fg" aria-hidden="true">
                <Sparkles className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] leading-relaxed whitespace-pre-wrap text-fg/90">
                  {m.text}
                  {m.streaming && <span className="caret ml-0.5 inline-block h-4 w-[7px] translate-y-0.5 bg-accent" aria-hidden="true" />}
                </p>
                {m.table && !m.streaming && (
                  <div className="animate-fade-in mt-3 overflow-hidden rounded-xl border border-border">
                    <table className="w-full border-collapse text-left text-[13px]">
                      <thead>
                        <tr className="bg-elevated/60 font-mono text-[10.5px] tracking-widest text-subtle uppercase">
                          <th scope="col" className="px-3 py-2 font-medium">
                            {m.table.head[0]}
                          </th>
                          <th scope="col" className="px-3 py-2 font-medium">
                            {m.table.head[1]}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {m.table.rows.map(([cmd, desc]) => (
                          <tr key={cmd} className="border-t border-border/70">
                            <td className="px-3 py-2 align-top whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => runCommand(cmd)}
                                className="font-mono text-[12.5px] text-accent underline-offset-4 hover:underline"
                              >
                                {cmd}
                              </button>
                            </td>
                            <td className="px-3 py-2 align-top text-muted">{desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {m.table.footnote && (
                      <p className="border-t border-border/70 px-3 py-2 text-xs text-subtle">{m.table.footnote}</p>
                    )}
                  </div>
                )}
                {m.actions && !m.streaming && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.actions.map((a) => (
                      <ActionButton key={a.label} action={a} onRun={runAction} />
                    ))}
                  </div>
                )}
                {m.stats && (
                  <p className="mt-2 font-mono text-[10.5px] text-subtle">
                    ttft {m.stats.ttft}ms · {m.stats.tokens} tok · {m.stats.tps} tok/s
                  </p>
                )}
              </div>
            </div>
          ),
        )}
        {status === "thinking" && (
          <div className="flex items-center gap-3">
            <span className="bg-accent grid size-6 shrink-0 place-items-center rounded-lg text-accent-fg" aria-hidden="true">
              <Sparkles className="size-3.5" />
            </span>
            <span className="shimmer-text font-mono text-xs">thinking…</span>
          </div>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      {/* Suggestions */}
      {chips && chips.length > 0 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3 sm:px-5">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => send(c)}
              className="shrink-0 rounded-full border border-border bg-elevated/60 px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent/60 hover:text-fg"
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Prompt */}
      <form onSubmit={onSubmit} className="border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-bg/60 pl-3 focus-within:border-accent/70 focus-within:ring-2 focus-within:ring-accent/25">
          <span className="font-mono text-accent" aria-hidden="true">
            ›
          </span>
          <label htmlFor="ask-input" className="sr-only">
            Ask a question about {kb.firstName}
          </label>
          <input
            ref={inputRef}
            id="ask-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={`Ask anything about ${kb.firstName}…`}
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="send"
            className="min-w-0 flex-1 bg-transparent py-3 text-base text-fg outline-none placeholder:text-subtle focus-visible:outline-none sm:text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send"
            className="bg-accent m-1 grid size-9 shrink-0 place-items-center rounded-lg text-accent-fg transition-opacity disabled:opacity-35"
          >
            <CornerDownLeft className="size-4" />
          </button>
        </div>
        <p className="mt-2 px-1 font-mono text-[10.5px] text-subtle">
          Runs 100% in your browser · type <span className="text-muted">/help</span> for commands
        </p>
      </form>
    </div>
  );
}

function ActionButton({ action, onRun }: { action: ConsoleAction; onRun: (a: ConsoleAction) => void }) {
  const cls =
    "inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-medium text-fg transition-colors hover:bg-accent/20";
  if (action.type === "link") {
    const external = !action.href.startsWith("mailto:");
    return (
      <a href={action.href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {action.label}
        <ArrowUpRight className="size-3.5" />
      </a>
    );
  }
  if (action.type === "download") {
    return (
      <a href={action.href} download className={cls}>
        <Download className="size-3.5" />
        {action.label}
      </a>
    );
  }
  return (
    <button type="button" onClick={() => onRun(action)} className={cls}>
      {action.type === "reveal-phone" && <Eye className="size-3.5" />}
      {action.label}
    </button>
  );
}

export function AskButton({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <a
      href="#ask"
      onClick={(e) => {
        e.preventDefault();
        window.dispatchEvent(new Event(FOCUS_CONSOLE_EVENT));
      }}
      className={className}
    >
      {children}
    </a>
  );
}
