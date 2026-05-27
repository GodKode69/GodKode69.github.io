export type Skill = {
  name: string;
  icon: string;
  desc: string;
  level: number;
  category:
    | "Languages"
    | "Frontend"
    | "Backend / APIs"
    | "Databases"
    | "DevOps / Infra"
    | "Tooling / Workflow"
    | "Specialized";
};

export const skillCategoryDescriptions: Record<Skill["category"], string> = {
  Languages: "Core programming languages I use to build across the stack.",
  Frontend: "Interface and web app technologies focused on user-facing work.",
  "Backend / APIs":
    "Server-side logic, integrations, and platform-facing systems.",
  Databases:
    "Storage layers for structured and document-based application data.",
  "DevOps / Infra":
    "Deployment, version control, hosting, and infrastructure workflow.",
  "Tooling / Workflow":
    "Practical tools and habits that speed up building and debugging.",
  Specialized:
    "Niche areas and experiments beyond standard work.",
};

export const skills: Skill[] = [
  {
    name: "JavaScript",
    icon: "/assets/icons/js.png",
    desc: "High-level, dynamically typed, multi-paradigm programming language.",
    level: 65,
    category: "Languages",
  },
  {
    name: "SQL",
    icon: "/assets/icons/sql.png",
    desc: "Standardized language used to manage and manipulate relational databases.",
    level: 55,
    category: "Languages",
  },
  {
    name: "Node.JS",
    icon: "/assets/icons/nodejs.png",
    desc: "Runtime environment that allows JavaScript to be executed server-side.",
    level: 60,
    category: "Backend / APIs",
  },
  {
    name: "Python",
    icon: "/assets/icons/python.png",
    desc: "High-level interpreted programming language.",
    level: 30,
    category: "Languages",
  },
  {
    name: "C",
    icon: "/assets/icons/c.png",
    desc: "General-purpose procedural programming language.",
    level: 15,
    category: "Languages",
  },
  {
    name: "Linux",
    icon: "/assets/icons/linux.png",
    desc: "Open-source operating system kernel.",
    level: 30,
    category: "Specialized",
  },
  {
    name: "Discord.js",
    icon: "/assets/icons/djs.png",
    desc: "Library for interacting with the Discord API using Node.js.",
    level: 85,
    category: "Backend / APIs",
  },
  {
    name: "HTML",
    icon: "/assets/icons/html.png",
    desc: "Markup language used to define web page structure.",
    level: 45,
    category: "Frontend",
  },
  {
    name: "MongoDB",
    icon: "/assets/icons/mongo.png",
    desc: "Cross-platform document-oriented NoSQL database.",
    level: 50,
    category: "Databases",
  },
  {
    name: "Mongoose",
    icon: "/assets/icons/npm.png",
    desc: "MongoDB object modeling tool for Node.js.",
    level: 55,
    category: "Backend / APIs",
  },
  {
    name: "CSS",
    icon: "/assets/icons/css.png",
    desc: "Stylesheet language used for describing presentation of documents.",
    level: 40,
    category: "Frontend",
  },
  {
    name: "Documentation",
    icon: "/assets/icons/docs.png",
    desc: "Reading and implementing technical documentation.",
    level: 45,
    category: "Tooling / Workflow",
  },
  {
    name: "TypeScript",
    icon: "/assets/icons/ts.png",
    desc: "Statically typed superset of JavaScript.",
    level: 10,
    category: "Languages",
  },
  {
    name: "Electron",
    icon: "/assets/icons/npm.png",
    desc: "Framework for building desktop apps with web technologies.",
    level: 10,
    category: "Specialized",
  },
  {
    name: "GO",
    icon: "/assets/icons/go.png",
    desc: "Statically typed compiled programming language by Google.",
    level: 1,
    category: "Languages",
  },
  {
    name: "MySQL",
    icon: "/assets/icons/sql.png",
    desc: "Open-source relational database management system.",
    level: 55,
    category: "Databases",
  },
  {
    name: "NextJS",
    icon: "/assets/icons/nextjs.png",
    desc: "",
    level: 15,
    category: "Frontend",
  },
  {
    name: "Vercel",
    icon: "/assets/icons/vercel.png",
    desc: "",
    level: 45,
    category: "DevOps / Infra",
  },
  {
    name: "Git",
    icon: "/assets/icons/git.png",
    desc: "",
    level: 65,
    category: "DevOps / Infra",
  },
  {
    name: "Github",
    icon: "/assets/icons/github.png",
    desc: "",
    level: 65,
    category: "DevOps / Infra",
  },
  {
    name: "Automation",
    icon: "/assets/icons/automation.png",
    desc: "",
    level: 35,
    category: "Tooling / Workflow",
  },
  {
    name: "Github Workflows / Actions",
    icon: "/assets/icons/github.png",
    desc: "",
    level: 40,
    category: "DevOps / Infra",
  },

  {
    name: "API",
    icon: "/assets/icons/api.png",
    desc: "",
    level: 70,
    category: "Backend / APIs",
  },
  {
    name: "Containerization",
    icon: "/assets/icons/container.png",
    desc: "",
    level: 30,
    category: "DevOps / Infra",
  },
  {
    name: "Virtualization",
    icon: "/assets/icons/amazon-s3.png",
    desc: "",
    level: 45,
    category: "DevOps / Infra",
  },
  {
    name: "Amazon AWS",
    icon: "/assets/icons/aws.png",
    desc: "",
    level: 35,
    category: "DevOps / Infra",
  },
  {
    name: "Computer Vision",
    icon: "/assets/icons/cv.png",
    desc: "",
    level: 25,
    category: "Specialized",
  },
  {
    name: "npm",
    icon: "/assets/icons/npm.png",
    desc: "",
    level: 25,
    category: "Tooling / Workflow",
  },
  {
    name: "Debugging",
    icon: "/assets/icons/debug.png",
    desc: "",
    level: 25,
    category: "Tooling / Workflow",
  },
  {
    name: "OpenCV",
    icon: "/assets/icons/opencv.png",
    desc: "",
    level: 25,
    category: "Specialized",
  },
  {
    name: "Mediapipe",
    icon: "/assets/icons/mediapipe.webp",
    desc: "",
    level: 25,
    category: "Specialized",
  },
];
