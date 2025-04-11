document.addEventListener("DOMContentLoaded", async () => {
  const storedLang = localStorage.getItem("lang") || "en";

  async function applyLanguage(lang) {
    try {
      const response = await fetch(`../lang/${lang}.json`);
      const data = await response.json();
      console.log(data).cactch((error) => console.log(error));

      // Apply translated content using IDs
      const homeTitle = document.getElementById("homeTitle");
      const homeSubheading = document.getElementById("homeSubheading");
      const githubStatsTitle = document.getElementById("githubStatsTitle");

      if (homeTitle) homeTitle.innerHTML = data.home_title;
      if (homeSubheading) homeSubheading.textContent = data.home_subheading;
      if (githubStatsTitle) githubStatsTitle.textContent = data.github_stats;

      // Update navbar links
      const navAbout = document.getElementById("navAbout");
      const navProjects = document.getElementById("navProjects");
      const navContact = document.getElementById("navContact");

      if (navAbout) navAbout.textContent = data.nav_about;
      if (navProjects) navProjects.textContent = data.nav_projects;
      if (navContact) navContact.textContent = data.nav_contact;
    } catch (err) {
      console.error("Failed to load language file:", err);
    }
  }

  applyLanguage(storedLang);

  // Dark/Light Mode Toggle
  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    themeToggle.textContent = isLight ? "☀️" : "🌙";
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });

  // Load saved theme
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }
});
