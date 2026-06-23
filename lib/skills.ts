export type Tier = "Beginner" | "Intermediate" | "Advanced" | "Expert" | "Master";

export type Skill = {
  name: string;
  icon: string;
  desc: string;
  tier: Tier;
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
    tier: "Expert",
    category: "Languages",
  },
  {
    name: "SQL",
    icon: "/assets/icons/sql.png",
    desc: "Standardized language used to manage and manipulate relational databases.",
    tier: "Advanced",
    category: "Languages",
  },
  {
    name: "Node.JS",
    icon: "/assets/icons/nodejs.png",
    desc: "Runtime environment that allows JavaScript to be executed server-side.",
    tier: "Advanced",
    category: "Backend / APIs",
  },
  {
    name: "Python",
    icon: "/assets/icons/python.png",
    desc: "High-level interpreted programming language.",
    tier: "Intermediate",
    category: "Languages",
  },
  {
    name: "C",
    icon: "/assets/icons/c.png",
    desc: "General-purpose procedural programming language.",
    tier: "Beginner",
    category: "Languages",
  },
  {
    name: "Linux",
    icon: "/assets/icons/linux.png",
    desc: "Open-source operating system kernel.",
    tier: "Intermediate",
    category: "Specialized",
  },
  {
    name: "Discord.js",
    icon: "/assets/icons/djs.png",
    desc: "Library for interacting with the Discord API using Node.js.",
    tier: "Master",
    category: "Backend / APIs",
  },
  {
    name: "HTML",
    icon: "/assets/icons/html.png",
    desc: "Markup language used to define web page structure.",
    tier: "Advanced",
    category: "Frontend",
  },
  {
    name: "MongoDB",
    icon: "/assets/icons/mongo.png",
    desc: "Cross-platform document-oriented NoSQL database.",
    tier: "Advanced",
    category: "Databases",
  },
  {
    name: "Mongoose",
    icon: "/assets/icons/npm.png",
    desc: "MongoDB object modeling tool for Node.js.",
    tier: "Advanced",
    category: "Backend / APIs",
  },
  {
    name: "CSS",
    icon: "/assets/icons/css.png",
    desc: "Stylesheet language used for describing presentation of documents.",
    tier: "Intermediate",
    category: "Frontend",
  },
  {
    name: "Documentation",
    icon: "/assets/icons/docs.png",
    desc: "Reading and implementing technical documentation.",
    tier: "Advanced",
    category: "Tooling / Workflow",
  },
  {
    name: "TypeScript",
    icon: "/assets/icons/ts.png",
    desc: "Statically typed superset of JavaScript.",
    tier: "Beginner",
    category: "Languages",
  },
  {
    name: "Electron",
    icon: "/assets/icons/npm.png",
    desc: "Framework for building desktop apps with web technologies.",
    tier: "Beginner",
    category: "Specialized",
  },
  {
    name: "GO",
    icon: "/assets/icons/go.png",
    desc: "Statically typed compiled programming language by Google.",
    tier: "Beginner",
    category: "Languages",
  },
  {
    name: "MySQL",
    icon: "/assets/icons/sql.png",
    desc: "Open-source relational database management system.",
    tier: "Advanced",
    category: "Databases",
  },
  {
    name: "NextJS",
    icon: "/assets/icons/nextjs.png",
    desc: "React framework for building production-ready web applications.",
    tier: "Beginner",
    category: "Frontend",
  },
  {
    name: "Vercel",
    icon: "/assets/icons/vercel.png",
    desc: "Deployment platform optimized for frontend apps and serverless delivery.",
    tier: "Advanced",
    category: "DevOps / Infra",
  },
  {
    name: "Git",
    icon: "/assets/icons/git.png",
    desc: "Distributed version control system for tracking and managing code changes.",
    tier: "Expert",
    category: "DevOps / Infra",
  },
  {
    name: "Github",
    icon: "/assets/icons/github.png",
    desc: "Code hosting platform for repositories, collaboration, and project workflows.",
    tier: "Expert",
    category: "DevOps / Infra",
  },
  {
    name: "Automation",
    icon: "/assets/icons/automation.png",
    desc: "Building scripts and flows that remove repetitive manual work.",
    tier: "Intermediate",
    category: "Tooling / Workflow",
  },
  {
    name: "Github Workflows / Actions",
    icon: "/assets/icons/github.png",
    desc: "CI/CD automation system for testing, building, and deploying from GitHub.",
    tier: "Intermediate",
    category: "DevOps / Infra",
  },

  {
    name: "API",
    icon: "/assets/icons/api.png",
    desc: "Designing and consuming interfaces that let systems communicate reliably.",
    tier: "Intermediate",
    category: "Backend / APIs",
  },
  {
    name: "Containerization",
    icon: "/assets/icons/container.png",
    desc: "Packaging applications with their runtime dependencies for portable deployment.",
    tier: "Intermediate",
    category: "DevOps / Infra",
  },
  {
    name: "Virtualization",
    icon: "/assets/icons/amazon-s3.png",
    desc: "Running isolated environments that emulate dedicated systems or services.",
    tier: "Advanced",
    category: "DevOps / Infra",
  },
  {
    name: "Amazon AWS",
    icon: "/assets/icons/aws.png",
    desc: "Cloud platform for hosting, storage, networking, and backend infrastructure.",
    tier: "Intermediate",
    category: "DevOps / Infra",
  },
  {
    name: "Computer Vision",
    icon: "/assets/icons/cv.png",
    desc: "Using code to interpret images, motion, and visual signals from the real world.",
    tier: "Intermediate",
    category: "Specialized",
  },
  {
    name: "npm",
    icon: "/assets/icons/npm.png",
    desc: "JavaScript package manager used for dependencies, scripts, and publishing.",
    tier: "Intermediate",
    category: "Tooling / Workflow",
  },
  {
    name: "Debugging",
    icon: "/assets/icons/debug.png",
    desc: "Tracing issues methodically to find, understand, and fix broken behavior.",
    tier: "Intermediate",
    category: "Tooling / Workflow",
  },
  {
    name: "OpenCV",
    icon: "/assets/icons/opencv.png",
    desc: "Computer vision library for image processing, tracking, and analysis tasks.",
    tier: "Intermediate",
    category: "Specialized",
  },
  {
    name: "Mediapipe",
    icon: "/assets/icons/mediapipe.webp",
    desc: "Framework for real-time perception pipelines like hand, pose, and face tracking.",
    tier: "Intermediate",
    category: "Specialized",
  },
];
