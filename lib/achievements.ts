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
      "Over 35 days of daily contributions to github, commited more than 350 times this year.",
    icon: "/assets/icons/github.png",
  },
  {
    title: "",
    date: "",
    description: "",
    icon: "",
  },
];
