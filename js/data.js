/**
 * data.js - Portfolio Data Module
 * Contains all portfolio information that can be searched
 */

const portfolioData = {
  profile: {
    name: "Developer",
    title: "Full Stack Developer & Discord Bot Enthusiast",
    bio: "BCA Student | Building Discord bots, Web Apps & Games with JavaScript/TypeScript",
  },

  projects: [
    {
      id: 1,
      title: "Discord Bot Framework",
      description:
        "Advanced Discord bot with modular commands, event handlers, and database integration",
      tags: ["discord.js", "node.js", "mongodb"],
      link: "#",
    },
    {
      id: 2,
      title: "Game Visualizer",
      description:
        "Interactive web-based game logic simulator with real-time rendering",
      tags: ["javascript", "canvas", "game-dev"],
      link: "#",
    },
    {
      id: 3,
      title: "Portfolio Website",
      description: "Search-engine themed portfolio with modular architecture",
      tags: ["html", "css", "javascript"],
      link: "#",
    },
    {
      id: 4,
      title: "Electron Desktop App",
      description:
        "Cross-platform utility application built with Electron and Node.js",
      tags: ["electron", "node.js", "javascript"],
      link: "#",
    },
  ],

  skills: {
    languages: ["JavaScript", "TypeScript", "C", "HTML", "CSS"],
    frameworks: ["Discord.js", "Electron", "Node.js"],
    databases: ["MongoDB", "MySQL"],
    tools: ["Git", "GitHub", "VS Code", "Postman", "Discord API"],
    specializations: [
      "Discord Bot Development",
      "Full-Stack Development",
      "Game Development",
    ],
  },

  experience: [
    {
      title: "BCA Student",
      company: "CLGIET, Bathinda Technical University",
      period: "Current (1st Year)",
      description:
        "Pursuing Bachelor of Computer Applications with focus on practical development skills",
    },
    {
      title: "Self-Directed Developer",
      company: "Personal Projects",
      period: "Ongoing",
      description:
        "Building production-grade Discord bots, web applications, and game projects",
    },
  ],

  contact: {
    email: "your-email@example.com",
    github: "https://github.com/yourusername",
    discord: "YourDiscordTag",
    location: "Rajasthan, India",
    availability: "Open to collaboration and freelance projects",
  },
};

// Export data (for modular use)
if (typeof module !== "undefined" && module.exports) {
  module.exports = portfolioData;
}
