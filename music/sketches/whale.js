var whale;

function preload() {
  whale = loadImage("../assets/constellations/whale.jpg")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(whale);
}
