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
  var h = 10*sin(millis()/500)+10;
  var xp = width/2-island.width/2;
  image(island, xp, h);
  colorMode(HSB, width);
  if (!eye.open && millis() - eye.time > 100) {
    eye.open = true;
  }
  if (eye.open) {
    if (mouseX < width/3) image(eyeLeft, eye.x, eye.y+h);
    else if (mouseX > 2*width/3) image(eyeRight, eye.x, eye.y+h);
    else image(eyeImg, eye.x, eye.y+h);
  }
  if (lock.overEye) {
    for (var i = 1; i < 10; i++) {
      stroke(width*.70, width, width, width*.1);
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
  if (lock.locked) image(lockImg, lock.x, lock.y);
  else image(lockImg, lock.x, lock.y+h);
}

function mousePressed() {
  if (mouseX > lock.x && mouseX < lock.x + lockImg.width && mouseY > lock.y && mouseY < lock.y + lockImg.height) {
    lock.locked = true;
    lock.offSetX = mouseX - lock.x;
    lock.offSetY = mouseY - lock.y;
  }
  else {
    var navMain = $(".navbar-collapse"); // avoid dependency on #id
    navMain.collapse('hide');
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
  colorMode(HSB, width);
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

function windowResized() {
  var dx = (width - windowWidth)/2;
  var dy = (height - windowHeight)/2;
  stars.resize();
  eye.x -= dx;
  //eye.y -= dy;
  lock.x -= dx;
  //lock.y -= dy;
  resizeCanvas(windowWidth, windowHeight);
}
