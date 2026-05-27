"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const cursorRef   = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor   = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;
    let rafId: number;

    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const onMove = (e: MouseEvent) => {
      if (!cursor.classList.contains("cursor-visible")) {
        cursor.classList.add("cursor-visible");
        follower.classList.add("cursor-visible");
      }
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + "px";
      cursor.style.top  = mouseY + "px";
    };

    const animate = () => {
      posX = lerp(posX, mouseX, 0.1);
      posY = lerp(posY, mouseY, 0.1);
      follower.style.left = posX + "px";
      follower.style.top  = posY + "px";
      rafId = requestAnimationFrame(animate);
    };

    animate();
    document.addEventListener("mousemove", onMove);

    // grow on hover-links
    const onEnter = () => follower.classList.add("cursor-grow");
    const onLeave = () => follower.classList.remove("cursor-grow");

    const attachHover = () => {
      document
        .querySelectorAll("a, .hover-link, .tech-stack span")
        .forEach((el) => {
          el.addEventListener("mouseenter", onEnter);
          el.addEventListener("mouseleave", onLeave);
        });
    };

    // attach immediately + re-attach if DOM changes (skills loaded async)
    attachHover();
    const mo = new MutationObserver(attachHover);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={cursorRef}   className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
}