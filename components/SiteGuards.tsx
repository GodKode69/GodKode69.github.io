"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MOTION_KEY = "godkode.reducedMotion";
const THEME_KEY = "godkode.lightMode";

function readStorage(key: string): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(key) === "true";
}

const DARK_BG = "#050505";
const LIGHT_BG = "#f0f0f2";

export default function SiteGuards() {
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [reduced, setReduced] = useState(() => readStorage(MOTION_KEY));
  const [light, setLight] = useState(() => readStorage(THEME_KEY));
  const menuRef = useRef<HTMLDivElement>(null);
  const wiping = useRef(false);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reduced);
    window.localStorage.setItem(MOTION_KEY, String(reduced));
  }, [reduced]);

  useEffect(() => {
    document.documentElement.dataset.theme = light ? "light" : "dark";
    window.localStorage.setItem(THEME_KEY, String(light));
  }, [light]);

  const close = useCallback(() => setMenu(null), []);

  function toggleTheme() {
    if (wiping.current) return;
    const next = !light;
    const targetBg = next ? LIGHT_BG : DARK_BG;

    const isReduced =
      document.documentElement.dataset.reducedMotion === "true";

    if (isReduced) {
      setLight(next);
      close();
      return;
    }

    wiping.current = true;

    const overlay = document.createElement("div");
    overlay.className = "theme-wipe";
    overlay.style.background = targetBg;
    document.body.appendChild(overlay);

    overlay.addEventListener("animationend", () => {
      overlay.remove();
      wiping.current = false;
    });

    setTimeout(() => {
      setLight(next);
    }, 200);

    close();
  }

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
      <button
        type="button"
        className="ctx-item"
        onClick={toggleTheme}
      >
        <span className="ctx-icon">{light ? "☀" : "☾"}</span>
        {light ? "Dark Mode" : "Light Mode"}
      </button>
    </div>
  );
}
