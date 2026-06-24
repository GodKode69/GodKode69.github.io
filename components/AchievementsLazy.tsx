"use client";

import dynamic from "next/dynamic";

const Achievements = dynamic(() => import("@/components/Achievements"), {
  ssr: false,
});

export default function AchievementsLazy() {
  return <Achievements />;
}
