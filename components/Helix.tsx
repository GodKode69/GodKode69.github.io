"use client";

import { useEffect, useRef, useState } from "react";

type StrandPoint = { x: number; y: number; t: number };

const STRAND_GREEN = "74, 222, 128";
const STRAND_YELLOW = "250, 204, 21";
const POINTS = 160;
const HEIGHT = 1200;
const W = 60;
const CX = W / 2;
const AMPLITUDE = 11;
const FREQ = 0.045;
const RUNG_EVERY = 8;
const BLOB_RADIUS = 12;

function getTaperedBlobPath(
  pts: StrandPoint[],
  maxRadius: number,
  tailRatio: number,
): string {
  if (pts.length < 2) return "";

  const left: string[] = [];
  const right: string[] = [];
  const lastIndex = pts.length - 1;
  const tailEnd = Math.min(lastIndex, Math.round(lastIndex * tailRatio));

  for (let i = 0; i < pts.length; i++) {
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(lastIndex, i + 1)];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;

    let radius = maxRadius;
    if (i <= tailEnd) {
      const taperProgress = i / Math.max(1, tailEnd);
      radius = maxRadius * taperProgress;
    }

    left.push(`${pts[i].x + nx * radius},${pts[i].y + ny * radius}`);
    right.push(`${pts[i].x - nx * radius},${pts[i].y - ny * radius}`);
  }

  return `M ${left[0]} L ${left.slice(1).join(" ")} L ${right.reverse().join(" ")} Z`;
}

const toPolyline = (pts: { x: number; y: number }[]) =>
  pts.map((p) => `${p.x},${p.y}`).join(" ");

export default function Helix() {
  const [scrollProgress, setScrollProgress] = useState<number | null>(null);
  const [tick, setTick] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? window.scrollY / docHeight : 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    let frame = 0;
    const loop = () => {
      if (document.hidden || document.documentElement.dataset.reducedMotion === "true") {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      frame++;
      if (frame % 2 === 0) setTick(t => t + 1);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (scrollProgress === null) return null;

  const waveOffset = tick * 1.2;

  const strandA: StrandPoint[] = [];
  const strandB: StrandPoint[] = [];

  for (let i = 0; i <= POINTS; i++) {
    const y = (i / POINTS) * HEIGHT;
    const angle = (y + waveOffset) * FREQ;
    strandA.push({ x: CX + Math.sin(angle) * AMPLITUDE, y, t: Math.sin(angle) });
    strandB.push({ x: CX + Math.sin(angle + Math.PI) * AMPLITUDE, y, t: Math.sin(angle + Math.PI) });
  }

  const pipIdx = Math.round(scrollProgress * POINTS);
  const blobStart = Math.max(0, pipIdx - BLOB_RADIUS);
  const blobEnd = Math.min(POINTS, pipIdx + BLOB_RADIUS);

  const blobA = strandA.slice(blobStart, blobEnd + 1);
  const blobB = strandB.slice(blobStart, blobEnd + 1);
  const blobPathA = getTaperedBlobPath(blobA, 6, 0.55);
  const blobPathB = getTaperedBlobPath(blobB, 6, 0.55);
  const blobCorePathA = getTaperedBlobPath(blobA, 1.75, 0.55);
  const blobCorePathB = getTaperedBlobPath(blobB, 1.75, 0.55);

  const trailEndY = strandA[blobEnd]?.y ?? 0;

  return (
    <div className="helix-rail" style={{ position: "fixed", right: "-10px", top: 0, height: "100vh", width: "4rem", pointerEvents: "none", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg
        width={W}
        height="100%"
        viewBox={`0 0 ${W} ${HEIGHT}`}
        preserveAspectRatio="none"
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id="glow-green" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-yellow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="blob-green" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="blob-yellow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          <linearGradient id="trail-core-mask-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="white" stopOpacity="1"    />
            <stop offset="85%"  stopColor="white" stopOpacity="0.6"  />
            <stop offset="100%" stopColor="white" stopOpacity="0.3"  />
          </linearGradient>
          <linearGradient id="trail-halo-mask-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="white" stopOpacity="1"   />
            <stop offset="45%"  stopColor="white" stopOpacity="0.65"/>
            <stop offset="80%"  stopColor="white" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"   />
          </linearGradient>
          <mask id="trail-core-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={HEIGHT}>
            <rect x="0" y="0" width={W} height={trailEndY} fill="url(#trail-core-mask-grad)" />
          </mask>
          <mask id="trail-halo-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={HEIGHT}>
            <rect x="0" y="0" width={W} height={trailEndY} fill="url(#trail-halo-mask-grad)" />
          </mask>

          <clipPath id="bar-clip">
            <rect x="0" y="0" width={W} height={HEIGHT} />
          </clipPath>
        </defs>

        <g clipPath="url(#bar-clip)">
          <polyline points={toPolyline(strandA)} fill="none" stroke={`rgba(${STRAND_GREEN},0.14)`} strokeWidth="1.5" />
          <polyline points={toPolyline(strandB)} fill="none" stroke={`rgba(${STRAND_YELLOW},0.14)`} strokeWidth="1.5" />

          <g mask="url(#trail-core-mask)">
            <polyline points={toPolyline(strandA)} fill="none" stroke={`rgba(${STRAND_GREEN},0.95)`} strokeWidth="1.5" />
            <polyline points={toPolyline(strandB)} fill="none" stroke={`rgba(${STRAND_YELLOW},0.95)`} strokeWidth="1.5" />
          </g>
          <g mask="url(#trail-halo-mask)">
            <polyline points={toPolyline(strandA)} fill="none" stroke={`rgba(${STRAND_GREEN},0.95)`} strokeWidth="2.1" filter="url(#glow-green)" />
            <polyline points={toPolyline(strandB)} fill="none" stroke={`rgba(${STRAND_YELLOW},0.95)`} strokeWidth="2.1" filter="url(#glow-yellow)" />
          </g>

          {strandA.map((a, i) => {
            if (i % RUNG_EVERY !== 0) return null;
            const b = strandB[i];
            const opacity = 0.08 + Math.abs(a.t) * 0.22;
            return (
              <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={`rgba(255,255,255,${opacity})`} strokeWidth="0.8" />
            );
          })}

          {strandA.map((a, i) => {
            if (i % 6 !== 0) return null;
            const b = strandB[i];
            const depthA = (a.t + 1) / 2;
            const depthB = (b.t + 1) / 2;
            return (
              <g key={i}>
                <circle cx={a.x} cy={a.y} r={1.5 + depthA * 2} fill={`rgba(${STRAND_GREEN},${0.2 + depthA * 0.8})`} filter="url(#glow-green)" />
                <circle cx={b.x} cy={b.y} r={1.5 + depthB * 2} fill={`rgba(${STRAND_YELLOW},${0.2 + depthB * 0.8})`} filter="url(#glow-yellow)" />
              </g>
            );
          })}

          {blobPathA && blobCorePathA && (
            <>
              <path d={blobPathA} fill={`rgba(${STRAND_GREEN},0.2)`} filter="url(#blob-green)" />
              <path d={blobCorePathA} fill={`rgba(${STRAND_GREEN},1)`} filter="url(#blob-green)" />
            </>
          )}
          {blobPathB && blobCorePathB && (
            <>
              <path d={blobPathB} fill={`rgba(${STRAND_YELLOW},0.2)`} filter="url(#blob-yellow)" />
              <path d={blobCorePathB} fill={`rgba(${STRAND_YELLOW},1)`} filter="url(#blob-yellow)" />
            </>
          )}

          {(() => {
            const a = strandA[pipIdx];
            const b = strandB[pipIdx];
            if (!a || !b) return null;
            return (
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" filter="url(#glow-green)" />
            );
          })()}
        </g>
      </svg>
    </div>
  );
}
