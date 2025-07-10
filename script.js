let gameState = "intro";
let level = 1;
let path = [];
let player;
let endZone;
let dragging = false;
let startOffset, endOffset;
let strayMessage = false;
let blobDiv;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
canvas.parent("game-container");

  textFont("sans-serif");
  setupLevel(level);
  blobDiv = select('#blob-container');
}

function draw() {
  if (gameState === "intro") {
  clear(); // keep blob visible
} else {
  background("#F2E6E3"); // solid for levels
}

  noStroke();
  fill("#8C6D67");
  textAlign(CENTER, CENTER);

  if (blobDiv) {
  if (gameState === "intro") {
    blobDiv.show();
  } else {
    blobDiv.hide();
  }
}
  
  if (gameState === "intro") {
    textSize(18);
    text("Take a moment for yourself", width / 2, height / 2 - 40);
    if (dist(mouseX, mouseY, width / 2, height / 2) < 100) {
      drawStyledButton("Only takes a few seconds", height / 2, () => {
        gameState = "level";
      });
    }
  } else if (gameState === "level") {
    drawMaze();
    if (strayMessage) drawStrayMessage();
  } else if (gameState === "intermediate1") {
    textSize(16);
    text(
      "That motion is part of a real therapeutic technique —\na calming micro-break for your workday.",
      width / 2,
      height / 2 - 40
    );
    drawStyledButton("Another quick one", height / 2, () => {
      level = 2;
      setupLevel(level);
      gameState = "level";
    });
  } else if (gameState === "intermediate2") {
    textSize(16);
    text("Still with it. Love that.", width / 2, height / 2 -40);
    drawStyledButton("One more?", height / 2, () => {
      level = 3;
      setupLevel(level);
      gameState = "level";
    });
  } else if (gameState === "end") {
    textSize(16);
    text(getLocalTimeMessage(), width / 2, height * 0.32);
    text("“Peak productivity achieved.” 😎", width / 2, height * 0.40);
    text(
      "\nThis was vibe-coded to help you pause.\nIf you’re recharged… the rest of the site is waiting.",
      width / 2,
      height * 0.52
    
    );
   
  }

  if (gameState === "level") {
    strayMessage = checkStrayingAccurate();
  }
}

function drawStyledButton(label, y, onClick) {
  let w = 280;
  let h = 48;
  let x = width / 2 - w / 2;
  fill("#D9B9B3");
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

function drawMaze() {
  fill("#8C6D67");
  textSize(14);
  text(
    "Drag the circle along the curve to reach the other side.",
    width / 2,
    height * 0.1
  );

  noFill();
  stroke("#BFA5A0");
  strokeWeight(0.035 * min(width, height));
  beginShape();
  curveVertex(path[0].x, path[0].y);
  for (let v of path) curveVertex(v.x, v.y);
  curveVertex(path[path.length - 1].x, path[path.length - 1].y);
  endShape();

  noStroke();
  fill("#F5F3F0");
  ellipse(endZone.x, endZone.y, 0.07 * min(width, height));

  fill("#D9B9B3");
  stroke("#8C6D67");
  ellipse(player.x, player.y, 0.06 * min(width, height));

  if (p5.Vector.dist(player, endZone) < 0.035 * min(width, height)) {
    noLoop();
    setTimeout(() => {
      gameState =
        level === 1 ? "intermediate1" : level === 2 ? "intermediate2" : "end";
      loop();
    }, 500);
  }
}

function drawStrayMessage() {
  push();
  resetMatrix();
  noStroke();
  fill("#8C6D67");
  textSize(16);
  textAlign(CENTER, CENTER);
  text(
    "Oops, it happens 😄 Try staying closer to the path.",
    width / 2,
    height * 0.85
  );
  pop();
}

function checkStrayingAccurate() {
  if (!dragging) return false;
  let threshold = 0.05 * min(width, height);
  for (let i = 0; i < path.length - 1; i++) {
    let steps = 20;
    for (let j = 0; j <= steps; j++) {
      let t = j / steps;
      let px = lerp(path[i].x, path[i + 1].x, t);
      let py = lerp(path[i].y, path[i + 1].y, t);
      if (dist(player.x, player.y, px, py) < threshold) return false;
    }
  }
  return true;
}

function setupLevel(lvl) {
  generatePath(lvl);
  let offsetX = width * 0.03;
  startOffset = createVector(-offsetX, 0);
  endOffset = createVector(offsetX, 0);
  player = p5.Vector.add(path[0], startOffset);
  endZone = p5.Vector.add(path[path.length - 1], endOffset);
}

function generatePath(level) {
  path = [];
  let marginX = width * 0.1;
  let usableWidth = width * 0.8;
  let centerY = height / 2;
  let spacing = usableWidth / (level === 3 ? 12 : level === 2 ? 8 : 6);
  let baseVariance = height * 0.07;
  let points = level === 3 ? 13 : level === 2 ? 9 : 7;

  for (let i = 0; i < points; i++) {
    let x = marginX + i * spacing;
    let y =
      centerY +
      (i % 2 === 0 ? -1 : 1) * baseVariance * (0.8 + Math.random() * 0.4);
    path.push(createVector(x, y));
  }
}

function mousePressed() {
  if (
    gameState === "level" &&
    dist(mouseX, mouseY, player.x, player.y) < 0.04 * min(width, height)
  ) {
    dragging = true;
  }
}

function mouseDragged() {
  if (dragging && gameState === "level") {
    player.x = mouseX;
    player.y = mouseY;
  }
}

function mouseReleased() {
  dragging = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupLevel(level);
}

function getLocalTimeMessage() {
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes().toString().padStart(2, "0");
  let suffix = hours >= 12 ? "PM" : "AM";
  hours = ((hours + 11) % 12) + 1;
  return `Tracing a circle at ${hours}:${minutes} ${suffix}.`;
}
