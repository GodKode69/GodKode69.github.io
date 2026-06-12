"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "godkode.reducedMotion";

function readReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

export default function SiteGuards() {
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [reduced, setReduced] = useState(readReducedMotion);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reduced);
    window.localStorage.setItem(STORAGE_KEY, String(reduced));
  }, [reduced]);

  const close = useCallback(() => setMenu(null), []);

  useEffect(() => {
    if (!menu) return;

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menu, close]);

  useEffect(() => {
    const onContext = (e: MouseEvent) => {
      e.preventDefault();
      setMenu({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("contextmenu", onContext);
    return () => window.removeEventListener("contextmenu", onContext);
  }, []);

  if (!menu) return null;

  return (
    <div
      ref={menuRef}
      className="ctx-menu"
      style={{ left: menu.x, top: menu.y }}
    >
      <button
        type="button"
        className="ctx-item"
        onClick={() => {
          setReduced((r) => !r);
          close();
        }}
      >
        <span className="ctx-icon">{reduced ? "☑" : "☐"}</span>
        Reduced Motion
      </button>
    </div>
  );
}
