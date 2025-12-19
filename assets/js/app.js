document.addEventListener("DOMContentLoaded", () => {
  // --- Cursor Logic ---
  const cursor = document.querySelector(".cursor");
  const follower = document.querySelector(".cursor-follower");
  const links = document.querySelectorAll(".hover-link");

  let posX = 0,
    posY = 0;
  let mouseX = 0,
    mouseY = 0;

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
  });

  function animateCursor() {
    posX = lerp(posX, mouseX, 0.1);
    posY = lerp(posY, mouseY, 0.1);
    follower.style.left = posX + "px";
    follower.style.top = posY + "px";
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      follower.classList.add("cursor-grow");
      cursor.style.opacity = "0";
    });
    link.addEventListener("mouseleave", () => {
      follower.classList.remove("cursor-grow");
      cursor.style.opacity = "1";
    });
  });

  // --- Scroll Reveal Logic ---
  const revealElements = document.querySelectorAll(".reveal");

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    revealElements.forEach((reveal) => {
      const elementTop = reveal.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();
});
