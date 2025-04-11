const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 2044;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Routes for main pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/waifu", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "projects", "waifu.html"));
});
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "about.html"));
});

app.get("/projects", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "projects.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "contact.html"));
});

app.get("/banner", (req, res) => {
  res.sendFile(path.join(__dirname, "asset", "banner.png"));
});

// Detailed project page: fabric.html
app.get("/projects/fabric", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "projects", "fabric.html"));
});

// Contact form submission endpoint: Generate a text file in the contact folder
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  // Sanitize name for filename: allow only alphanumeric, underscore, hyphen, and spaces
  let sanitized = name.replace(/[^a-z0-9_\- ]/gi, "").trim();
  if (sanitized === "") sanitized = "unknown";
  let fileName = `${sanitized}.txt`;

  // Define the folder path for saving contact submissions
  const contactFolder = path.join(__dirname, "contact");
  // Ensure the folder exists
  if (!fs.existsSync(contactFolder)) {
    fs.mkdirSync(contactFolder, { recursive: true });
  }

  // Build the full file path
  let filePath = path.join(contactFolder, fileName);
  // If the file already exists, append a timestamp to make it unique
  if (fs.existsSync(filePath)) {
    const timestamp = Date.now();
    fileName = `${sanitized}_${timestamp}.txt`;
    filePath = path.join(contactFolder, fileName);
  }

  // Prepare the file content: email at the top, then the message
  const fileContent = `Email: ${email}\nContent:\n${message}`;

  try {
    fs.writeFileSync(filePath, fileContent, { encoding: "utf8" });
    res.json({ success: "Message saved successfully!", fileName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save message." });
  }
});

// 404 Handler - for undefined routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "404.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
