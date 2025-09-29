const bird = document.querySelector(".bird-container");
const game = document.querySelector(".container");
const scoretop = document.querySelector(".score");
const restart = document.querySelector(".replay");

let gravity = 5;
let score = 0;
let birdheight = 190;
let gameover = false;
let gamestarted = false;

function startgame() {
    let gloop = setInterval(() => {
        if (gameover) {
            clearInterval(gloop);
            alert("Game Over! Your score: " + score);
            restart.style.display = "block";
        }

        birdheight += gravity;

        if (birdheight < 0) {
            gameover = true;
            birdheight = 0;
        }
        if (birdheight > 470) { 
            gameover = true;
            birdheight = 470;
        }

        bird.style.top = birdheight + "px";
    }, 40);

    let pipeloop = setInterval(() => {
        if (gameover) {
            clearInterval(pipeloop);
        } else {
            createpipes();
        }
    }, 1500);
}

document.addEventListener("keydown", (event) => {
    if (!gamestarted && event.key === " ") {
        startgame();
        createpipes();
        gamestarted = true;
    }
    if (gameover) return;

    if (event.key === " ") {
        birdheight -= 47;
        bird.style.top = birdheight + "px";
    }
});

restart.addEventListener("click", () => {
    gameover = false;
    birdheight = 190;
    bird.style.top = birdheight + "px";
    score = 0;
    scoretop.textContent = "Score: 0";
    game.appendChild(bird); 
    startgame();
    restart.style.display = "none";
});

function createpipes() {
    let pipeheight = Math.floor(Math.random() * 200);
    let pgap = 120;

    let toppipe = document.createElement("div");
    toppipe.classList.add("pipe");
    toppipe.style.height = pipeheight + "px";
    toppipe.style.top = "0px";
    toppipe.style.left = "400px";
    game.appendChild(toppipe);

    let bottompipe = document.createElement("div");
    bottompipe.classList.add("pipe");
    bottompipe.style.height = (500 - pipeheight - pgap) + "px";
    bottompipe.style.top = (pipeheight + pgap) + "px";
    bottompipe.style.left = "400px";
    game.appendChild(bottompipe);

    let move = setInterval(() => {
        if (gameover) {
            clearInterval(move);
            toppipe.remove();
            bottompipe.remove();
            return;
        }

        let leftpipe = parseInt(window.getComputedStyle(toppipe).getPropertyValue("left"));
        toppipe.style.left = (leftpipe - 5) + "px";
        bottompipe.style.left = (leftpipe - 5) + "px";

        let birddim = bird.getBoundingClientRect();
        let topdim = toppipe.getBoundingClientRect();
        let bottomdim = bottompipe.getBoundingClientRect();
        if (
            birddim.right > topdim.left &&
            birddim.left < topdim.right &&
            (birddim.top < topdim.bottom || birddim.bottom > bottomdim.top)
        ) {
            gameover = true;
        }

        if (leftpipe < -50) { 
            clearInterval(move);
            toppipe.remove();
            bottompipe.remove();
            score++;
            scoretop.textContent = "Score: " + score;
        }
    }, 20);
}
