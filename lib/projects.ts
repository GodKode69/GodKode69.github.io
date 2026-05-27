export type Project = {
  year: string;
  type: string;
  title: string;
  desc: string;
  links: { label: string; href?: string }[];
};

export const projects: Project[] = [
  {
    year: "2026",
    type: "Virtual Input System",
    title: "Open Gestures",
    desc: "A virtual input system working on three major operating systems.",
    links: [
      { label: "Not live" },
      { label: "Github", href: "https://github.com/godkode69/open-gestures" },
      { label: "Learn More ↗", href: "https://open-gestures.godkode.xyz" },
    ],
  },
  {
    year: "2026",
    type: "Discord Bot",
    title: "Fabric",
    desc: "An all-in-one discord.js bot with unique features.",
    links: [
      { label: "Invite", href: "" },
      { label: "Not open-source" },
      { label: "Learn More ↗", href: "https://fabric.godkode.xyz" },
    ],
  },
  {
    year: "2025",
    type: "AI Assisted Pokemon Catcher",
    title: "Project Monteria",
    desc: "An Auto Catcher For The Discord Bot @Pokétwo#8236.",
    links: [
      { label: "Not live" },
      { label: "Not open-source" },
      { label: "Learn More ↗", href: "./projects/monteria" },
    ],
  },
  {
    year: "2024",
    type: "Electron App",
    title: "Manga-App",
    desc: "Open-source manga downloader application for desktop devices. Made in collaboration with Siddhartha412.",
    links: [
      { label: "Not live" },
      { label: "GitHub ↗", href: "https://github.com/siddhartha412/manga-app" },
      { label: "Learn More ↗", href: "projects/manga-app" },
    ],
  },
  {
    year: "2025",
    type: "Discord CLI Tool",
    title: "Project Nebula",
    desc: "A multipurpose discord CLI tool with QOL features and capalibilities such as cloning and backing up discord servers.",
    links: [
      { label: "Not Live" },
      { label: "Github", href: "https://github.com/GodKode69/meta-cloner" },
      { label: "Learn More ↗", href: "./projects/nebula" },
    ],
  },
  {
    year: "2026",
    type: "API",
    title: "Fabric-API",
    desc: "A multipurpose discord CLI tool with QOL features and capalibilities such as cloning and backing up discord servers.",
    links: [
      { label: "Visit", href: "https://api.godkode.xyz" },
      { label: "Github", href: "https://github.com/GodKode69/meta-cloner" },
      { label: "Learn More ↗", href: "https" },
    ],
  },
];