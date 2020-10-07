document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const jumper = document.createElement("div");
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

  function createJumper() {
    grid.appendChild(jumper);
    jumper.classList.add("jumper");
    jumperLeft = platforms[0].left;
    jumper.style.left = jumperLeft + "px";
    jumper.style.bottom = jumperBottom + "px";
  }

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

  function createPlatform() {
    for (let i = 0; i < platformCount; i++) {
      let platformGap = 600 / platformCount;
      let newPlatBottom = 100 + i * platformGap;
      let platform = new Platform(newPlatBottom);
      platforms.push(platform);
      console.log(platforms);
    }
  }

  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(function () {
      jumperBottom += 20;
      jumper.style.bottom = jumperBottom + "px";
      if (jumperBottom > startingPoint + 200) {
        fall();
      }
    }, 30);
  }

  function fall() {
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
          console.log("landed");
          startingPoint = jumperBottom;
          jump();
        }
      });
    }, 30);
  }

  function gameover() {
    console.log("game over");
    isGameover = true;
    clearInterval(downTimerId);
  }

  function movePlatforms() {
    if (jumperBottom > 200) {
      platforms.forEach((plat) => {
        plat.bottom -= 2;
        let visual = plat.visual;
        visual.style.bottom = plat.bottom + "px";
      });
    }
  }

  function moveLeft() {
    isGoingLeft = true;
    if (isGoingRight) {
      clearInterval(rightTimerId);
      isGoingRight = false;
    }
    leftTimerId = setInterval(() => {
      jumperLeft -= 5;
      jumper.style.left = jumperLeft + "px";
    }, 30);
  }

  function moveRight() {
    isGoingRight = true;
    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }
    rightTimerId = setInterval(() => {
      if (jumperLeft <= 340) {
        jumperLeft += 5;
        jumper.style.left = jumperLeft + "px";
      } else {
        moveLeft();
      }
    }, 30);
  }

  function movStraight() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }

  function control(e) {
    if (e.key === "ArrowLeft") {
      moveLeft();
    } else if (e.key === "ArrowRight") {
      moveRight();
    }
  }

  function start() {
    if (!isGameover) {
      createPlatform();
      createJumper();
      setInterval(movePlatforms, 10);
      jump();
      document.addEventListener("keyup", control);
    }
  }

  start();
});
