$('#about').click(function(event){
  event.stopPropagation();
});
$('#contact').click(function(event){
  event.stopPropagation();
});

var backgroundImg, island, keyImg, fire, eyeImg, eyeLeft, eyeRight;
var factor = 1;
var eyeOpen = true;
var eyeTime = 0;

var stars = [];
var lock, eye;

function preload() {
  backgroundImg = loadImage("assets/concrete.jpg");
  island = loadImage("assets/island.png");
  lockImg = loadImage("assets/key.png");
  fire = loadImage("assets/fire.png");
  eyeImg = loadImage("assets/eyeopen.png");
  eyeLeft = loadImage("assets/eyeLeft.png");
  eyeRight = loadImage("assets/eyeRight.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER);
  colorMode(HSB, width);

  factor = windowHeight/island.height;
  island.resize(island.width*factor, windowHeight);
  lockImg.resize(factor*lockImg.width, factor*lockImg.height);
  fire.resize(factor*fire.width, factor*fire.height);
  eyeImg.resize(factor*eyeImg.width*.8, factor*eyeImg.height*.8);
  eyeLeft.resize(factor*eyeLeft.width*.8, factor*eyeLeft.height*.8);
  eyeRight.resize(factor*eyeRight.width*.8, factor*eyeRight.height*.8);

  stars = new Flock();
  // Add an initial set of boids into the system
  for (var i = 0; i < 100; i++) {
    var b = new Boid(random(width),random(height), i);
    stars.addBoid(b);
  }

  lock = {x: 0, y: 0, offSetX: 0, offSetY:0, locked: false, overEye: false};
  lock.x = (width - lockImg.width)/2;
  lock.y = height-240*factor;

  eye = {x: 0, y: 0, open: true, time: 0};
  eye.x = width/2-island.width/2+370*factor;
  eye.y = 110*factor;

}

function draw() {
  background(backgroundImg);
  stars.star();
  var xp = width/2-island.width/2;
  image(island, xp, 0);
  if (!eye.open && millis() - eye.time > 100) {
    eye.open = true;
  }
  if (eye.open) {
    if (mouseX < width/3) image(eyeLeft, eye.x, eye.y);
    else if (mouseX > 2*width/3) image(eyeRight, eye.x, eye.y);
    else image(eyeImg, eye.x, eye.y);
  }
  if (lock.overEye) {

    for (var i = 1; i < 10; i++) {
      stroke(width*.7, width, width, width*.1);
      fill(width*.7, width, width, width/i*.1);
      ellipse(lock.x+lockImg.width/2, lock.y+lockImg.height/2, i*10+5);
    }
  }
  else if (mouseX > lock.x && mouseX< lock.x + lockImg.width && mouseY > lock.y && mouseY < lock.y + lockImg.height) {

    for (var i = 1; i < 10; i++) {
      stroke(i*10, width, width, width*.2);
      fill(i*10, width, width, width/i*.1);
      ellipse(lock.x+lockImg.width/2, lock.y+lockImg.height/2, i*10+5);
    }
  }
  image(lockImg, lock.x, lock.y);
}

function mousePressed() {
  if (mouseX > lock.x && mouseX < lock.x + lockImg.width && mouseY > lock.y && mouseY < lock.y + lockImg.height) {
    lock.locked = true;
    lock.offSetX = mouseX - lock.x;
    lock.offSetY = mouseY - lock.y;
  }
}

function mouseReleased() {
  lock.locked = false;
  if (lock.overEye) {
    lock.overEye = false;
    lock.hidden = true;
    window.location.href='music.html';
  }
}

function mouseDragged() {
  if (lock.locked) {
    lock.y = mouseY-lock.offSetY;
    lock.x = mouseX-lock.offSetX;
    if (mouseX > eye.x && mouseX < eye.x + eyeImg.width && mouseY > eye.y && mouseY < eye.y + eyeImg.height) {
      fill(50, width, width);
      ellipse(mouseX, mouseY, 40);
      lock.overEye = true;
    }
    else {
      lock.overEye = false;
    }
  }
}

setInterval(function(){
  eye.open = false;
  eye.time = millis();
}, 4000);

function hideAll() {
  button.hide();
  d3.select("#about").attr("class", "hidden");
  d3.select("#contact").attr("class", "hidden");
}

function showCanvas() {
  hideAll();
  grayScale = false;
  button.show();
}

function showAbout() {
  grayScale = true;
  hideAll();
  d3.select("#about").attr("class", "showing");
}

function showContact() {
  grayScale = true;
  hideAll();
  d3.select("#contact").attr("class", "showing");
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
  this.avoidIsland();
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
    fill(0, width/2);
    stroke(0);

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

function windowResized() {
  var dx = (width - windowWidth)/2;
  var dy = (height - windowHeight)/2;
  stars.resize();
  eye.x -= dx;
  eye.y -= dy;
  lock.x -= dx;
  lock.y -= dy;
  resizeCanvas(windowWidth, windowHeight);

  if (width < 500) {
    d3.select("#socials").style("display", "none");
    // d3.select("#logo svg g").style("transform", "scale(" +  .08* width/500 + ")");
    // d3.select("#logo svg").style("width", width/500*224 + "px");
  }
  else {
    d3.select("#socials").style("display", "inline");
    // d3.select("#logo svg g").style("transform", "scale(" +  .08 + ")");
    // d3.select("#logo svg").style("width", "224px");
    // d3.select("#logo svg").style("height", "107px");
  }
}
