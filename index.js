document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const jumper = document.createElement("img");

  let jumperLeft = 50;
  let startingPoint = 150;
  let jumperBottom = startingPoint;
  let platformCount = 5;
  let isGameover = false;
  let platforms = [];
  let upTimerId;
  let downTimerId;
  let isJumping;
  let isGoingRight = false;
  let isGoingLeft = false;
  let leftTimerId;
  let rightTimerId;
  let score = 0;

  const createJumper = () => {
    jumper.setAttribute("src", "./images/yoda.png");
    grid.appendChild(jumper);
    jumper.classList.add("jumper");
    jumperLeft = platforms[0].left;
    jumper.style.left = jumperLeft + "px";
    jumper.style.bottom = jumperBottom + "px";
  };

  class Platform {
    constructor(newBottom) {
      this.bottom = newBottom;
      this.left = Math.random() * 315;
      this.visual = document.createElement("div");

      const visual = this.visual;
      visual.classList.add("platform");
      visual.style.left = this.left + "px";
      visual.style.bottom = this.bottom + "px";

      grid.appendChild(visual);
    }
  }

  const createPlatform = () => {
    for (let i = 0; i < platformCount; i++) {
      let platformGap = 600 / platformCount;
      let newPlatBottom = 100 + i * platformGap;
      let platform = new Platform(newPlatBottom);
      platforms.push(platform);
    }
  };

  const jump = () => {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(function () {
      jumperBottom += 20;
      jumper.style.bottom = jumperBottom + "px";
      if (jumperBottom > startingPoint + 200) {
        fall();
      }
    }, 30);
  };

  const fall = () => {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(function () {
      jumperBottom -= 5;
      jumper.style.bottom = jumperBottom + "px";
      if (jumperBottom <= 0) {
        gameover();
      }
      platforms.forEach((plat) => {
        if (
          jumperBottom >= plat.bottom &&
          jumperBottom <= plat.bottom + 15 &&
          jumperLeft + 60 >= plat.left &&
          jumperBottom <= plat.left + 85 &&
          !isJumping
        ) {
          startingPoint = jumperBottom;
          jump();
        }
      });
    }, 30);
  };

  const getRandomMessage = () => {
    const messages = [
      "Don't underestimate the Force.",
      "I find your lack of faith disturbing.",
      "The force is strong with this one.",
      "I felt a great disturbance in the Force.",
      "Do. Or do not. There is no try.",
      "Train yourself to let go of everything you fear to lose.",
      "The Force will be with you always.",
      "Use the Force, Luke.",
      "I can feel you anger. It gives you focus. It makes you stronger.",
      "In a dark place we find ourselves, and a little more knowledge lights our way.",
      "Fear is the path to the dark side.",
      "Join me, and together we can rule the galaxy.",
      "You can’t win, Darth. Strike me down, and I will become more powerful.",
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  };

  const gameover = () => {
    isGameover = true;

    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }

    const message = document.createElement("p");
    message.classList.add("message");
    message.innerText = `${getRandomMessage()} Score: ${score}`;
    grid.append(message);

    const playBtn = document.createElement("a");
    playBtn.href = "javascript:location.reload(true)";
    playBtn.innerHTML = `<button id="play-again">Play again</button>`;
    grid.append(playBtn);

    clearInterval(downTimerId);
    clearInterval(upTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  };

  const movePlatforms = () => {
    if (jumperBottom > 200) {
      platforms.forEach((plat) => {
        plat.bottom -= 2;
        let visual = plat.visual;
        visual.style.bottom = plat.bottom + "px";

        if (plat.bottom < 10) {
          let firstPlat = platforms[0].visual;
          firstPlat.classList.remove("platform");
          platforms.shift();
          let newPlat = new Platform(600);
          platforms.push(newPlat);
          score++;
        }
      });
    }
  };

  const moveLeft = () => {
    if (isGoingRight) {
      clearInterval(rightTimerId);
      isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerId = setInterval(() => {
      if (jumperLeft >= 0) {
        jumperLeft -= 2;
        jumper.style.left = jumperLeft + "px";
      } else {
        moveRight();
      }
    }, 10);
  };

  const moveRight = () => {
    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }
    isGoingRight = true;
    rightTimerId = setInterval(() => {
      if (jumperLeft <= 340) {
        jumperLeft += 2;
        jumper.style.left = jumperLeft + "px";
      } else {
        moveLeft();
      }
    }, 10);
  };

  const moveStraight = () => {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  };

  const control = (e) => {
    if (e.key === "ArrowLeft") {
      moveLeft();
    } else if (e.key === "ArrowRight") {
      moveRight();
    } else if (e.key === "ArrowUp") {
      moveStraight();
    }
  };

  const start = () => {
    if (!isGameover) {
      createPlatform();
      createJumper();
      setInterval(movePlatforms, 10);
      jump();
      document.addEventListener("keyup", control);
    }
  };

  start();
});
