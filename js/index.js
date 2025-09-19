// Global variables
let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let isDrawing = false;

// Memory game variables
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;

// Snake game variables
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameRunning = false;
let gameInterval;

// Touch device detection
let isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  if (!isTouchDevice) {
    initializeCursorBobble();
  } else {
    initializeTouchInteractions();
  }
  initializeWhiteboard();
  initializeMemoryGame();
  initializeSnakeGame();
  initializeScrollAnimations();
});

// Cursor Bobble (Desktop Only)
function initializeCursorBobble() {
  const bobble = document.querySelector(".cursor-bobble");

  if (bobble) {
    document.addEventListener("mousemove", (e) => {
      bobble.style.left = e.clientX - 8 + "px";
      bobble.style.top = e.clientY - 8 + "px";
    });
  }
}

// Touch Interactions (Mobile)
function initializeTouchInteractions() {
  const clickAnimationsContainer = document.querySelector(".click-animations");

  document.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    createClickRipple(touch.clientX, touch.clientY);
  });

  document.addEventListener("click", (e) => {
    if (isTouchDevice) {
      createClickRipple(e.clientX, e.clientY);
    }
  });

  function createClickRipple(x, y) {
    const ripple = document.createElement("div");
    ripple.classList.add("click-ripple");
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";

    clickAnimationsContainer.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
}

// Scroll Animations
function initializeScrollAnimations() {
  const dnaScroll = document.querySelector(".dna-scroll");

  window.addEventListener("scroll", () => {
    const scrollPercentage =
      (window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight)) *
      100;

    // Update DNA scroll indicator
    if (dnaScroll) {
      const rotation = (scrollPercentage * 3.6) % 360;
      dnaScroll.style.transform = `translateY(-50%) rotate(${rotation}deg)`;
    }
  });
}

// Welcome Modal
function closeModal() {
  const modal = document.getElementById("welcomeModal");
  const pageContent = document.getElementById("pageContent");

  modal.style.display = "none";
  pageContent.classList.remove("blurred");
}

// Custom Alert
function showAlert(message) {
  const alertModal = document.getElementById("customAlert");
  const alertMessage = document.getElementById("alertMessage");

  alertMessage.textContent = message;
  alertModal.classList.remove("hidden");
}

function closeAlert() {
  const alertModal = document.getElementById("customAlert");
  alertModal.classList.add("hidden");
}

// Game Tabs
function showGame(gameId) {
  // Hide all game panels
  const panels = document.querySelectorAll(".game-panel");
  panels.forEach((panel) => {
    panel.classList.remove("active");
  });

  // Remove active class from all tabs
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((tab) => {
    tab.classList.remove("active");
  });

  // Show selected game panel
  document.getElementById(gameId).classList.add("active");

  // Add active class to clicked tab
  event.target.classList.add("active");
}

// Tic Tac Toe
function makeMove(index) {
  if (gameBoard[index] === "" && gameActive) {
    gameBoard[index] = currentPlayer;
    document.getElementsByClassName("cell")[index].textContent = currentPlayer;

    if (checkWinner()) {
      showAlert(`Player ${currentPlayer} wins! 🎉`);
      gameActive = false;
      return;
    }

    if (gameBoard.every((cell) => cell !== "")) {
      showAlert("It's a draw! 🤝");
      gameActive = false;
      return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
}

function checkWinner() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winPatterns.some((pattern) => {
    return pattern.every((index) => gameBoard[index] === currentPlayer);
  });
}

function resetTicTac() {
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  const cells = document.getElementsByClassName("cell");
  for (let cell of cells) {
    cell.textContent = "";
  }
}

// Whiteboard
function initializeWhiteboard() {
  const canvas = document.getElementById("whiteboardCanvas");
  const ctx = canvas.getContext("2d");
  const colorPicker = document.getElementById("colorPicker");
  const brushSize = document.getElementById("brushSize");

  let lastPoint = null;

  // Mouse events
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseout", stopDrawing);

  // Touch events for mobile
  canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
  canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
  canvas.addEventListener("touchend", stopDrawing);

  function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const currentPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    ctx.lineWidth = brushSize.value;
    ctx.lineCap = "round";
    ctx.strokeStyle = colorPicker.value;

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();

    lastPoint = currentPoint;
  }

  function stopDrawing() {
    isDrawing = false;
    lastPoint = null;
  }

  function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();

    isDrawing = true;
    lastPoint = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }

  function handleTouchMove(e) {
    e.preventDefault();
    if (!isDrawing) return;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const currentPoint = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };

    ctx.lineWidth = brushSize.value;
    ctx.lineCap = "round";
    ctx.strokeStyle = colorPicker.value;

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();

    lastPoint = currentPoint;
  }
}

function clearCanvas() {
  const canvas = document.getElementById("whiteboardCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Memory Game
function initializeMemoryGame() {
  const symbols = ["🎮", "🎵", "🎨", "💻", "⚡", "🌟", "🎯", "🚀"];
  memoryCards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);

  const gameContainer = document.getElementById("memoryGame");
  gameContainer.innerHTML = "";

  memoryCards.forEach((symbol, index) => {
    const card = document.createElement("div");
    card.classList.add("memory-card");
    card.dataset.symbol = symbol;
    card.dataset.index = index;
    card.addEventListener("click", flipCard);
    gameContainer.appendChild(card);
  });

  matchedPairs = 0;
  flippedCards = [];
}

function flipCard() {
  if (flippedCards.length >= 2) return;
  if (this.classList.contains("flipped")) return;

  this.classList.add("flipped");
  this.textContent = this.dataset.symbol;
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    setTimeout(checkMatch, 1000);
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.symbol === card2.dataset.symbol) {
    matchedPairs++;
    if (matchedPairs === 8) {
      showAlert("Congratulations! You won! 🎉");
    }
  } else {
    card1.classList.remove("flipped");
    card2.classList.remove("flipped");
    card1.textContent = "";
    card2.textContent = "";
  }

  flippedCards = [];
}

function resetMemory() {
  initializeMemoryGame();
}

// Snake Game
function initializeSnakeGame() {
  const canvas = document.getElementById("snakeCanvas");
  const ctx = canvas.getContext("2d");

  // Desktop controls
  document.addEventListener("keydown", changeDirection);

  function changeDirection(e) {
    if (!gameRunning) return;

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = e.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
      dx = -1;
      dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
      dx = 0;
      dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
      dx = 1;
      dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
      dx = 0;
      dy = 1;
    }
  }

  function drawGame() {
    if (!gameRunning) return;

    // Clear canvas
    ctx.fillStyle = "#f4f3ee";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
      score++;
      document.getElementById("snakeScore").textContent = score;
      generateFood();
    } else {
      snake.pop();
    }

    // Check wall collision
    if (
      head.x < 0 ||
      head.x >= canvas.width / 10 ||
      head.y < 0 ||
      head.y >= canvas.height / 10
    ) {
      gameRunning = false;
      clearInterval(gameInterval);
      showAlert(`Game Over! Score: ${score} 🐍`);
      return;
    }

    // Check self collision
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        gameRunning = false;
        clearInterval(gameInterval);
        showAlert(`Game Over! Score: ${score} 🐍`);
        return;
      }
    }

    // Draw snake
    ctx.fillStyle = "#d4602a";
    snake.forEach((segment, index) => {
      if (index === 0) {
        ctx.fillStyle = "#8b4513"; // Head color
      } else {
        ctx.fillStyle = "#d4602a"; // Body color
      }
      ctx.fillRect(segment.x * 10, segment.y * 10, 10, 10);
    });

    // Draw food
    ctx.fillStyle = "#f4a261";
    ctx.fillRect(food.x * 10, food.y * 10, 10, 10);
  }

  function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / 10));
    food.y = Math.floor(Math.random() * (canvas.height / 10));

    // Make sure food doesn't spawn on snake
    snake.forEach((segment) => {
      if (segment.x === food.x && segment.y === food.y) {
        generateFood();
      }
    });
  }

  window.startSnake = function () {
    if (gameRunning) return;

    snake = [{ x: 20, y: 15 }];
    dx = 0;
    dy = 0;
    score = 0;
    gameRunning = true;

    document.getElementById("snakeScore").textContent = score;
    generateFood();
    gameInterval = setInterval(drawGame, 150);
  };

  window.pauseSnake = function () {
    gameRunning = false;
    clearInterval(gameInterval);
  };
}

// Mobile Snake Controls
function mobileSnakeControl(direction) {
  if (!gameRunning) return;

  const goingUp = dy === -1;
  const goingDown = dy === 1;
  const goingRight = dx === 1;
  const goingLeft = dx === -1;

  switch (direction) {
    case "up":
      if (!goingDown) {
        dx = 0;
        dy = -1;
      }
      break;
    case "down":
      if (!goingUp) {
        dx = 0;
        dy = 1;
      }
      break;
    case "left":
      if (!goingRight) {
        dx = -1;
        dy = 0;
      }
      break;
    case "right":
      if (!goingLeft) {
        dx = 1;
        dy = 0;
      }
      break;
  }
}

// Make functions global for HTML onclick handlers
window.closeModal = closeModal;
window.closeAlert = closeAlert;
window.showGame = showGame;
window.makeMove = makeMove;
window.resetTicTac = resetTicTac;
window.clearCanvas = clearCanvas;
window.resetMemory = resetMemory;
window.startSnake = startSnake;
window.pauseSnake = pauseSnake;
window.mobileSnakeControl = mobileSnakeControl;
