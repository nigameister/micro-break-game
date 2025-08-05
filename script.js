let gameState = "intro";
let player = { x: 0, y: 0 };
let path = [];
let endZone = {};

function setup() {
  createCanvas(windowWidth, windowHeight);
  initMaze();
}

function draw() {
  if (gameState === "intro") {
    clear(); // show blob
  } else {
    background("#DDE8EA");
  }

  noStroke();
  fill("#1C3D41");
  textAlign(CENTER, CENTER);

  if (gameState === "intro") {
    textSize(22);
    text("Take a Micro-Break", width / 2, height / 2 - 60);
    drawStyledButton("Start", height / 2 + 10, () => {
      gameState = "level";
    });
  } else if (gameState === "level") {
    drawMaze();
    if (dist(player.x, player.y, endZone.x, endZone.y) < 30) {
      gameState = "done";
    }
  } else if (gameState === "done") {
    textSize(22);
    text("Great job 🙌", width / 2, height / 2);
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
    mouseIsPressed &&
    mouseX > x &&
    mouseX < x + w &&
    mouseY > y &&
    mouseY < y + h
  ) {
    onClick();
  }
}

function initMaze() {
  path = [];
  let margin = 80;
  for (let i = 0; i < 6; i++) {
    path.push({
      x: map(i, 0, 5, margin, width - margin),
      y: height / 2 + 100 * sin(i * PI * 0.5),
    });
  }

  player.x = path[0].x;
  player.y = path[0].y;
  endZone.x = path[path.length - 1].x;
  endZone.y = path[path.length - 1].y;
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

function mouseDragged() {
  player.x = mouseX;
  player.y = mouseY;
}
