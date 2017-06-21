var stars = [];
var fontReg;
var backgroundImg;
var constellationImgs = [];
var orchid, moth, whale;
var constellations = [];
var selected = -1;
var mobileView = {x:0, y:0};

function preload() {
  backgroundImg = loadImage("assets/concrete.jpg");
  constellationImgs[0] = loadImage("assets/constellations/orchid.png");
  constellationImgs[1] = loadImage("assets/constellations/moth.png");
  constellationImgs[2] = loadImage("assets/constellations/whale.png");
  constellationImgs[3] = loadImage("assets/constellations/handeye.png");
  constellationImgs[4] = loadImage("assets/constellations/moth.png");
  //fontReg = loadFont("");
}

function setup() {
  var w = windowWidth;
  var h = windowHeight;
  if (windowWidth < 1300) w = 1300;
  if (windowHeight < 800) h = 800;
  createCanvas(w, h);
  colorMode(HSB, width);
  angleMode(DEGREES);
  ellipseMode(CENTER);

  stars = new Flock();
  // Add an initial set of boids into the system
  for (var i = 0; i < 100; i++) {
    var b = new Boid(random(width),random(height), i);
    stars.addBoid(b);
  }
  textFont("Quicksand");
  // ---------------------- id, name, x, y, tx, ty, trot, rot, rad, sc
  setupConstellations();
}

function draw() {
  imageMode(CORNER);
  background(backgroundImg, width/2, height/2);
  stars.star();
  
  imageMode(CENTER);
  checkMobile();
  for (var i = 0; i < constellations.length; i++) {
    constellations[i].display();
  }
}

function Constellation(id, o, name, x, y, tx, ty, trot, rot, rad, sc, points) {
  this.id = id;
  this.name = name;
  this.o = o;
  this.x = x;
  this.y = y;
  this.tx = tx;
  this.ty = ty;
  this.trot = trot;
  this.rot = rot;
  this.rad = rad;
  this.sc = sc;
  this.points = points;
  // this.brightStars = new Flock();
  // // Add an initial set of boids into the system
  // for (var i = 0; i < points.length; i++) {
  //   var b = new Boid(points[i].x,points[i].y, i);
  //   this.brightStars.addBoid(b);
  // }

  this.getTint = function () {
    var t = 0;
    var d = this.getDistance();
    if (d > this.rad*3) t = .08;
    else if (d < this.rad) {
      t = .8;
    }
    else t = map(d, this.rad, this.rad*3, .8, .08);
    tint(255, t*255);
    //ellipse(this.x, this.y, d);
    //fill(0, width, width);
  }
  this.mouseOver = function () {
    if (this.getDistance() < this.rad*3) return true;
    return false;
  }
  this.getDistance = function () {
    var d = sqrt((mouseX - this.x)*(mouseX - this.x) + (mouseY - this.y)*(mouseY - this.y));
    return d;
  }
  this.display = function() {

    //ellipse(this.x,this.y, this.rad*6);

    push();

    translate(this.x, this.y);

    push();
    rotate(this.rot);
    tint(255, 255);
    this.getTint();
    image(constellationImgs[this.id], 0, 0);
    pop();
    textSize(30);
    if (this.mouseOver()) {
      fill(width);
      stroke(width);
    }
    else {
      fill(width, 50);
      stroke(width, 50);
    }

    push();
    //translate(this.tx, this.ty);
    text(this.name, 0, 0);
    pop();


    this.drawStars();
    pop();
  }
  this.drawStars = function() {
    //for(var j = 5; j > 0; j--) {
    // if (this.mouseOver()) {
    //   strokeWeight(j*1.5);
    //   stroke(width, 100-j*20);
    //   fill(width, 100-j*20);
    // }
    // else {
    // strokeWeight(2);
    // stroke(width, 50);
    // fill(width, 50);
    //}
    strokeWeight(2);
    stroke(width);
    fill(width);
    var j = 3;
    for(var i = 0; i < this.points.length-1; i++) {
      line(this.points[i].x, this.points[i].y, this.points[i+1].x, this.points[i+1].y);
      ellipse(this.points[i].x, this.points[i].y, j*3);
    }
    line(this.points[0].x, this.points[0].y, this.points[this.points.length-1].x, this.points[this.points.length-1].y);
    ellipse( this.points[this.points.length-1].x, this.points[this.points.length-1].y, j*3);
    //}
  }
  this.resizeImg = function() {
    constellationImgs[this.id].resize(constellationImgs[this.id].width*this.sc, constellationImgs[this.id].height*this.sc);
  }
}

function getSelected() {
  for (var i = 0; i < constellations.length; i++) {
    if (constellations[i].mouseOver()) {
      return i;
    }
  }
  return -1;
}

function mouseClicked() {
  if (getSelected() == 0) window.location.href='music/delta-waves.html';
  else if (getSelected() == 1) window.location.href='music/cycles.html';
  else if (getSelected() == 2) window.location.href='music/kirasu.html';
  else if (getSelected() == 3) window.location.href='music/song-for-m.html';
  else if (getSelected() == 4) window.location.href='music/rite-of-spring.html';
}

function setupConstellations() {
  var x = width/2;
  var y = height/2;

  var points = [{x:-160, y:60},{x:0, y:-90}, {x:140, y:50}, {x:0, y:90}];
  constellations[0] = new Constellation(0, "orchid", "Delta Waves", x, y+200, 220, 380, -5, 0, 50, .3, points);

  points = [{x:-160, y:60},{x:0, y:-90}, {x:160, y:60}];
  constellations[1] = new Constellation(1, "moth", "Cycles", 500, 300, 220, 300, -5, 15, 50, .3, points);

  points = [{x:0, y:120},{x:-160, y:80}, {x:-260, y:-40}, {x:0, y:-10}, {x:160, y:60}, {x:260, y:10}, {x:280, y:-40}, {x:240, y:-60}, {x:160, y:60}];
  constellations[2] = new Constellation(2, "whale", "Kirasu", x+250, y-200, 200, 270, -5, 0, 50, .35, points);

  points = [{x:-160, y:60},{x:0, y:-90}, {x:140, y:50}, {x:0, y:90}];
  constellations[3] = new Constellation(3, "handeye", "Song for M", x-450, y+160, 200, 270, -5, -65, 50, .3, points);

  points = [{x:-160, y:60},{x:0, y:-90}, {x:140, y:50}, {x:0, y:90}];
  constellations[4] = new Constellation(4, "moth", "Rite of Spring", x+410, y+200, 200, 270, -5, -25, 50, .3, points);

  for (var i = 0; i < constellations.length; i++) {
    constellations[i].resizeImg();
  }
}

function checkMobile() {
  // is mobile?
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

    //////////////////////// check z (left right)
    if ((rotationZ - pRotationZ > 0 && rotationZ - pRotationZ < 270)|| rotationZ - pRotationZ < -270) {
      // rotateDirection = 'clockwise';
      mobileView.x++;
      if (mobileView.x > maxWidth) mobileView.x = maxWidth;
    }
    else if (rotationZ - pRotationZ < 0 || rotationZ - pRotationZ > 270){
      // rotateDirection = 'counter-clockwise';
      mobileView.x--;
      if (mobileView.x < 0) mobileView.x = 0;
    }

    //////////////////////// check x (up down)
    var rX = rotationX + 180;
    var pRX = pRotationX + 180;

    if ((rX - pRX > 0 && rX - pRX < 270)|| rX - pRX < -270){
      //rotateDirection = 'clockwise';
      mobileView.y++;
      if (mobileView.y > maxHeight) mobileView.y = maxHeight;
    }
    else if (rX - pRX < 0 || rX - pRX > 270){
      //rotateDirection = 'counter-clockwise';
      mobileView.y--;
      if (mobileView.y < 0) mobileView.y = 0;
    }
    translate(-mobileView.x, -mobileView.y);
  }
}
