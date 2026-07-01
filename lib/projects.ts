export type Project = {
  year: string;
  type: string;
  title: string;
  desc: string;
  icon?: string;
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
      { label: "GitHub ↗", href: "https://github.com/godkode69/open-gestures" },
      { label: "Learn More ↗", href: "https://open-gestures.godkode.xyz" },
    ],
  },
  {
    year: "2026",
    type: "Discord Bot",
    title: "Fabric",
    desc: "An all-in-one discord.js bot with unique features.",
    icon: "/assets/icons/f.gif",
    links: [
      {
        label: "Invite",
        href: "https://discord.com/oauth2/authorize?client_id=1226510987407130624",
      },
      { label: "Not Yet" },
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
      { label: "Not Yet" },
      { label: "Not Yet" },
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
      { label: "Learn More ↗", href: "/projects/manga-app" },
    ],
  },
  {
    year: "2025",
    type: "Discord CLI Tool",
    title: "Project Nebula",
    desc: "A multipurpose Discord CLI tool with QOL features and capabilities such as cloning and backing up Discord servers.",
    links: [
      { label: "Not Live" },
      { label: "GitHub ↗", href: "https://github.com/GodKode69/meta-cloner" },
      { label: "Learn More ↗", href: "/projects/nebula" },
    ],
  },
  {
    year: "2026",
    type: "API",
    title: "Fabric-API",
    desc: "An API layer for the Fabric ecosystem, focused on exposing reusable bot and platform functionality.",
    icon: "/assets/icons/f.gif",
    links: [
      { label: "Visit", href: "https://api.godkode.xyz" },
      { label: "GitHub ↗", href: "https://github.com/GodKode69/fabric-api" },
      { label: "Learn More ↗", href: "https://fabric.godkode.xyz" },
    ],
  },
  {
    year: "2026",
    type: "ML Model",
    title: "DorC",
    desc: "An image classification system built with PyTorch and EfficientNet-B0, using CLIP for zero-shot data verification. 108 classes, 97.2% accuracy, with a Next.js frontend for client-side inference.",
    icon: "/assets/icons/cv.webp",
    links: [
      { label: "Visit", href: "https://dorc.godkode.xyz" },
      { label: "GitHub ↗", href: "https://github.com/GodKode69/dorc" },
    ],
  },
  {
    year: "2026",
    type: "Mobile App",
    title: "Gallerio",
    desc: "A Flutter gallery application for managing and viewing images across Android and iOS.",
    links: [
      { label: "GitHub ↗", href: "https://github.com/GodKode69/gallerio" },
    ],
  },
];
