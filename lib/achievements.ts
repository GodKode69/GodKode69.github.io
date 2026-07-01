export type Achievement = {
  id: string;
  title: string;
  date: string;
  description: string;
  icon: string;
  link?: { label: string; href: string };
};

export const achievements: Achievement[] = [
  {
    id: "github-contributions",
    title: "GitHub Contributions",
    date: "Since 21st May",
    description:
      "Over 40 days of daily contributions to github, commited more than 500 times this year.",
    icon: "/assets/icons/github.webp",
  },
  {
    id: "pull-shark",
    title: "Pull Shark",
    date: "2025",
    description: "Merged multiple pull requests — x2 badge earned.",
    icon: "/assets/icons/pull-shark.webp",
    link: { label: "View on GitHub ↗", href: "https://github.com/GodKode69?tab=achievements" },
  },
  {
    id: "pair-extraordinaire",
    title: "Pair Extraordinaire",
    date: "2025",
    description: "Co-authored commits with other developers on shared projects.",
    icon: "/assets/icons/pair-extraordinaire.webp",
    link: { label: "View on GitHub ↗", href: "https://github.com/GodKode69?tab=achievements" },
  },
  {
    id: "yolo",
    title: "YOLO",
    date: "2025",
    description: "Merged code without waiting for review — sometimes you just gotta ship it.",
    icon: "/assets/icons/yolo.webp",
    link: { label: "View on GitHub ↗", href: "https://github.com/GodKode69?tab=achievements" },
  },
  {
    id: "quickdraw",
    title: "Quickdraw",
    date: "2025",
    description: "Closed an issue quickly, demonstrating fast problem resolution.",
    icon: "/assets/icons/quickdraw.webp",
    link: { label: "View on GitHub ↗", href: "https://github.com/GodKode69?tab=achievements" },
  },
  {
    id: "zen-browser",
    title: "Zen Browser",
    date: "Since 30th June",
    description:
      "Active contributor to Zen Browser, a privacy-focused web browser.",
    icon: "/assets/icons/zen-browser.webp",
  },
];
