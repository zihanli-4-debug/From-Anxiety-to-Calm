// From Anxiety to Calm — an interactive water ripple animation.
let intensity = 0;
let lastRipple = 0;
let ripples = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  const dt = constrain(deltaTime, 1, 100);
  // Convert pointer travel into pixels per second so the response is similar
  // across frame rates. Smooth the signal so a pause gradually calms the water.
  const speed = dist(mouseX, mouseY, pmouseX, pmouseY) * 1000 / dt;
  const target = constrain(speed / 1100, 0, 1);
  intensity = lerp(intensity, target, 1 - Math.exp(-dt / (target > intensity ? 140 : 620)));

  const now = millis();
  if (now - lastRipple > lerp(640, 95, intensity)) {
    const inside = mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
    ripples.push({ x: inside ? mouseX : width / 2, y: inside ? mouseY : height / 2,
      birth: now, energy: intensity });
    lastRipple = now;
  }

  background(10, 18, 35);
  ripples = ripples.filter(r => now - r.birth < 2600);
  noFill();
  for (const r of ripples) {
    const age = (now - r.birth) / 2600;
    const radius = 5 + age * lerp(85, 195, r.energy);
    const ink = lerpColor(color(92, 218, 238), color(245, 76, 135), intensity);
    ink.setAlpha(200 * (1 - age));
    stroke(ink);
    strokeWeight(1.5 + r.energy);
    beginShape();
    for (let i = 0; i < 96; i++) {
      const a = TWO_PI * i / 96;
      // Whole-number wave frequencies keep the ring continuous at its seam.
      const wave = sin(5 * a + age * 8) + 0.45 * sin(9 * a - age * 12);
      const size = radius * (1 + 0.085 * r.energy * wave);
      vertex(r.x + cos(a) * size, r.y + sin(a) * size * 0.72);
    }
    endShape(CLOSE);
  }

  noStroke();
  fill(222, 234, 245);
  textSize(20);
  text('From Anxiety to Calm', 20, 36);
  textSize(13);
  text('Move quickly, then slowly. Watch the water settle.', 20, 60);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
