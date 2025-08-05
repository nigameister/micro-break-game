let gameState = "intro";
let player, path, endZone;

function setup() {
  createCanvas(windowWidth, windowHeight);

  player = createVector(width * 0.2, height * 0.5);

  path = [];
  for (let i = 0; i <= 1; i += 0.1) {
    let x = lerp(width * 0.2, width * 0.8, i);
    let y = height * 0.5 + sin(i * TWO_PI) * 100;
    path.push(createVector(x, y));
  }

  endZone = createVector(width * 0.8, height * 0.5);
}

function draw() {
  if (gameState === "intro") {
    clear(); // Keep blob visible
  } else {
    background("#DDE8EA"); // Solid background for game levels
    drawMaze();
    drawStrayMessage(); // Optional, show message if needed
  }

  noStroke();
  fill("#1C3D41");
  textAlign(CENTER, CENTER);
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
    mouseX > x && mouseX < x + w &&
    mouseY > y && mouseY < y + h
  ) {
    onClick();
  }
}

function drawMaze() {
  fill("#1C3D41");
  textSize(14);
  text("Drag the circle along the curve to reach the other side.", width / 2, height * 0.1);

  noFill();
  stroke("#2F5C63");
  strokeWeight(0.035 * min(width, height));
  beginShape();
  curveVertex(path[0].x, path[0].y);
  for (let v of path) {
    curveVertex(v.x, v.y);
  }
  curveVertex(path[path.length - 1].x, path[path.length - 1].y);
  endShape();

  noStroke();
  fill("#ffffff");
  ellipse(endZone.x, endZone.y, 0.07 * min(width, height));

  fill("#C2D6D9");
  stroke("#1C3D41");
  ellipse(player.x, player.y, 0.06 * min(width, height));
}

function drawStrayMessage() {
  push();
  resetMatrix();
  noStroke();
  fill("#1C3D41");
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Oops, it happens 😄 Try staying closer to the path.", width / 2, height * 0.85);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
