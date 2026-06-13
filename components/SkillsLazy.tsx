"use client";

import dynamic from "next/dynamic";

const Skills = dynamic(() => import("@/components/Skills"), { ssr: false });

export default function SkillsLazy() {
  return <Skills />;
}
