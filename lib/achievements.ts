export type Achievement = {
  title: string;
  date: string;
  description: string;
  icon: string;
  link?: { label: string; href: string };
};

export const achievements: Achievement[] = [
  {
    title: "GitHub Contributions",
    date: "Since 21st May",
    description:
      "Over 40 days of daily contributions to github, commited more than 500 times this year.",
    icon: "/assets/icons/github.webp",
  },
  {
    title: "Pull Shark",
    date: "2025",
    description: "Merged multiple pull requests — x2 badge earned.",
    icon: "/assets/icons/pull-shark.webp",
    link: { label: "View on GitHub ↗", href: "https://github.com/GodKode69?tab=achievements" },
  },
  {
    title: "Pair Extraordinaire",
    date: "2025",
    description: "Co-authored commits with other developers on shared projects.",
    icon: "/assets/icons/pair-extraordinaire.webp",
    link: { label: "View on GitHub ↗", href: "https://github.com/GodKode69?tab=achievements" },
  },
  {
    title: "YOLO",
    date: "2025",
    description: "Merged code without waiting for review — sometimes you just gotta ship it.",
    icon: "/assets/icons/yolo.webp",
    link: { label: "View on GitHub ↗", href: "https://github.com/GodKode69?tab=achievements" },
  },
  {
    title: "Quickdraw",
    date: "2025",
    description: "Closed an issue quickly, demonstrating fast problem resolution.",
    icon: "/assets/icons/quickdraw.webp",
    link: { label: "View on GitHub ↗", href: "https://github.com/GodKode69?tab=achievements" },
  },
  {
    title: "Zen Browser",
    date: "Since 30th June",
    description:
      "Active contributor to Zen Browser, a privacy-focused web browser.",
    icon: "/assets/icons/zen-browser.webp",
  },
];
