"use client";

import dynamic from "next/dynamic";

const Work = dynamic(() => import("@/components/Work"), { ssr: false });

export default function WorkLazy() {
  return <Work />;
}
