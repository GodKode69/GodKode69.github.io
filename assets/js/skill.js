const skills = [
  {
    name: "JavaScript",
    icon: "./assets/img/icons/js.png",
    desc: "High-level, dynamically typed, multi-paradigm programming language.",
    level: 65,
  },
  {
    name: "SQL",
    icon: "./assets/img/icons/sql.png",
    desc: "Standardized language used to manage and manipulate relational databases.",
    level: 40,
  },
  {
    name: "Node.JS",
    icon: "./assets/img/icons/nodejs.png",
    desc: "Runtime environment that allows JavaScript to be executed server-side.",
    level: 60,
  },
  {
    name: "Python",
    icon: "./assets/img/icons/python.png",
    desc: "High-level interpreted programming language.",
    level: 30,
  },
  {
    name: "C",
    icon: "./assets/img/icons/c.png",
    desc: "General-purpose procedural programming language.",
    level: 15,
  },
  {
    name: "Linux",
    icon: "./assets/img/icons/linux.png",
    desc: "Open-source operating system kernel.",
    level: 30,
  },
  {
    name: "Discord.js",
    icon: "./assets/img/icons/djs.png",
    desc: "Library for interacting with the Discord API using Node.js.",
    level: 85,
  },
  {
    name: "HTML",
    icon: "./assets/img/icons/html.png",
    desc: "Markup language used to define web page structure.",
    level: 45,
  },
  {
    name: "MongoDB",
    icon: "./assets/img/icons/mongo.png",
    desc: "Cross-platform document-oriented NoSQL database.",
    level: 50,
  },
  {
    name: "Mongoose",
    icon: "./assets/img/icons/npm.png",
    desc: "MongoDB object modeling tool for Node.js.",
    level: 55,
  },
  {
    name: "CSS",
    icon: "./assets/img/icons/css.png",
    desc: "Stylesheet language used for describing presentation of documents.",
    level: 40,
  },
  {
    name: "Documentation",
    icon: "./assets/img/icons/docs.png",
    desc: "Reading and implementing technical documentation.",
    level: 45,
  },
  {
    name: "Typescript",
    icon: "./assets/img/icons/ts.png",
    desc: "Statically typed superset of JavaScript.",
    level: 10,
  },
  {
    name: "Electron",
    icon: "./assets/img/icons/npm.png",
    desc: "Framework for building desktop apps with web technologies.",
    level: 10,
  },
  {
    name: "GO",
    icon: "./assets/img/icons/go.png",
    desc: "Statically typed compiled programming language by Google.",
    level: 1,
  },
  {
    name: "MySQL",
    icon: "./assets/img/icons/sql.png",
    desc: "Open-source relational database management system.",
    level: 75,
  },
];

const container = document.getElementById("skills-container");

skills.forEach((skill) => {
  const el = document.createElement("span");

  el.innerHTML = `
${skill.name}
<div class="skill-popup">

<div class="popup-header">
<img src="${skill.icon}" alt="">
<div class="popup-title">${skill.name}</div>
</div>

<p class="popup-desc">${skill.desc}</p>

<div class="visualize-container">
<div class="proficiency-text">Proficiency: ${skill.level}%</div>

<div class="progress-bar">
<div class="progress-fill" style="width:${skill.level}%"></div>
</div>

</div>

</div>
`;

  container.appendChild(el);
});
