var backgroundImg;
var factor = 1;
var eyeOpen = true;
var eyeTime = 0;
var stars = [];
var lock, eye;

var rotX, rotY;
var cloudImg, cloud;

var spectrum;
var song;
var analyser;
var frequencyData;
var isPlaying = true;
var fft;
var button;
var mouseClickTime = 0;
var audio;
var audioReady = false;
var rainImgs = [];
var raindrops = [];


function preload() {
  backgroundImg = loadImage("assets/backgroundCloud.png");
  cloudImg = loadImage("assets/cloud.png");
  for (var i = 0; i < 7; i++) {
    rainImgs[i] = loadImage("assets/rain" + i + ".png");
  }
}

function setup() {
  if (windowWidth < 1200 && windowWidth > 768) createCanvas(1800, windowHeight);
  else createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER);
  colorMode(HSB, width);

  button = new PlayButton();

  // stars = new Flock();
  // Add an initial set of boids into the system
  // for (var i = 0; i < 100; i++) {
  //   var b = new Boid(random(width),random(height), i);
  //   stars.addBoid(b);
  // }
  cloudImg.resize(cloudImg.width/2, cloudImg.height/2);
  cloud = new Cloud(width*.6, 50);
}

function draw() {
  background(backgroundImg);
  cloud.render();
  button.display();
}

function mousePressed() {
  var navMain = $(".navbar-collapse"); // avoid dependency on #id
  navMain.collapse('hide');
}

function mouseReleased() {
}

function mouseDragged() {

}


function Flock() {
  // An array for all the boids
  this.boids = []; // Initialize the array
}

Flock.prototype.star = function() {
  for (var i = 0; i < this.boids.length; i++) {
    this.boids[i].star(this.boids);  // Passing the entire list of boids to each boid individually
  }
}

Flock.prototype.bird = function() {
  for (var i = 0; i < this.boids.length; i++) {
    this.boids[i].bird(this.boids);  // Passing the entire list of boids to each boid individually
  }
}

Flock.prototype.addBoid = function(b) {
  this.boids.push(b);
}

Flock.prototype.resize = function() {
  for (var i = 0; i < this.boids.length; i++) {
    this.boids[i].resize();  // Passing the entire list of boids to each boid individually
  }
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com
// Boid class
// Methods for Separation, Cohesion, Alignment added

function Boid(x,y,i) {
  this.id = i;
  this.acceleration = createVector(0,0);
  this.velocity = createVector(random(-1,1),random(-1,1));
  this.position = createVector(x,y);
  this.r = 3.0;
  this.maxspeed = 3;    // Maximum speed
  this.maxforce = 0.05; // Maximum steering force
  this.isShowing = true;
  this.twinkleCounter = 0;
  this.angle = random(360);
  this.wingUp = floor(random(2)) == 0;
  this.wingCount = floor(random(10));
  this.landed = false;
  this.isFlyingHome = false;
  this.mode = 0;
  this.scale = random(.05,.15);
  this.avoidBeach();
}

Boid.prototype.avoidIsland = function() {
  var r = 310;
  var y = height/2;
  var x = width/2;
  var d = sqrt((this.position.x-x)*(this.position.x - x)+(this.position.y-y)*(this.position.y-y));
  if(d < r) {
    if (floor(random(2)) === 0) this.position.x = random(width/4);
    else this.position.x = random(3*width/4, width);
  }
}

Boid.prototype.star = function(boids) {
  this.renderStar();
  this.twinkle();
}

Boid.prototype.bird = function(boids) {
  var mode = {flying: 0, home: 1, mouse:2, landed:3};
  if (this.mode === mode.flying) {
    this.landed = false;
    this.flock(boids);
    this.update();
    this.borders();
  }
  else if (this.mode === mode.home) {
    this.flyHome();
    if (!this.landed) this.update();
  }
  else if (this.mode === mode.mouse) {
    this.flyToMouse();
    this.flock(boids);
    this.update();
  }
  this.renderBird();
}


Boid.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
}

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function(boids) {
  var sep = this.separate(boids);   // Separation
  var ali = this.align(boids);      // Alignment
  var coh = this.cohesion(boids);   // Cohesion
  // Arbitrarily weight these forces
  sep.mult(1.5);
  ali.mult(1.0);
  coh.mult(1.0);
  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}

// Method to update location
Boid.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function(target) {
  var desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  var steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  // Limit to maximum steering force
  return steer;
}

Boid.prototype.flyHome = function() {
  // We could add mass here if we want A = F / M
  if (!this.landed) {
    var degrees = map(this.id, 0, 100, 0, 180);
    var x = width/2;
    var y = height;
    var r = 300;
    var cx = x - r * cos(degrees);
    var cy = y - r * sin(degrees);

    var d = Math.sqrt((this.position.x - cx)*(this.position.x - cx) + (this.position.y - cy)*(this.position.y - cy));
    var dcenter = Math.sqrt((this.position.x - x)*(this.position.x - x) + (this.position.y - y)*(this.position.y - y));

    if (d  < 20 && dcenter > r+10) {
      this.landed = true;
      var target = createVector(width/2,height);

      var desired = p5.Vector.sub(this.position, target);
      this.velocity = desired;
    }

    else {
      var vel = createVector(cx, cy);
      this.applyForce(this.seek(vel));
    }
  }
}

Boid.prototype.flyToMouse = function() {
  // We could add mass here if we want A = F / M
  if (!this.landed) {
    var vel = createVector(mouseX, mouseY);
    this.applyForce(this.seek(vel));

  }
}


Boid.prototype.renderStar = function() {
  // Draw a triangle rotated in the direction of velocity
  if(this.isShowing) {
    fill(width, width*.7);
    stroke(width);

    push();
    translate(this.position.x,this.position.y);
    rotate(this.angle);
    scale(this.scale);
    beginShape();
    vertex(0, 47);
    vertex(53, 70);
    vertex(4, 114);
    vertex(71, 90);
    vertex(107, 129);
    vertex(91, 75);
    vertex(154, 60);
    vertex(90, 52);
    vertex(79, -2);
    vertex(64, 46);
    endShape(CLOSE);
    pop();
  }
}

Boid.prototype.renderBird = function() {
  // Draw a triangle rotated in the direction of velocity



  var theta = this.velocity.heading() + 90;

  fill(width);
  stroke(width);

  push();
  translate(this.position.x,this.position.y);
  rotate(theta);
  beginShape();
  vertex(0, -this.r*2);
  vertex(-this.r, this.r*2);
  vertex(this.r, this.r*2);
  endShape(CLOSE);

  if (this.landed) {
    var wc = 13;
    if (this.wingCount++%wc == 0) this.wingUp =! this.wingUp;
  }
  else if(this.velocity.y > .3) {
    this.wingCount = 10;
    this.wingUp = true;
  }
  else {
    var wc = floor((map(this.velocity.x,-this.maxspeed,this.maxspeed,10,5)));
    if (this.wingCount++%wc === 0) this.wingUp =! this.wingUp;
  }
  if(this.wingUp) {
    var r = 4.0;
    beginShape(TRIANGLES);
    vertex(0, -r);
    vertex(-r*2, r);
    vertex(r*2, r);
    endShape();
  }
  pop();
}



Boid.prototype.twinkle = function() {
  if (!this.isShowing && this.twinkleCounter > 30) {
    this.isShowing = true;
    this.twinkleCounter = 0;
  }
  else if (!this.isShowing) this.twinkleCounter++;
  else if (floor(random(400)) === 0)  {
    this.isShowing = false;
    this.twinkleCounter = 0;
  }
}

// Wraparound
Boid.prototype.borders = function() {
  if (this.position.x < -this.r)  this.position.x = width +this.r;
  if (this.position.y < -this.r)  this.position.y = height+this.r;
  if (this.position.x > width +this.r) this.position.x = -this.r;
  if (this.position.y > height+this.r) this.position.y = -this.r;
}

// Separation
// Method checks for nearby boids and steers away
Boid.prototype.separate = function(boids) {
  var desiredseparation = 25.0;
  var steer = createVector(0,0);
  var count = 0;
  // For every boid in the system, check if it's too close
  for (var i = 0; i < boids.length; i++) {
    var d = p5.Vector.dist(this.position,boids[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      var diff = p5.Vector.sub(this.position,boids[i].position);
      diff.normalize();
      diff.div(d);        // Weight by distance
      steer.add(diff);
      count++;            // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
Boid.prototype.align = function(boids) {
  var neighbordist = 50;
  var sum = createVector(0,0);
  var count = 0;
  for (var i = 0; i < boids.length; i++) {
    var d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    var steer = p5.Vector.sub(sum,this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0,0);
  }
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Boid.prototype.cohesion = function(boids) {
  var neighbordist = 50;
  var sum = createVector(0,0);   // Start with empty vector to accumulate all locations
  var count = 0;
  for (var i = 0; i < boids.length; i++) {
    var d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum);  // Steer towards the location
  } else {
    return createVector(0,0);
  }
}

Boid.prototype.resize = function() {
  var dx = width - windowWidth;
  var dy = height - windowHeight;
  this.position.x -= dx;
  this.position.y -= dy;
}

Boid.prototype.avoidBeach = function() {
  var r = width*1.24/2;
  var y = height+540*width/1200;
  var x = width/2;
  var d = sqrt((this.position.x-x)*(this.position.x - x)+(this.position.y-y)*(this.position.y-y));
  if(d < r) {
    this.position.x = random(width);
    this.position.y = random(height/2);
  }
}

function windowResized() {
  var dx = (width - windowWidth)/2;
  var dy = (height - windowHeight)/2;
  //stars.resize();
  resizeCanvas(windowWidth, windowHeight);

}

function SkySphere(skyImg) {
  this.img = skyImg;
  this.render = function() {
    push();
    if (mouseX === 0 && mouseY === 0) {
      rotateZ(radians(180));
      rotateX(-windowHeight/2 * 0.01);
      rotateY(Math.PI)
      rotateY(windowWidth/2 * 0.01);
    }
    else {
      rotateZ(radians(180));
      rotateX(-mouseY * 0.01);
      rotateY(Math.PI)
      rotateY(mouseX * 0.01);
    }
    texture(this.img);
    sphere(1600/2.5);
    pop();
  }

}

window.onload = function() {
  audio = document.getElementById('myAudio');
  // cycles
  audio.src="../assets/kirasu.mp3";
  audio.setAttribute('preload', "none");
  var ctx = new AudioContext();
  var audioSrc = ctx.createMediaElementSource(audio);
  audioSrc.connect(ctx.destination);
  //audio.play();
  audioReady = true;

};

function toggleSong() {
  // if (song.isPlaying()) {
  //   isPlaying = false;
  //   song.pause();
  // } else {
  //   isPlaying = true;
  //   song.play();
  // }
  if (!isPlaying){
    audio.play();
    isPlaying = true;
  }
  else {
    audio.pause();
    isPlaying = false;
  }
}


function PlayButton() {

  this.x = -width/2+300;
  this.y = -height/2+100;
  this.xPlay = this.x;
  this.yPlay = this.y;
  this.rPlay = 20;
  this.hover = false;
  this.pause = false;
  this.hide = false;
  this.r = 20;
  this.triW = 20;

  this.resize = function() {
    // this.x = -width*.3;
    // this.y = -height/2;
  }

  this.hide = function() {
    this.x = -width;
    this.y = -height;
  }

  this.show = function() {
    this.x = -width/2+300;
    this.y = -height/2+100;
  }
  this.display = function() {
    if (this.hover) {
      fill(width*.5);
      stroke(width*.5);
    }
    else {
      noFill();
      stroke(width);
    }
    if (!isPlaying) {
      d3.select("#playAudio").attr("class","showing");
      d3.select("#stopAudio").attr("class","hidden");
    }
    else {
      d3.select("#playAudio").attr("class","hidden");
      d3.select("#stopAudio").attr("class","showing");
    }
  }

  this.isMouseOver = function() {

    if (!isPlaying) {
      var d = sqrt((mouseX - this.x)* (mouseX - this.x) + (mouseY - this.y)* (mouseY - this.y));
      if (d < this.r) {
        this.hover = true;
      }
      else this.hover = false;
    }
    else {
      var d = sqrt((mouseX - this.xPlay)* (mouseX - this.xPlay) + (mouseY - this.yPlay)* (mouseY - this.yPlay));
      if (d < this.rPlay) {
        this.hover = true;
      }
      else this.hover = false;
    }
    return this.hover;
  }

  this.toggle = function() {
    this.pause = !this.pause;
  }
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
      if (this.y > windowHeight) {
        this.isFalling = false;
        this.y = this.startY;
      }
    }
  }
}
