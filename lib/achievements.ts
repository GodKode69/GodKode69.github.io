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
    title: "Zen Browser",
    date: "Since 30th June",
    description:
      "Active contributor to Zen Browser, a privacy-focused web browser.",
    icon: "/assets/icons/zen-browser.webp",
  },
];
