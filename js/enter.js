// Import required modules via ES modules.
import * as THREE from "https://unpkg.com/three@0.152.0/build/three.module.js";
import { FontLoader } from "https://unpkg.com/three@0.152.0/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "https://unpkg.com/three@0.152.0/examples/jsm/geometries/TextGeometry.js";

document.addEventListener("DOMContentLoaded", async () => {
  /*** Language & UI Setup ***/
  const langSelect = document.getElementById("language");
  const storedLang = localStorage.getItem("lang") || "en";
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
  applyLanguage(storedLang);
  if (langSelect) {
    langSelect.addEventListener("change", () => {
      const selected = langSelect.value;
      localStorage.setItem("lang", selected);
      applyLanguage(selected);
    });
  }

  // --- Button-Only Navigation (click triggers redirection) ---
  const button = document.getElementById("button");
  if (button) {
    button.addEventListener("click", () => {
      window.location.href = "/home";
    });
  }

  /*** Three.js 3D Text Setup ***/
  const container = document.getElementById("threeTextContainer");
  if (!container) {
    console.error("Three.js container not found");
    return;
  }

  // Create Three.js scene, camera, and renderer.
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 50);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Load the custom Press Start 2P font JSON.
  const loader = new FontLoader();
  loader.load(
    "asset/pressStart2P_Regular.typeface.json", // Adjust URL as needed.
    (font) => {
      const textGeometry = new TextGeometry("@GodKode.'s", {
        font: font,
        size: 8,
        height: 2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.5,
        bevelSize: 0.5,
        bevelOffset: 0,
        bevelSegments: 3,
      });
      textGeometry.center();
      const textMaterial = new THREE.MeshPhongMaterial({ color: 0xe50914 });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      scene.add(textMesh);
    },
    undefined,
    (err) => {
      console.error("Error loading font:", err);
    }
  );

  // Add light for shading.
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 0, 1);
  scene.add(light);

  // Render loop for Three.js.
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  /*** 3D Text Container Interaction Setup ***/
  // Variables for drag and slow-follow behavior.
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };

  // When mouse moves, update container translation.
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) {
      // Calculate offset relative to the center of the viewport.
      const offsetX = (e.clientX - window.innerWidth / 2) * 0.05;
      const offsetY = (e.clientY - window.innerHeight / 2) * 0.05;
      // The CSS transition (defined in CSS) will make the movement gradual.
      container.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    } else {
      // If dragging, compute the new position based on the mouse,
      // subtracting the dragOffset to keep the pointer at the same location relative to the container.
      const posX = e.clientX - dragOffset.x;
      const posY = e.clientY - dragOffset.y;
      // Disable transition for immediate response when dragging.
      container.style.transition = "none";
      container.style.transform = `translate(${posX}px, ${posY}px)`;
    }
  });

  // On mousedown over the container, begin dragging.
  container.addEventListener("mousedown", (e) => {
    isDragging = true;
    // Calculate the offset within the container.
    const rect = container.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
  });

  // On mouseup anywhere, stop dragging.
  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      // Re-enable smooth transition after dragging stops.
      container.style.transition = "transform 0.5s ease";
    }
  });

  // On double-click within the container, trigger flip animation.
  container.addEventListener("dblclick", () => {
    container.classList.add("flip-animation");
    // Remove the class after animation completes (600ms as per CSS)
    setTimeout(() => {
      container.classList.remove("flip-animation");
    }, 600);
  });
});
