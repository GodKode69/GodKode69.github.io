document.addEventListener("DOMContentLoaded", async () => {
  const themeToggle = document.getElementById("theme-toggle");

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    const isLight = document.body.classList.contains("light-mode");
    themeToggle.textContent = isLight ? "☀️" : "🌙";
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }

  // Load saved language and apply translations
  const savedLang = localStorage.getItem("language") || "en";

  try {
    const response = await fetch(`lang/${savedLang}.json`);
    const data = await response.json();

    // Apply translations
    const mainHeading = document.querySelector(".home-container h1");
    const subHeading = document.querySelector(".intro h5");
    const statsTitle = document.querySelectorAll(".section-title")[0]; // GitHub Stats

    if (mainHeading) mainHeading.innerHTML = data.home_title;
    if (subHeading) subHeading.textContent = data.home_subheading;
    if (statsTitle) statsTitle.textContent = data.github_stats;

    const navLinks = document.querySelectorAll("nav .nav-link");
    if (navLinks.length >= 3) {
      navLinks[0].textContent = data.nav_about;
      navLinks[1].textContent = data.nav_projects;
      navLinks[2].textContent = data.nav_contact;
    }
  } catch (err) {
    console.error("Error loading language file:", err);
  }

  console.log("Main JS loaded.");
});
