var backgroundImg, butterfly;
var butterflyParts = {body: [], left: [], right:[]};
var moveStep = 0;
var moveD = 1;
var mode = 0;

function preload() {
  backgroundImg = loadImage("assets/delta/background.jpg");

  butterflyParts.body[0] = new ButterflyPart(loadImage("assets/delta/butterfly_body.png"), windowWidth/2, windowHeight/2, false);
  butterflyParts.left[0] = new ButterflyPart(loadImage("assets/delta/bottomLeft.png"), windowWidth/2-120, windowHeight/2+30, false);
  butterflyParts.left[1] = new ButterflyPart(loadImage("assets/delta/topLeft.png"), windowWidth/2-150, windowHeight/2-150, false);
  butterflyParts.left[2] = new ButterflyPart(loadImage("assets/delta/topLeft_0.png"), windowWidth/2-280, windowHeight/2-300, false);
  butterflyParts.left[3] = new ButterflyPart(loadImage("assets/delta/middleLeft.png"), windowWidth/2-190, windowHeight/2+100, false);

  butterflyParts.right[0] = new ButterflyPart(loadImage("assets/delta/bottomRight.png"), windowWidth/2+150, windowHeight/2+30, true);
  butterflyParts.right[1] = new ButterflyPart(loadImage("assets/delta/bottomRight_0.png"), windowWidth/2+190, windowHeight/2+100, true);
  butterflyParts.right[2] = new ButterflyPart(loadImage("assets/delta/topRight.png"), windowWidth/2+130, windowHeight/2-150, true);
  butterflyParts.right[3] = new ButterflyPart(loadImage("assets/delta/topRight_0.png"), windowWidth/2+210, windowHeight/2-280, true);
  butterflyParts.right[4] = new ButterflyPart(loadImage("assets/delta/topRight_1.png"), windowWidth/2+250, windowHeight/2-300, true);
  //butterflyParts.right[5] = new ButterflyPart(loadImage("assets/delta/middleRight.png"), windowWidth/2+280, windowHeight/2, true);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}



function draw() {
  if (millis() > 10000) mode = 1;
  imageMode(CORNER);
  background(backgroundImg);
  imageMode(CENTER);

  // left wing
  moveStep+= 1 * moveD;

  if (moveStep > 200) moveD = -1;
  else if (moveStep < 0) moveD = 1;

  translate(0, 100);
  for (var i = 0; i < butterflyParts.left.length; i++) {
    butterflyParts.left[i].display();
    butterflyParts.left[i].update(moveStep);
  }

  for (var i = 0; i < butterflyParts.right.length; i++) {
    butterflyParts.right[i].display();
    butterflyParts.right[i].update(moveStep);
  }

  // body
  imageMode(CENTER);
  image(butterflyParts.body[0].img, butterflyParts.body[0].x, butterflyParts.body[0].y, butterflyParts.body[0].img.width/2, butterflyParts.body[0].img.height/2);
}



function ButterflyPart(img, x, y, dir) {
  this.img = img;
  this.x = x;
  this.y = y;
  this.startX = x;
  this.startY = y;
  this.dir = dir;
  this.origM = Math.sqrt((windowWidth/2 - this.x)*(windowWidth/2 - this.x)+(this.y - windowHeight/2)*(this.y - windowHeight/2));
  this.angle = atan((this.y - windowHeight/2)/(this.x-windowWidth/2));
  //else this.angle = atan((this.y - windowHeight/2)/(windowWidth/2 - this.x));
  //this.angle = radians(random(360));
  this.display = function() {
    if (mode == 0) {
      if (this.mouseOver()) {
        imageMode(CENTER);
        image(this.img, this.x, this.y, this.img.width/2, this.img.height/2);
      }
    }
    else {
      imageMode(CENTER);
      image(this.img, this.x, this.y, this.img.width/2, this.img.height/2);
    }
  };
  this.mouseOver = function() {
    imageMode(CORNER);
    return (mouseX > this.x && mouseX < this.x + this.img.width/2 && mouseY > this.y && mouseY < this.y + this.img.height/2);
  }

  this.update = function(ms) {
    if (mode == 1) {
      if (dir) {
        this.x = windowWidth/2 + (this.origM+ms) * cos(this.angle);
        this.y = windowHeight/2 + (this.origM+ms) * sin(this.angle);
      }
      else {
        this.x = windowWidth/2 - (this.origM+ms) * cos(this.angle);
        this.y = windowHeight/2 - (this.origM+ms) * sin(this.angle);
      }
    }
    else {
      this.x = this.startX;
      this.y = this.startY;
    }
  }
}
