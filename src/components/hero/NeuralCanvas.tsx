"use client";

import { useEffect, useRef } from "react";
import { subscribeToTheme } from "@/lib/use-theme";

type Node = { x: number; y: number; vx: number; vy: number; r: number; hue: number };
type Pulse = { a: number; b: number; t: number; speed: number };
type RGB = [number, number, number];

function readColor(name: string): RGB {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const hex = raw.replace("#", "");
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
  const n = parseInt(full, 16);
  return Number.isNaN(n) ? [34, 211, 238] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const rgba = (c: RGB, a: number) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

/**
 * A living neural network: drifting nodes, distance-faded synapses and signal
 * pulses that hop from neuron to neuron. Canvas 2D only — no WebGL, no deps.
 * Pauses off-screen / in background tabs; renders a still frame for reduced motion.
 */
export function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let w = 0;
    let h = 0;
    let linkDist = 140;
    const nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let colors = { a: readColor("--accent"), b: readColor("--accent"), strength: 1 };
    const mouse = { x: -9999, y: -9999, active: false };
    let raf = 0;
    let running = false;
    let visible = true;
    let last = performance.now();
    let pulseTimer = 0;

    const readTheme = () => {
      const s = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--net-strength"));
      colors = { a: readColor("--accent"), b: readColor("--accent"), strength: Number.isNaN(s) ? 1 : s };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, finePointer ? 2 : 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.round(Math.min(finePointer ? 115 : 46, Math.max(32, (w * h) / 13000)));
      linkDist = Math.min(165, Math.max(100, Math.min(w, h) * 0.2));
      while (nodes.length < target) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 1 + Math.random() * 1.4,
          hue: Math.random(),
        });
      }
      nodes.length = target;
      for (const n of nodes) {
        n.x = Math.min(n.x, w);
        n.y = Math.min(n.y, h);
      }
      pulses = [];
    };

    const neighbours = (i: number) => {
      const out: number[] = [];
      const a = nodes[i];
      for (let j = 0; j < nodes.length; j++) {
        if (j === i) continue;
        const dx = a.x - nodes[j].x;
        const dy = a.y - nodes[j].y;
        if (dx * dx + dy * dy < linkDist * linkDist) out.push(j);
      }
      return out;
    };

    const spawnPulse = (from = Math.floor(Math.random() * nodes.length)) => {
      const ns = neighbours(from);
      if (!ns.length || pulses.length > 22) return;
      pulses.push({ a: from, b: ns[Math.floor(Math.random() * ns.length)], t: 0, speed: 0.012 + Math.random() * 0.014 });
    };

    const draw = (dt: number) => {
      const { a: ca, b: cb, strength } = colors;
      ctx.clearRect(0, 0, w, h);

      // Move nodes (frame-rate independent), with a gentle pull toward the cursor.
      for (const n of nodes) {
        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 180 * 180 && d2 > 1) {
            n.vx += (dx / Math.sqrt(d2)) * 0.006 * dt;
            n.vy += (dy / Math.sqrt(d2)) * 0.006 * dt;
          }
        }
        n.vx *= 0.995;
        n.vy *= 0.995;
        const speed = Math.hypot(n.vx, n.vy);
        if (speed < 0.08) {
          n.vx += (Math.random() - 0.5) * 0.02;
          n.vy += (Math.random() - 0.5) * 0.02;
        } else if (speed > 0.9) {
          n.vx *= 0.9;
          n.vy *= 0.9;
        }
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < -20) n.x = w + 20;
        else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        else if (n.y > h + 20) n.y = -20;
      }

      // Synapses.
      ctx.lineWidth = 1;
      const max2 = linkDist * linkDist;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > max2) continue;
          let alpha = (1 - d2 / max2) * 0.32 * strength;
          if (mouse.active) {
            const mx = (a.x + b.x) / 2 - mouse.x;
            const my = (a.y + b.y) / 2 - mouse.y;
            const m2 = mx * mx + my * my;
            if (m2 < 200 * 200) alpha += (1 - m2 / (200 * 200)) * 0.35 * strength;
          }
          ctx.strokeStyle = rgba(mix(ca, cb, (a.hue + b.hue) / 2), alpha);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // The cursor acts as an extra neuron.
      if (mouse.active) {
        for (const n of nodes) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > 170 * 170) continue;
          ctx.strokeStyle = rgba(ca, (1 - d2 / (170 * 170)) * 0.5 * strength);
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }
      }

      // Neurons.
      for (const n of nodes) {
        const c = mix(ca, cb, n.hue);
        ctx.fillStyle = rgba(c, 0.85 * strength);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Signal pulses travelling along synapses; some propagate onward.
      const next: Pulse[] = [];
      for (const p of pulses) {
        p.t += p.speed * dt;
        const a = nodes[p.a];
        const b = nodes[p.b];
        if (!a || !b) continue;
        if (p.t >= 1) {
          ctx.fillStyle = rgba(cb, 0.25 * strength);
          ctx.beginPath();
          ctx.arc(b.x, b.y, 6, 0, Math.PI * 2);
          ctx.fill();
          if (Math.random() < 0.65) {
            const ns = neighbours(p.b).filter((k) => k !== p.a);
            if (ns.length) next.push({ a: p.b, b: ns[Math.floor(Math.random() * ns.length)], t: 0, speed: p.speed });
          }
          continue;
        }
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const c = mix(ca, cb, p.t);
        ctx.fillStyle = rgba(c, 0.18 * strength);
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = rgba(c, strength);
        ctx.beginPath();
        ctx.arc(x, y, 1.9, 0, Math.PI * 2);
        ctx.fill();
        next.push(p);
      }
      pulses = next;
    };

    const loop = (now: number) => {
      const dt = Math.min(3, (now - last) / 16.67);
      last = now;
      pulseTimer += dt;
      if (pulseTimer > 14) {
        pulseTimer = 0;
        spawnPulse();
      }
      draw(dt);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    readTheme();
    resize();
    for (let i = 0; i < 6; i++) spawnPulse();
    draw(0);
    // Start animating once the browser is idle, so it never competes with hydration.
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 1200 })
      : window.setTimeout(start, 300);

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw(0);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const unsubscribeTheme = subscribeToTheme(() => {
      readTheme();
      if (!running) draw(0);
    });

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = mouse.y >= 0 && mouse.y <= rect.height;
    };
    const onLeave = () => (mouse.active = false);
    if (finePointer && !reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      stop();
      ro.disconnect();
      io.disconnect();
      unsubscribeTheme();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]"
    />
  );
}
