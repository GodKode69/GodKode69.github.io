"use client";

import dynamic from "next/dynamic";

const Cursor = dynamic(() => import("@/components/Cursor"), { ssr: false });
const Helix = dynamic(() => import("@/components/Helix"), { ssr: false });

export default function ClientShell() {
  return (
    <>
      <Cursor />
      <Helix />
    </>
  );
}
