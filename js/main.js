document.addEventListener("DOMContentLoaded", async () => {
  const storedLang = localStorage.getItem("lang") || "en";
  console.log("[Lang] Stored Language:", storedLang);

  async function applyLanguage(lang) {
    const langPath = `/lang/${lang}.json`;
    console.log("[Lang] Attempting to load:", langPath);

    try {
      const response = await fetch(langPath);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("[Lang] Loaded language data:", data);

      // Apply translated content using IDs
      const homeTitle = document.getElementById("homeTitle");
      const homeSubheading = document.getElementById("homeSubheading");
      const githubStatsTitle = document.getElementById("githubStatsTitle");

      if (homeTitle) {
        homeTitle.innerHTML = data.home_title;
        console.log("[Lang] homeTitle updated.");
      }

      if (homeSubheading) {
        homeSubheading.textContent = data.home_subheading;
        console.log("[Lang] homeSubheading updated.");
      }

      if (githubStatsTitle) {
        githubStatsTitle.textContent = data.github_stats;
        console.log("[Lang] githubStatsTitle updated.");
      }

      // Update navbar links
      const navAbout = document.getElementById("navAbout");
      const navProjects = document.getElementById("navProjects");
      const navContact = document.getElementById("navContact");

      if (navAbout) {
        navAbout.textContent = data.nav_about;
        console.log("[Lang] navAbout updated.");
      }

      if (navProjects) {
        navProjects.textContent = data.nav_projects;
        console.log("[Lang] navProjects updated.");
      }

      if (navContact) {
        navContact.textContent = data.nav_contact;
        console.log("[Lang] navContact updated.");
      }
    } catch (err) {
      console.error("[Lang] Failed to load language file:", err);
    }
  }

  // Load language on init
  applyLanguage(storedLang);

  // Dark/Light Mode Toggle
  const themeToggle = document.getElementById("theme-toggle");

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    themeToggle.textContent = isLight ? "☀️" : "🌙";
    localStorage.setItem("theme", isLight ? "light" : "dark");
    console.log("[Theme] Changed to:", isLight ? "light" : "dark");
  });

  // Load saved theme
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
    themeToggle.textContent = "☀️";
    console.log("[Theme] Loaded stored theme: light");
  } else {
    themeToggle.textContent = "🌙";
    console.log("[Theme] Loaded stored theme: dark");
  }
});
