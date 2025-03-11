document.addEventListener("DOMContentLoaded", () => {
  // Smooth scrolling for internal anchor links (if applicable)
  const navLinks = document.querySelectorAll("a.nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      if (this.getAttribute("href").charAt(0) === "#") {
        e.preventDefault();
        const targetID = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetID);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
  console.log("Main JS loaded.");
});
