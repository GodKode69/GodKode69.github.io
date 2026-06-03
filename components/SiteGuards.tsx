"use client";

import { useEffect } from "react";

export default function SiteGuards() {
  useEffect(() => {
    const preventContextMenu = (event: MouseEvent) => event.preventDefault();

    window.addEventListener("contextmenu", preventContextMenu);
    return () => window.removeEventListener("contextmenu", preventContextMenu);
  }, []);

  return null;
}
