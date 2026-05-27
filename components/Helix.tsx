"use client";

import { useEffect, useRef, useState } from "react";

export default function Helix() {
  const [scrollProgress, setScrollProgress] = useState<number | null>(null);
  const [tick, setTick] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? window.scrollY / docHeight : 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    // slow animation tick so the helix gently rotates independent of scroll
    let frame = 0;
    const loop = () => {
      frame++;
      if (frame % 2 === 0) setTick(t => t + 1); // update every 2 frames ~30fps is enough
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (scrollProgress === null) return null;

  const POINTS      = 160;
  const HEIGHT      = 1200;
  const W           = 60;
  const CX          = W / 2;
  const AMPLITUDE   = 11;
  const FREQ        = 0.045;
  const RUNG_EVERY  = 8;
  const BLOB_RADIUS = 12;

  // wave offset driven by time only — scroll does NOT move the helix
  const waveOffset = tick * 1.2;

  const strandA: { x: number; y: number; t: number }[] = [];
  const strandB: { x: number; y: number; t: number }[] = [];

  for (let i = 0; i <= POINTS; i++) {
    const y     = (i / POINTS) * HEIGHT;
    const angle = (y + waveOffset) * FREQ;
    strandA.push({ x: CX + Math.sin(angle) * AMPLITUDE,           y, t: Math.sin(angle) });
    strandB.push({ x: CX + Math.sin(angle + Math.PI) * AMPLITUDE, y, t: Math.sin(angle + Math.PI) });
  }

  const toPolyline = (pts: { x: number; y: number }[]) =>
    pts.map((p) => `${p.x},${p.y}`).join(" ");

  const pipIdx    = Math.round(scrollProgress * POINTS);
  const blobStart = Math.max(0, pipIdx - BLOB_RADIUS);
  const blobEnd   = Math.min(POINTS, pipIdx + BLOB_RADIUS);

  const blobA = strandA.slice(blobStart, blobEnd + 1);
  const blobB = strandB.slice(blobStart, blobEnd + 1);

  // trailEndY: the y-coordinate up to which we show the glow
  // this grows from 0 → HEIGHT as you scroll
  const trailEndY = strandA[blobEnd]?.y ?? 0;

  return (
    <div className="fixed right-[-10px] top-0 h-screen w-16 pointer-events-none z-50 flex items-center justify-center">
      <svg
        width={W}
        height="100%"
        viewBox={`0 0 ${W} ${HEIGHT}`}
        preserveAspectRatio="none"
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id="glow-cyan" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-pink" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="blob-cyan" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="blob-pink" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/*
            Mask rect spans 0 → trailEndY (the "visited" portion).
            Gradient inside goes fully opaque at top, fading to 15% at trailEndY.
            Since the rect's bottom edge = trailEndY and grows with scroll,
            the top is always pinned bright and the glow just extends downward.
          */}
          <linearGradient id="trail-mask-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="white" stopOpacity="1"    />
            <stop offset="85%"  stopColor="white" stopOpacity="0.6"  />
            <stop offset="100%" stopColor="white" stopOpacity="0.0"  />
          </linearGradient>
          <mask id="trail-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={HEIGHT}>
            <rect x="0" y="0" width={W} height={trailEndY} fill="url(#trail-mask-grad)" />
          </mask>

          <clipPath id="bar-clip">
            <rect x="0" y="0" width={W} height={HEIGHT} />
          </clipPath>
        </defs>

        <g clipPath="url(#bar-clip)">
          {/* ── dim base strands — always full length, always dim ── */}
          <polyline points={toPolyline(strandA)} fill="none" stroke="rgba(0,230,255,0.12)"  strokeWidth="1.5" />
          <polyline points={toPolyline(strandB)} fill="none" stroke="rgba(255,60,220,0.12)" strokeWidth="1.5" />

          {/* ── glowing trail — full strand masked to only show 0→trailEndY ── */}
          <g mask="url(#trail-mask)">
            <polyline points={toPolyline(strandA)} fill="none" stroke="rgba(0,230,255,1)"   strokeWidth="2" filter="url(#glow-cyan)" />
            <polyline points={toPolyline(strandB)} fill="none" stroke="rgba(255,60,220,1)"  strokeWidth="2" filter="url(#glow-pink)" />
          </g>

          {/* ── base-pair rungs ── */}
          {strandA.map((a, i) => {
            if (i % RUNG_EVERY !== 0) return null;
            const b       = strandB[i];
            const opacity = 0.08 + Math.abs(a.t) * 0.22;
            return (
              <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={`rgba(255,255,255,${opacity})`} strokeWidth="0.8" />
            );
          })}

          {/* ── nucleotide nodes ── */}
          {strandA.map((a, i) => {
            if (i % 6 !== 0) return null;
            const b      = strandB[i];
            const depthA = (a.t + 1) / 2;
            const depthB = (b.t + 1) / 2;
            return (
              <g key={i}>
                <circle cx={a.x} cy={a.y} r={1.5 + depthA * 2} fill={`rgba(0,230,255,${0.2 + depthA * 0.8})`}  filter="url(#glow-cyan)" />
                <circle cx={b.x} cy={b.y} r={1.5 + depthB * 2} fill={`rgba(255,60,220,${0.2 + depthB * 0.8})`} filter="url(#glow-pink)" />
              </g>
            );
          })}

          {/* ── blob ── */}
          {blobA.length > 1 && (
            <>
              <polyline points={toPolyline(blobA)} fill="none" stroke="rgba(0,230,255,0.2)"  strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points={toPolyline(blobA)} fill="none" stroke="rgba(0,230,255,1)"     strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#blob-cyan)" />
            </>
          )}
          {blobB.length > 1 && (
            <>
              <polyline points={toPolyline(blobB)} fill="none" stroke="rgba(255,60,220,0.2)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points={toPolyline(blobB)} fill="none" stroke="rgba(255,60,220,1)"    strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#blob-pink)" />
            </>
          )}

          {/* bright rung at blob centre */}
          {(() => {
            const a = strandA[pipIdx];
            const b = strandB[pipIdx];
            if (!a || !b) return null;
            return (
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" filter="url(#glow-cyan)" />
            );
          })()}
        </g>
      </svg>
    </div>
  );
}