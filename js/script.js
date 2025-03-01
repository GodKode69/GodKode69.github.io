document.addEventListener("DOMContentLoaded", function () {
  // Typewriter effect for the h1
  const typewriterElement = document.getElementById("typewriter");
  const textToType = "GodKode";
  let charIndex = 0;
  function typeWriter() {
    if (charIndex < textToType.length) {
      typewriterElement.textContent += textToType.charAt(charIndex);
      charIndex++;
      setTimeout(typeWriter, 150);
    }
  }
  typeWriter();

  // Carousel / Circular Chain Functionality for cards
  const cards = document.querySelectorAll(".card");
  let activeIndex = 0;
  const totalCards = cards.length;

  function updateCarousel() {
    const farLeftIndex = (activeIndex - 2 + totalCards) % totalCards;
    const leftIndex = (activeIndex - 1 + totalCards) % totalCards;
    const rightIndex = (activeIndex + 1) % totalCards;
    const farRightIndex = (activeIndex + 2) % totalCards;

    cards.forEach((card, i) => {
      card.classList.remove(
        "far-left",
        "left",
        "center",
        "right",
        "far-right",
        "hidden"
      );
      if (i === activeIndex) {
        card.classList.add("center");
      } else if (i === leftIndex) {
        card.classList.add("left");
      } else if (i === rightIndex) {
        card.classList.add("right");
      } else if (i === farLeftIndex) {
        card.classList.add("far-left");
      } else if (i === farRightIndex) {
        card.classList.add("far-right");
      } else {
        card.classList.add("hidden");
      }
    });
  }
  updateCarousel();

  // Auto-rotate cards every 30 seconds
  setInterval(function () {
    activeIndex = (activeIndex - 1 + totalCards) % totalCards;
    updateCarousel();
  }, 30000);

  // Manual rotation: clicking a card centers it
  cards.forEach((card, index) => {
    card.addEventListener("click", function () {
      if (!card.classList.contains("center")) {
        activeIndex = index;
        updateCarousel();
      }
    });
  });

  // Sidebar toggle: expand/collapse behavior
  const sidebar = document.getElementById("sidebar");
  sidebar.addEventListener("click", function (e) {
    sidebar.classList.toggle("expanded");
    e.stopPropagation();
  });
});
