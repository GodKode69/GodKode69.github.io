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
      document.documentElement.dataset.theme = next ? "light" : "dark";
      setLight(next);
      overlay.classList.add("fade-out");
      const onFadeEnd = () => {
        overlay.remove();
        wiping.current = false;
      };
      overlay.addEventListener("transitionend", onFadeEnd, { once: true });
    });

    close();
  }

  useEffect(() => {
    if (!menu) return;

    const firstItem = menuRef.current?.querySelector<HTMLElement>("[role='menuitem']");
    if (firstItem) firstItem.focus();

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }

      const items = menuRef.current?.querySelectorAll<HTMLElement>("[role='menuitem']");
      if (!items || items.length === 0) return;

      const focused = document.activeElement as HTMLElement | null;
      const idx = focused ? Array.from(items).indexOf(focused) : -1;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = idx < items.length - 1 ? idx + 1 : 0;
        items[next].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = idx > 0 ? idx - 1 : items.length - 1;
        items[prev].focus();
      }
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
      role="menu"
      style={{ left: menu.x, top: menu.y }}
    >
      <button
        type="button"
        role="menuitem"
        tabIndex={0}
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
        role="menuitem"
        tabIndex={0}
        className="ctx-item"
        onClick={() => toggleTheme()}
      >
        <span className="ctx-icon">{light ? "☀" : "☾"}</span>
        {light ? "Dark Mode" : "Light Mode"}
      </button>
    </div>
  );
}
