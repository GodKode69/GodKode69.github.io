export type Achievement = {
  id: string;
  title: string;
  date: string;
  description: string;
  icon: string;
  badges?: { icon: string; label: string; link?: string }[];
  link?: { label: string; href: string };
};

export const achievements: Achievement[] = [
  {
    id: "github-contributions",
    title: "GitHub Contributions",
    date: "Since 21st May",
    description:
      "Over 45 days of daily contributions to github, commited more than 500 times this year.",
    icon: "/assets/icons/github.webp",
    link: { label: "View on GitHub ↗", href: "https://github.com/GodKode69?tab=overview&from=2026-07-01&to=2026-07-01" },
  },
  {
    id: "github-badges",
    title: "GitHub Badges",
    date: "2025",
    description:
      "Earned multiple GitHub achievement badges which include - 2x Pull Shark, YOLO, Pair Extraordinaire, and Quickdraw.",
    icon: "/assets/icons/github.webp",
    badges: [
      { icon: "/assets/icons/pull-shark.webp", label: "Pull Shark" },
      {
        icon: "/assets/icons/pair-extraordinaire.webp",
        label: "Pair Extraordinaire",
      },
      { icon: "/assets/icons/yolo.webp", label: "YOLO" },
      { icon: "/assets/icons/quickdraw.webp", label: "Quickdraw" },
    ],
    link: { label: "View on GitHub ↗", href: "https://github.com/GodKode69?tab=achievements" },
  },
  {
    id: "open-source",
    title: "Open Source",
    date: "2025",
    description:
      "Active contributor to open source projects — Zen Browser and SideX.",
    icon: "",
    badges: [
      {
        icon: "/assets/icons/zen-browser.webp",
        label: "Zen Browser",
        link: "https://github.com/nicegoodthings/zen-browser",
      },
      {
        icon: "/assets/icons/sidex.webp",
        label: "SideX",
        link: "https://github.com/godkode69/sidex",
      },
    ],
  },
];
