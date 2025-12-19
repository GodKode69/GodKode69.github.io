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
    const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
    const { data, success } = await response.json();
    if (!success) return;

    // 1. Core Identity & Status
    const status = data.discord_status;
    const username = data.discord_user.username;
    
    // Status text mapping
    const statusMap = {
        online: "online",
        idle: "idle",
        dnd: "on do not disturb",
        offline: "offline"
    };

    // Update Dots & Header Text
    document.getElementById("discord-dot").className = status;
    document.getElementById("discord-status-dot").className = status;
    document.getElementById("status-text").innerHTML = 
        `Entity <span style="color:white">@${username}</span> is <span style="color:white">${statusMap[status] || status}</span>`;

    // 2. Profile Card Details
    document.getElementById("discord-name").innerText = data.discord_user.global_name || username;
    document.getElementById("discord-avatar").src = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${data.discord_user.avatar}.png`;

    // 3. Clear and Rebuild Activities
    const container = document.getElementById("activities-container");
    container.innerHTML = ""; 

    // Add Spotify
    if (data.listening_to_spotify) {
      container.innerHTML += `
        <p class="section-label">Listening to Spotify</p>
        <div class="activity-item">
          <img class="activity-img" src="${data.spotify.album_art_url}">
          <div class="activity-info">
            <p class="activity-title">${data.spotify.song}</p>
            <p>by ${data.spotify.artist}</p>
          </div>
        </div>`;
    }

    // Add Game/Code (Type 0 = Playing)
    const playingAct = data.activities.find(a => a.type === 0);
    if (playingAct) {
      let assetImg = 'https://cdn.discordapp.com/embed/avatars/0.png';
      if(playingAct.assets && playingAct.assets.large_image) {
        assetImg = playingAct.assets.large_image.startsWith("mp:external") 
            ? playingAct.assets.large_image.replace(/mp:external\/.*\/https\//, "https://")
            : `https://cdn.discordapp.com/app-assets/${playingAct.application_id}/${playingAct.assets.large_image}.png`;
      }
      
      container.innerHTML += `
        <p class="section-label">Playing</p>
        <div class="activity-item">
          <img class="activity-img" src="${assetImg}">
          <div class="activity-info">
            <p class="activity-title">${playingAct.name}</p>
            <p>${playingAct.details || ''}</p>
            <p>${playingAct.state || ''}</p>
          </div>
        </div>`;
    }

  } catch (err) {
    console.error("Lanyard Error:", err);
  }
}

getLanyard();
setInterval(getLanyard, 15000);