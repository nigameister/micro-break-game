let path = [];
let player;
let endZone;
let gameState = "intro"; // intro, level1, win, stray

function setup() {
  createCanvas(windowWidth, windowHeight);
  generatePath();
  player = createVector(path[0].x, path[0].y);
  endZone = path[path.length - 1].copy();
}

function draw() {
  if (gameState === "intro") {
    clear(); // keep blob visible
  } else {
    background("#DDE8EA"); // solid for levels
  }

  noStroke();
  fill("#1C3D41");
  textAlign(CENTER, CENTER);
  textFont("sans-serif");

  if (gameState === "intro") {
    textSize(32);
    text("Take a Micro-Break", width / 2, height * 0.3);
    drawStyledButton("Start Game", height * 0.5, () => {
      gameState = "level1";
    });
  } else if (gameState === "level1") {
    drawMaze();
    handlePlayer();
  } else if (gameState === "win") {
    textSize(28);
    text("🎉 Well Done!", width / 2, height * 0.3);
    drawStyledButton("Play Again", height * 0.5, () => {
      gameState = "intro";
      generatePath();
      player = createVector(path[0].x, path[0].y);
    });
  } else if (gameState === "stray") {
    drawMaze();
    drawStrayMessage();
  }
}

function drawStyledButton(label, y, onClick) {
  let w = 280;
  let h = 48;
  let x = width / 2 - w / 2;
  fill("#C2D6D9");
  rect(x, y, w, h, 12);
  fill("#ffffff");
  textSize(16);
  text(label, x + w / 2, y + h / 2);

  if (
    mouseX > x &&
    mouseX < x + w &&
    mouseY > y &&
    mouseY < y + h &&
    mouseIsPressed
  ) {
    onClick();
  }
}

function generatePath() {
  path = [];
  let margin = width * 0.1;
  let points = 6;
  for (let i = 0; i < points; i++) {
    let x = map(i, 0, points - 1, margin, width - margin);
    let y = height / 2 + sin(i * TWO_PI / points) * height * 0.2;
    path.push(createVector(x, y));
  }
}

function drawMaze() {
  fill("#1C3D41");
  textSize(14);
  text(
    "Drag the circle along the curve to reach the other side.",
    width / 2,
    height * 0.1
  );

  noFill();
  stroke("#2F5C63");
  strokeWeight(0.035 * min(width, height));
  beginShape();
  curveVertex(path[0].x, path[0].y);
  for (let v of path) curveVertex(v.x, v.y);
  curveVertex(path[path.length - 1].x, path[path.length - 1].y);
  endShape();

  noStroke();
  fill("#ffffff");
  ellipse(endZone.x, endZone.y, 0.07 * min(width, height));

  fill("#C2D6D9");
  stroke("#1C3D41");
  ellipse(player.x, player.y, 0.06 * min(width, height));
}

function handlePlayer() {
  if (mouseIsPressed) {
    player.x = mouseX;
    player.y = mouseY;

    let d = dist(player.x, player.y, endZone.x, endZone.y);
    if (d < 0.05 * min(width, height)) {
      gameState = "win";
    }

    let offPath = true;
    for (let v of path) {
      if (dist(player.x, player.y, v.x, v.y) < 0.06 * min(width, height)) {
        offPath = false;
        break;
      }
    }
    if (offPath) {
      gameState = "stray";
      setTimeout(() => {
        gameState = "level1";
        player = createVector(path[0].x, path[0].y);
      }, 1500);
    }
  }
}

function drawStrayMessage() {
  push();
  resetMatrix();
  noStroke();
  fill("#1C3D41");
  textSize(16);
  textAlign(CENTER, CENTER);
  text(
    "Oops, it happens 😄 Try staying closer to the path.",
    width / 2,
    height * 0.85
  );
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
