var backgroundImg;
var factor = 1;
var eyeOpen = true;
var eyeTime = 0;
var stars = [];
var lock, eye;

var rotX, rotY;
var cloudImg, cloud;


var rainImgs = [];
var raindrops = [];

var thunder = false;
var thundering = false;
var lastThundering = 0;
var lastThunder = 0;
var thunderNum = 0;
var ranTime = 0;
var tTime = 20;


function preload() {
  backgroundImg = loadImage("assets/backgroundCloud.png");
  cloudImg = loadImage("assets/cloud.png");
  for (var i = 0; i < 7; i++) {
    rainImgs[i] = loadImage("assets/rain" + i + ".png");
  }
}

function setup() {
  if (windowWidth < 1200 && windowWidth > 768) createCanvas(1200, windowHeight);
  else createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER);
  colorMode(HSB, width);

  cloudImg.resize(cloudImg.width/2, cloudImg.height/2);
  cloud = new Cloud(width*.6, 50);

  for (var i = 0; i < 7; i++) {
    rainImgs[i].resize(rainImgs[i].width/2, rainImgs[i].height/2);
  }
}

function draw() {
  background(backgroundImg);
  checkThunder();
  if (!thunder) {
    fill(0);
    rect(0, 0, width, height);
  }
  cloud.render();
}

function mousePressed() {
  var navMain = $(".navbar-collapse"); // avoid dependency on #id
  navMain.collapse('hide');
}

function mouseReleased() {
}

function mouseDragged() {

}

function windowResized() {
  var dx = (width - windowWidth)/2;
  var dy = (height - windowHeight)/2;
  //stars.resize();
  resizeCanvas(windowWidth, windowHeight);

}

function Cloud(x, y) {
  this.x = x;
  this.y = y;
  this.s = 1;
  this.isRaining = true;
  this.currentDrop = 0;
  this.lastChecked = millis();

  this.raindrops = [];
  for(var i = 0; i < 100; i++) {
    this.raindrops[i] = new Raindrop(this.x, this.y, this.s);
  }

  this.render = function() {
    if (this.isRaining) {
      if (millis()-this.lastChecked > 50) {
        this.lastChecked = millis();
        this.currentDrop++;
        if(this.currentDrop >= 100) this.currentDrop = 0;
        this.raindrops[this.currentDrop].isFalling = true;
        this.raindrops[this.currentDrop].cloudMove(this.x, this.y);
      }
      for(var i = 0; i < 100; i++) {
        this.raindrops[i].render();
        this.raindrops[i].rain(5);
      }
    }
    if (mouseIsPressed) {
      var s = map(mouseX-this.x, 0, width, 0, 10);
      this.x += s;
    }
    image(cloudImg, this.x, this.y);
  }
}



function Raindrop(cloudX, cloudY, cloudS) {
  this.cloudX = cloudX;
  this.cloudY = cloudY;
  this.cloudS = cloudS;
  this.startY = this.cloudY+cloudImg.height*.5;
  this.x = floor(random(cloudImg.width*.8)+cloudImg.width*.1);
  this.y = this.startY;
  this.isFalling = false;
  this.id = floor(random(7));
  this.cloudMove = function(cloudX, cloudY) {
    this.cloudX = cloudX;
    this.cloudY = cloudY;
  }
  this.render = function() {
    if (this.isFalling) {
      image(rainImgs[this.id], this.x+this.cloudX, this.y);
    }
  }
  this.rain = function(speed) {
    if (this.isFalling) {
      this.y += speed;
      if (this.y > windowHeight-30) {
        this.isFalling = false;
        this.y = this.startY;
      }
    }
  }
}

function checkThunder() {
  if (!thundering) {
    if (millis() - lastThundering > 1000 + ranTime) {
      thundering = true;
      lastThundering = millis();
    }
  }
  else if (thundering) {
    if (!thunder) {
      if (thunderNum == 0) {
        thunder = true;
        lastThunder = millis();
        thunderNum++;
        tTime += 50;
      }
      else if (millis() - lastThunder > 50) {
        thunder = true;
        lastThunder = millis();
      }
    }
    else if (thunder) {
      if (millis() - lastThunder > tTime) {
        lastThunder = millis();
        thunder = false;
        thunderNum++;
        if (thunderNum == 5) {
          thundering = false;
          thunderNum = 0;
          tTime = 20;
          lastThundering = millis();
          ranTime = random(8000);
        }
      }
    }
  }
}
