// about.js

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("button");
  themeToggle.addEventListener("click", () => {
    window.location.href = "/home";
  });

  const langSelect = document.getElementById("language");

  langSelect.addEventListener("change", async () => {
    const selectedLang = langSelect.value;

    try {
      const response = await fetch(`lang/${selectedLang}.json`);
      const data = await response.json();

      document.getElementById("welcomeText").textContent = data.welcome;
      document.getElementById("portfolioText").textContent = data.portfolio;
      document.getElementById("clickText").textContent = data.click_button;
      document.getElementById("langLabel").textContent = data.choose_language;
    } catch (err) {
      console.error("Error loading language file", err);
    }
  });
});
