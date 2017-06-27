var stars = [];
var fontReg;
var backgroundImg;
var constellationImgs = [];
var orchid, moth, whale;
var constellations = [];
var selected = -1;
var mobileView = {x:0, y:0};
var minWidth = 1300;
var minHeight = 800;
var maxTransX = 1300;
var maxTransY = 800;
var zoom = false;

var song;
var audio;
var audioReady = false;

var constID = {
  orchid: {
    id: 0, song: "Cycles", url: "cycles.html"
  },
  moth: {
    id:1, song: "Rite of Spring", url: "rite-of-spring.html"
  },
  whale: {
    id: 2, song: "Kirasu", url: "kirasu.html"
  },
  handeye: {
    id:3, song: "Delta Waves", url: "delta-waves.html"
  },
  bird: {
    id:4, song: "Song for M", url:"song-for-m.html"
  }
};

window.onload = function() {
  audio = document.getElementById('myAudio');
  audio.src="assets/constellation.mp3";
  audio.setAttribute('preload', "none");
  audio.loop = true;
  audioReady = true;
  audio.play();
};

function preload() {
  backgroundImg = loadImage("assets/concrete.jpg");
  constellationImgs[constID.orchid.id] = loadImage("assets/constellations/orchid.png");
  constellationImgs[constID.moth.id] = loadImage("assets/constellations/moth.png");
  constellationImgs[constID.whale.id] = loadImage("assets/constellations/whale.png");
  constellationImgs[constID.handeye.id] = loadImage("assets/constellations/handeye.png");
  constellationImgs[constID.bird.id] = loadImage("assets/constellations/moth.png");
  //fontReg = loadFont("");
}

function setup() {
  var w = windowWidth;
  var h = windowHeight;
  if (windowWidth < minWidth) {
    zoom = true;
    w = minWidth;
  }
  if (windowHeight < minHeight) h = minHeight;
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
  if(!zoom) background(backgroundImg);
  else image(backgroundImg, 0, 0, width, height);
  imageMode(CENTER);
  stars.star();


  checkMobile();
  for (var i = 0; i < constellations.length; i++) {
    constellations[i].display();
  }
}

function Constellation(id, song, url, x, y, tx, ty, trot, rot, rad, sc, points) {
  this.id = id;
  this.song = song;
  this.url = url;
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
    text(this.song, 0, 0);
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

function mouseClicked() {
  for (var i = 0; i < constellations.length; i++) {
    if (constellations[i].mouseOver()) {
      window.location.href='music/'+constellations[i].url;
    }
  }
}

function setupConstellations() {
  var x = width/2;
  var y = height/2;

  var points = [{x:-160, y:60},{x:0, y:-90}, {x:140, y:50}, {x:0, y:90}];
  constellations[0] = new Constellation(constID.orchid.id, constID.orchid.song, constID.orchid.url, x, y+200, 220, 380, -5, 0, 50, .3, points);

  points = [{x:-160, y:60},{x:0, y:-90}, {x:160, y:60}];
  constellations[1] = new Constellation(constID.moth.id, constID.moth.song, constID.moth.url , 500, 300, 220, 300, -5, 15, 50, .3, points);

  points = [{x:0, y:120},{x:-160, y:80}, {x:-260, y:-40}, {x:0, y:-10}, {x:160, y:60}, {x:260, y:10}, {x:280, y:-40}, {x:240, y:-60}, {x:160, y:60}];
  constellations[2] = new Constellation(constID.whale.id, constID.whale.song, constID.whale.url, x+250, y-200, 200, 270, -5, 0, 50, .35, points);

  points = [{x:-160, y:60},{x:0, y:-90}, {x:140, y:50}, {x:0, y:90}];
  constellations[3] = new Constellation(constID.handeye.id, constID.handeye.song, constID.handeye.url,x-450, y+160, 200, 270, -5, -65, 50, .3, points);

  points = [{x:-160, y:60},{x:0, y:-90}, {x:140, y:50}, {x:0, y:90}];
  constellations[4] = new Constellation(constID.bird.id, constID.bird.song, constID.bird.url, x+410, y+200, 200, 270, -5, -25, 50, .3, points);

  for (var i = 0; i < constellations.length; i++) {
    constellations[i].resizeImg();
  }
}

function checkMobile() {
  // is mobile?
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

    // rotation X
    // 90 upright
    // 0 flat on back
    var rx = 0;
    if (rotationX < 30) rx = 30;
    else if (rotationX > 140) rx = 140;
    translate(0, map(rx, 30, 140, -maxTransY/2, maxTransY/2));

    // rotationY


    console.log("z: " + rotationZ + " " + rotationX);
  }
}
