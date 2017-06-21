var butterfly;

function preload() {
  butterfly = loadImage("assets/butterfly.jpg")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(butterfly);
}
