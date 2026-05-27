"use client";

import { useEffect, useRef } from "react";

const HOVER_SELECTOR = "a, button, .hover-link, .tech-stack span";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    let posX = 0,
      posY = 0;
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

    const setVisible = () => {
      cursor.classList.add("cursor-visible");
      follower.classList.add("cursor-visible");
    };

    const setHidden = () => {
      cursor.classList.remove("cursor-visible");
      follower.classList.remove("cursor-visible");
      follower.classList.remove("cursor-grow");
    };

    const onPointerOver = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest(HOVER_SELECTOR)) {
        follower.classList.add("cursor-grow");
      }
    };

    const onPointerOut = (event: MouseEvent) => {
      const target = event.target;
      const relatedTarget = event.relatedTarget;
      if (!(target instanceof Element)) return;
      if (!target.closest(HOVER_SELECTOR)) return;
      if (relatedTarget instanceof Element && relatedTarget.closest(HOVER_SELECTOR)) {
        return;
      }
      follower.classList.remove("cursor-grow");
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onPointerOver);
    document.addEventListener("mouseout", onPointerOut);
    window.addEventListener("blur", setHidden);
    document.addEventListener("mouseleave", setHidden);
    document.addEventListener("mouseenter", setVisible);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onPointerOver);
      document.removeEventListener("mouseout", onPointerOut);
      window.removeEventListener("blur", setHidden);
      document.removeEventListener("mouseleave", setHidden);
      document.removeEventListener("mouseenter", setVisible);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
}
