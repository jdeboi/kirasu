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
var itemsScale = [.15, .15, .15, .15, .15, .13];
var starImgs = [];
var stars = [];

var lastTouched = "top";

function preload() {
  for (var i = 0; i < 5; i++ ) {
    handImgs[i] = loadImage("assets/hand/hand" + i + ".jpg");
  }
  for (var i = 0; i < 6; i++ ) {
    items[i] = loadImage("assets/hand/const" + i + "_blk.svg");
    starImgs[i] = loadImage("assets/hand/const" + i + "_w.svg");
  }
  // items[0] = loadImage("assets/hand/apple.png");
  // items[1] = loadImage("assets/hand/worm.png");
  // items[2] = loadImage("assets/hand/orchid.png");
  handShadow = loadImage("assets/hand/hand2_shadow.png");
  handSansShadow = loadImage("assets/hand/hand2_sans_shadow.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  for (var i = 0; i < 100; i++ ) {
    stars[i] = new Star();
  }
}

function draw() {
  background(0);

  if (millis() < 8000) rotateOnMouse();
  else autoRotate(3, 1000);

  for (var i = 0; i < stars.length; i++ ) {
    stars[i].display();
  }
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

function autoRotate(speed, delay) {
  openClose(speed, delay, currentItem);
  if (status == handMode.closed && previousStatus == handMode.closing) {
    //if (numOpens > 0) {
      changeItem();
    //}
    numOpens++;
  }
  previousStatus = status;
}

function openClose(speed, delay, objNum) {
  if (status == handMode.open) {
    currentImage = 0;
    if (millis() - handTime > delay) status = handMode.closing;
  }
  else if (status == handMode.closed) {
    currentImage = handImgs.length-1;
    if (millis() - handTime > delay) status = handMode.opening;
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
  else if (num == 1) {
    image(handImgs[num], width/2, height/2);
    push();
    translate(-1, 0);
    drawItem(objNum);
    pop();
  }
  else if (num == 0) {
    image(handImgs[num], width/2, height/2);
    push();
    translate(-2, 0);
    drawItem(objNum);
    pop();
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

function Star() {
  this.pic = floor(random(6));
  if (floor(random(2)) == 0) {
    this.x = random(width/2-50);
    console.log("why");
  }
  else {
    console.log("whynot");
    this.x = random(width/2-50) + width/2 + 100;
  }
  this.y = random(0, height);

  this.angle = random(2 * PI)
  this.display = function() {
    this.x++;
    if (this.x > width+50) this.x = -50;
    if (this.y > height) this.y = 0;
    else if (this.y < 0) this.y = height;

    push();
    scale(.5);
    rotate(this.angle);
    translate(this.x*2, this.y*2);
    image(starImgs[this.pic], 0, 0);
    pop();

  }
}
