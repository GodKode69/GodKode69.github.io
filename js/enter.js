document.addEventListener("DOMContentLoaded", async () => {
  const langSelect = document.getElementById("language");
  const storedLang = localStorage.getItem("lang") || "en";

  // Set dropdown to stored value
  if (langSelect) langSelect.value = storedLang;

  async function applyLanguage(lang) {
    try {
      const response = await fetch(`lang/${lang}.json`);
      const data = await response.json();

      if (document.getElementById("welcomeText")) {
        document.getElementById("welcomeText").textContent = data.welcome;
        document.getElementById("portfolioText").textContent = data.portfolio;
        document.getElementById("clickText").textContent = data.click_button;
        document.getElementById("langLabel").textContent = data.choose_language;
      }
    } catch (err) {
      console.error("Language file load failed", err);
    }
  }

  // Load on init
  applyLanguage(storedLang);

  if (langSelect) {
    langSelect.addEventListener("change", () => {
      const selected = langSelect.value;
      localStorage.setItem("lang", selected);
      applyLanguage(selected);
    });
  }

  // Button redirect (if exists)
  const button = document.getElementById("button");
  if (button) {
    button.addEventListener("click", () => {
      window.location.href = "/home";
    });
  }
});
