const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const gameOverText = document.getElementById("gameOver");
const crashSound = document.getElementById("crashSound");
const eatSound = document.getElementById("eatSound");

const box = 20;
let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let food = {
  x: Math.floor(Math.random() * (canvas.width / box)) * box,
  y: Math.floor(Math.random() * (canvas.height / box)) * box
};
let score = 0;
let game;

document.addEventListener("keydown", directionControl);

function directionControl(event) {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // gambar makanan
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // gambar ular
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "green" : "lightgreen";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // posisi kepala ular
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  // jika makan makanan
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    scoreDisplay.textContent = score;
    eatSound.currentTime = 0; // reset suara agar bisa berulang
    eatSound.play();
    food = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
  } else {
    snake.pop();
  }

  const newHead = { x: snakeX, y: snakeY };

  // deteksi tabrakan
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    crashSound.currentTime = 0;
    crashSound.play();
    clearInterval(game);
    gameOverText.style.display = "block";
    return;
  }

  snake.unshift(newHead);
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

function resetGame() {
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  score = 0;
  scoreDisplay.textContent = score;
  gameOverText.style.display = "none";
  clearInterval(game);
  game = setInterval(draw, 100);
}

game = setInterval(draw, 100);
