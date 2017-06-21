var stars = [];
var mode = {flying: 0, home: 1, mouse:2, landed:3};

function preload() {
  starryNight = loadImage("../assets/skydress.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, width);
  angleMode(DEGREES);
  stars = new Flock();
  // Add an initial set of boids into the system
  for (var i = 0; i < 100; i++) {
    var b = new Boid(random(width),random(height), i);
    stars.addBoid(b);
  }
}

function draw() {
  background(starryNight);
  if (millis() < 10000) {
    stars.star();
  }
  else {
    stars.bird();
  }
  // else if (millis() < 24000) {
  //   stars.changeMode(mode.mouse);
  //   stars.bird();
  // }
  // else {
  //   stars.changeMode(mode.flying);
  //   stars.bird();
  // }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  stars.resize();
}
