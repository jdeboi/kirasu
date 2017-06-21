var handImgs = [];
var handMode = {open: 0, closed: 1, opening: 2, closing: 3};
var status = handMode.open;
var previousStatus = handMode.opening;
var numOpens = 0;
var currentImage = 1;
var handTime = 0;
var apple;
var handShadow, handSansShadow;
var currentItem = 0;
var items = [];
var itemsScale = [.1, .18, .1];
var item = {apple: 0, worm:1, orchid: 2};
var lastTouched = "top";

function preload() {
  for (var i = 0; i < 5; i++ ) {
    handImgs[i] = loadImage("assets/hand/hand" + i + ".jpg");
  }
  items[0] = loadImage("assets/hand/apple.png");
  items[1] = loadImage("assets/hand/worm.png");
  items[2] = loadImage("assets/hand/orchid.png");
  handShadow = loadImage("assets/hand/hand2_shadow.png");
  handSansShadow = loadImage("assets/hand/hand2_sans_shadow.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
}

function draw() {
  background(0);

  if (millis() < 8000) rotateOnMouse();
  else autoRotate(3);
}

function rotateOnMouse() {
  if (lastTouched == "top" && getHandQuadrant() == 4) {
    lastTouched == "bottom";
    changeItem();
  }
  else if (lastTouched == "bottom" &&  getHandQuadrant() == 0) {
    lastTouched == "top";
  }
  drawHand(getHandQuadrant(), currentItem);
}

function autoRotate(speed) {
  openClose(speed, currentItem);
  if (status == handMode.closed && previousStatus == handMode.closing) {
    //if (numOpens > 0) {
      changeItem();
    //}
    numOpens++;
  }
  previousStatus = status;
}

function openClose(speed, objNum) {
  if (status == handMode.open) {
    currentImage = 0;
    if (millis() - handTime > 2000) status = handMode.closing;
  }
  else if (status == handMode.closed) {
    currentImage = handImgs.length-1;
    if (millis() - handTime > 2000) status = handMode.opening;
  }
  else if (status == handMode.opening) openHand(speed);
  else if (status == handMode.closing) closeHand(speed);
  drawHand(currentImage, objNum);
}

function closeHand(speed) {
  if(frameCount%speed === 0) {
    currentImage++;
    if(currentImage === handImgs.length-1) {
      status = handMode.closed;
      handTime = millis();
    }
  }
}

function openHand(speed) {
  if(frameCount%speed === 0) {
    currentImage--;
    if(currentImage === 0) {
      status = handMode.open;
      handTime = millis();
    }
  }
}

function getHandQuadrant() {
  var m = floor(map(mouseY, 0, windowHeight, 0, 5));
  if (m > 4) m = 4;
  else if (m < 0) m = 0;
  return m;
}

function drawHand(num, objNum) {
  if (num == 2 ) {
    image(handImgs[2], width/2, height/2);
    drawItem(objNum);
    image(handSansShadow, width/2, height/2);
    image(handShadow, width/2, height/2);
  }
  else if (num == 1 || num == 0) {
    image(handImgs[num], width/2, height/2);
    drawItem(objNum);
  }
  else if (num == 3) {
    image(handImgs[num], width/2, height/2);
  }
  else {
    image(handImgs[num], width/2-5, height/2);
  }
}

function changeItem() {
  currentItem++;
  if (currentItem == items.length) currentItem = 0;
}

function drawItem(num) {
  push();
  translate(width/2, height/2+20);
  scale(itemsScale[num]);
  image(items[num], 0,0);
  pop();
}
