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

const DISCORD_ID = "1243904701318037609";

async function getLanyard() {
  try {
    const response = await fetch(
      `https://api.lanyard.rest/v1/users/${DISCORD_ID}`
    );
    const { data, success } = await response.json();

    if (!success) return;

    const dot = document.getElementById("discord-dot");
    const statusText = document.getElementById("status-text");

    // 1. Update the Dot
    dot.className = data.discord_status;

    // 2. Format the String
    const username = `@${data.discord_user.username}`;
    let statusVerb = "pursuing";
    let activityName = "the void";

    if (data.listening_to_spotify) {
      statusVerb = "listening to";
      activityName = data.spotify.song;
    } else if (data.activities.length > 0) {
      // Find the most relevant activity
      const activity =
        data.activities.find((a) => a.type !== 4) || data.activities[0];
      statusVerb = "pursuing";
      activityName = activity.name;
    } else {
      statusVerb = "pursuing";
      activityName =
        data.discord_status === "online" ? "optimization" : "stealth mode";
    }

    // Apply final text: {status} Entity @adhuraghav {verb} ${activity}
    statusText.innerHTML = `Entity <span style="color:white">${username}</span> ${statusVerb} <span style="color:white">${activityName}</span>`;
  } catch (err) {
    console.error("Uplink Error:", err);
  }
}

getLanyard();
setInterval(getLanyard, 15000); // Update every 15 seconds
