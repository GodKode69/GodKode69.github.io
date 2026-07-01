"use client";

import { useEffect, useRef } from "react";

// --- Helpers ---
function parseColor(col: string) {
  if (col.startsWith("#")) {
    let hex = col.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  } else if (col.startsWith("rgb")) {
    const m = col.match(/\d+/g);
    return m
      ? { r: +m[0], g: +m[1], b: +m[2] }
      : { r: 0, g: 0, b: 0 };
  }
  return { r: 0, g: 0, b: 0 };
}

interface TrailPoint {
  x: number;
  y: number;
  life: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

interface TrailProps {
  variant?: "line" | "dots" | "particles" | "pixel";
  fillType?: "solid" | "gradient";
  trailColor?: string;
  trailColorEnd?: string;
  trailLength?: number;
  lineWidth?: number;
  fadeOut?: boolean;
  smoothing?: number;
  dotSize?: number;
  dotSpacing?: number;
  particleCount?: number;
  particleSize?: number;
  spreadAngle?: number;
  drift?: number;
  pixelSize?: number;
  snapToGrid?: boolean;
  blendMode?: GlobalCompositeOperation;
  autoFade?: boolean;
  fadeDuration?: number;
}

const HOVER_SELECTOR = "a, button, .hover-link, .tech-stack span";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailPointsRef = useRef<TrailPoint[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  const props: Required<TrailProps> = {
    variant: "line",
    fillType: "solid",
    trailColor: "#5f9ea0",
    trailColorEnd: "#5f9ea0",
    trailLength: 80,
    lineWidth: 3,
    fadeOut: true,
    smoothing: 0.3,
    dotSize: 6,
    dotSpacing: 10,
    particleCount: 6,
    particleSize: 3,
    spreadAngle: 30,
    drift: 0.4,
    pixelSize: 6,
    snapToGrid: true,
    blendMode: "source-over",
    autoFade: true,
    fadeDuration: 1,
  };

  const propsRef = useRef(props);
  useEffect(() => {
    propsRef.current = props;
  }, []);

  // --- Resize ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // --- Pointer events ---
  useEffect(() => {
    const cursor = cursorRef.current;
    const canvas = canvasRef.current;
    if (!cursor || !canvas) return;

    let isVisible = false;
    let hasMoved = false;

    const handlePointerMove = (e: PointerEvent) => {
      const canvasRect = canvas.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      const p = propsRef.current;
      const points = trailPointsRef.current;
      const last = points[points.length - 1];

      if (!hasMoved) {
        hasMoved = true;
      }

      if (!isVisible) {
        isVisible = true;
        cursor.classList.add("cursor-visible");
      }

      cursor.style.left = x + "px";
      cursor.style.top = y + "px";

      // Debounce dots based on spacing
      if (p.variant === "dots" && last) {
        const dx = x - last.x;
        const dy = y - last.y;
        if (Math.hypot(dx, dy) < p.dotSpacing) return;
      }

      // Smoothing
      const s = Math.max(0.001, 1 - p.smoothing);
      const sx = last ? last.x + (x - last.x) * s : x;
      const sy = last ? last.y + (y - last.y) * s : y;
      points.push({ x: sx, y: sy, life: 1 });

      // Trim length
      if (points.length > p.trailLength) {
        points.splice(0, points.length - p.trailLength);
      }

      // Spawn particles
      if (p.variant === "particles" && last) {
        const dx = sx - last.x;
        const dy = sy - last.y;
        const speed = Math.hypot(dx, dy);
        if (speed > 2) {
          const angle = Math.atan2(dy, dx);
          const spread = (p.spreadAngle * Math.PI) / 180;
          for (let i = 0; i < p.particleCount; i++) {
            const a = angle + (Math.random() - 0.5) * spread;
            const v = speed * 0.1 + Math.random() * 2;
            particlesRef.current.push({
              x: sx,
              y: sy,
              vx: Math.cos(a) * v,
              vy: Math.sin(a) * v,
              life: 0.8 + Math.random() * 0.4,
              size: p.particleSize + Math.random() * 1.5,
            });
          }
        }
      }
    };

    const handlePointerOver = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest(HOVER_SELECTOR)) {
        cursor.classList.add("cursor-grow");
      }
    };

    const handlePointerOut = (event: MouseEvent) => {
      const target = event.target;
      const relatedTarget = event.relatedTarget;
      if (!(target instanceof Element)) return;
      if (!target.closest(HOVER_SELECTOR)) return;
      if (
        relatedTarget instanceof Element &&
        relatedTarget.closest(HOVER_SELECTOR)
      ) {
        return;
      }
      cursor.classList.remove("cursor-grow");
    };

    const handleBlur = () => {
      isVisible = false;
      cursor.classList.remove("cursor-visible");
    };

    const handleMouseEnter = () => {
      isVisible = true;
      cursor.classList.add("cursor-visible");
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("mouseover", handlePointerOver);
    document.addEventListener("mouseout", handlePointerOut);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("mouseleave", handleBlur);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseover", handlePointerOver);
      document.removeEventListener("mouseout", handlePointerOut);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("mouseleave", handleBlur);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  // --- Animation loop ---
  useEffect(() => {
    timeRef.current = performance.now();

    const animate = () => {
      const now = performance.now();
      let dt = (now - timeRef.current) / 1000;
      dt = Math.max(0, Math.min(dt, 0.05));
      timeRef.current = now;

      const canvas = canvasRef.current;
      if (!canvas) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const p = propsRef.current;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.globalCompositeOperation = p.blendMode;
      ctx.clearRect(0, 0, rect.width, rect.height);

      const rgbStart = parseColor(p.trailColor);
      const rgbEnd = parseColor(p.trailColorEnd);

      const rgba = (a: number, t: number) => {
        if (p.fillType === "gradient") {
          const r = rgbStart.r + (rgbEnd.r - rgbStart.r) * t;
          const g = rgbStart.g + (rgbEnd.g - rgbStart.g) * t;
          const b = rgbStart.b + (rgbEnd.b - rgbStart.b) * t;
          return `rgba(${r | 0},${g | 0},${b | 0},${Math.max(0, Math.min(1, a))})`;
        }
        return `rgba(${rgbStart.r},${rgbStart.g},${rgbStart.b},${Math.max(0, Math.min(1, a))})`;
      };

      const points = trailPointsRef.current;

      // Age points
      if (p.autoFade && points.length) {
        const decay = dt / Math.max(0.001, p.fadeDuration);
        for (let i = points.length - 1; i >= 0; i--) {
          points[i].life -= decay;
          if (points[i].life <= 0) points.splice(i, 1);
        }
      }

      if (points.length < 1) {
        // Still update particles even if no trail points
        if (p.variant === "particles") {
          const particles = particlesRef.current;
          const damping = Math.pow(0.98, dt * 60);
          const g = (p.drift * 60 * 0.001 * dt * 60);
          const decayP = 1.6 * dt;
          for (let i = particles.length - 1; i >= 0; i--) {
            const pt = particles[i];
            pt.x += pt.vx * dt * 60;
            pt.y += pt.vy * dt * 60;
            pt.vx *= damping;
            pt.vy = pt.vy * damping + g;
            pt.life -= decayP;
            if (pt.life <= 0) {
              particles[i] = particles[particles.length - 1];
              particles.pop();
            } else {
              ctx.fillStyle = rgba(pt.life, 1 - pt.life);
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, pt.size * pt.life, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const indexAlpha = (i: number, n: number) => {
        if (!p.fadeOut) return 1;
        const t = n <= 1 ? 1 : i / (n - 1);
        return 1 - (1 - t) * (1 - t);
      };

      // --- Render variants ---
      if (p.variant === "dots") {
        for (let i = 0; i < points.length; i++) {
          const pt = points[i];
          const t = i / (points.length - 1 || 1);
          const a =
            indexAlpha(i, points.length) * (p.autoFade ? pt.life : 1);
          const r = p.dotSize * (p.fadeOut ? 0.3 + 0.7 * a : 1);
          ctx.fillStyle = rgba(a, t);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (p.variant === "pixel") {
        for (let i = 0; i < points.length; i++) {
          let { x, y } = points[i];
          if (p.snapToGrid) {
            x = Math.round(x / p.pixelSize) * p.pixelSize;
            y = Math.round(y / p.pixelSize) * p.pixelSize;
          }
          const t = i / (points.length - 1 || 1);
          const a =
            indexAlpha(i, points.length) *
            (p.autoFade ? points[i].life : 1);
          const s = p.pixelSize * (p.fadeOut ? 0.6 + 0.4 * a : 1);
          ctx.fillStyle = rgba(a, t);
          ctx.fillRect(x - s / 2, y - s / 2, s, s);
        }
      } else if (p.variant === "particles") {
        const particles = particlesRef.current;
        const damping = Math.pow(0.98, dt * 60);
        const g = (p.drift * 60 * 0.001 * dt * 60);
        const decayP = 1.6 * dt;
        for (let i = particles.length - 1; i >= 0; i--) {
          const pt = particles[i];
          pt.x += pt.vx * dt * 60;
          pt.y += pt.vy * dt * 60;
          pt.vx *= damping;
          pt.vy = pt.vy * damping + g;
          pt.life -= decayP;
          if (pt.life <= 0) {
            particles[i] = particles[particles.length - 1];
            particles.pop();
          } else {
            ctx.fillStyle = rgba(pt.life, 1 - pt.life);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.size * pt.life, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        // Connecting lines
        if (points.length > 1) {
          for (let i = 1; i < points.length; i++) {
            const p1 = points[i - 1];
            const p2 = points[i];
            const lifeFactor = p.autoFade ? points[i].life : 1;
            const a = 0.15 * indexAlpha(i, points.length) * lifeFactor;
            ctx.strokeStyle = rgba(a, i / (points.length - 1 || 1));
            ctx.lineWidth = Math.max(1, p.lineWidth * 0.5 * a);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      } else {
        // Line variant
        if (points.length < 2) {
          const pt = points[0];
          const a = p.autoFade ? pt.life : 1;
          ctx.fillStyle = rgba(a, 0);
          ctx.beginPath();
          ctx.arc(
            pt.x,
            pt.y,
            Math.max(1, p.lineWidth / 2),
            0,
            Math.PI * 2,
          );
          ctx.fill();
        } else {
          for (let i = 1; i < points.length; i++) {
            const p1 = points[i - 1];
            const p2 = points[i];
            const t = i / (points.length - 1 || 1);
            const lifeFactor = p.autoFade ? points[i].life : 1;
            const a = indexAlpha(i, points.length) * lifeFactor;
            const widthScale = p.fadeOut ? 0.3 + 0.7 * a : 1;
            ctx.strokeStyle = rgba(a, t);
            ctx.lineWidth = Math.max(1, p.lineWidth * widthScale);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <canvas
        ref={canvasRef}
        className="cursor-canvas"
        aria-label="Interactive mouse trail animation"
        role="img"
      />
    </>
  );
}
