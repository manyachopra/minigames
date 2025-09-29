const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameover = false;
let foodX, foodY;
let snakeX=5, snakeY=10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;
// Retrieve high score from local storage or initialize to 0
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const changeFoodPosition = () => {
    // Passing a random 0 - 30 value as food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handlegameover = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
}

const changeDirection = (e) => {
    // Changing velocity value based on key press
    if(e.key === "ArrowUp" && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1){
        velocityX = 1;
        velocityY = 0;
    }
    initGame();
}

controls.forEach(key => {
    // Calling changeDirection on each key click and passing key dataset value as an object
    key.addEventListener("click", () => changeDirection({key: key.dataset.key}));
});
const initGame = () => {
    if(gameover) return handlegameover();
    let htmlMarkup = `<div class="food" style="grid-area:${foodY} / ${foodX}"></div>`;
    if(snakeX === foodX && snakeY === foodY){
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); // Pushing food position to snake body array
        score++; // Incrementing score by 1
        highScore = score >= highScore ? score : highScore;
        // Storing high score in local storage
        localStorage.setItem("high-score", highScore);
        highScoreElement.innerText = `High Score: ${highScore}`;
        scoreElement.innerText = `Score: ${score}`;
    }

for (let i = snakeBody.length-1; i > 0; i--) {
    // Shifting forward the values of the elements in the snake body by one
    snakeBody[i] = snakeBody[i - 1];
}

snakeBody[0] = [snakeX, snakeY]; // Setting first element of snake body to current snake position

// Updating snake head position based on velocity
snakeX += velocityX;
snakeY += velocityY;

if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
    gameover = true;
}

for (let i = 0; i < snakeBody.length; i++) {
   htmlMarkup += `<div class="body" style="grid-area:${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
   // Checking if the snake head hit the body
   if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
    gameover = true;
   }
}
playBoard.innerHTML = htmlMarkup;
}
changeFoodPosition();
setIntervalId = setInterval(initGame, 150);
document.addEventListener("keydown", changeDirection);