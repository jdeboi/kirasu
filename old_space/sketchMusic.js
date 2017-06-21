var backgroundImg, backgroundImg2, island, keyImg, fire, eyeImg, eyeLeft, eyeRight;
var factor = 1;
var eyeOpen = true;
var eyeTime = 0;
var stars = [];
var lock, eye;

var rotX, rotY;
var sky, constellation;

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

function preload() {
  backgroundImg = loadImage("assets/skydress3.png");
  //backgroundImg2 = loadImage("assets/skydress_sphere.png");
}

function setup() {
  // if (windowWidth < 1600 && windowWidth > 768) createCanvas(1600, windowHeight, WEBGL);
  // else
  createCanvas(windowWidth, windowHeight, WEBGL);
  ellipseMode(CENTER);
  colorMode(HSB, width);

  button = new PlayButton();
  //
  // stars = new Flock();
  // // Add an initial set of boids into the system
  // for (var i = 0; i < 100; i++) {
  //   var b = new Boid(random(width),random(height), i);
  //   stars.addBoid(b);
  // }


  sky = new SkySphere(backgroundImg);
  //innerSky = sky = new SkySphere(backgroundImg);
  constellation = new Constellation(30, 30);
}

function draw() {


  //button.isMouseOver();
  button.display();
  sky.render();
  constellation.render();

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
  stars.resize();
  resizeCanvas(windowWidth, windowHeight);

}

function SkySphere(skyImg) {
  this.img = skyImg;
  this.render = function() {
    push();
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      // is mobile..
      // if (rotationX === 0 && rotationY === 0) {
      //   rotateZ(radians(180));
      //   rotateX(-windowHeight/2 * 0.01);
      //   rotateY(Math.PI)
      //   rotateY(windowWidth/2 * 0.01);
      // }
      // else {
        rotateZ(radians(180));
        rotateX(-rotationY * 0.01);
        rotateY(Math.PI)
        rotateY(rotationX * 0.01);
      //}
    }
    else {
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
    }
    texture(this.img);
    sphere(800/2.5);
    pop();
  }

}

function skyBox(skyImgs) {
  this.render = function() {
    rotateX(mouseY * 0.01);
    rotateY(-mouseX * 0.01);

    push();
    translate(0, windowWidth/2, 0);
    texture(skyImgs[0]);
    box(windowWidth, 1, 0);
    pop();

    // top
    push();
    translate(0, -windowWidth/2, 0);
    texture(skyImgs[1]);
    box(windowWidth,1, 0);
    pop();

    // front
    push();
    rotateX(radians(90))
    translate(0, windowWidth/2, 0);
    texture(skyImgs[2]);
    box(windowWidth,1, 0);
    pop();

    // back
    push();
    rotateX(radians(90))
    translate(0, -windowWidth/2, 0);
    texture(skyImgs[3]);
    box(windowWidth,1, 0);
    pop();

    // right
    push();
    rotateX(radians(90))
    rotateZ(radians(90));
    translate(0, -windowWidth/2, 0);
    texture(skyImgs[4]);
    box(windowWidth,1, 0);
    pop();

    // right
    push();
    rotateX(radians(90))
    rotateZ(radians(-90));
    translate(0, -windowWidth/2, 0);
    texture(skyImgs[5]);
    box(windowWidth,1, 0);
    pop();
  }
}


function Constellation(theta, phi) {
  this.theta = theta;
  this.phi = phi;
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
    for(var i = 0; i < 100; i+=10) {
      push();
      rotateY(radians(this.theta+i));
      rotateX(radians(-this.phi));

      noStroke();

      for (var j = 0; j < 5; j++) {
        push();
        translate(0, 0, 1800/2.5-20);
        fill(width, width-j*width/5);
        ellipse(0, 0, 10+j*3);
        pop();
      }
      pop();
    }
    // draws shapes
    // fill(width);
    // stroke(width);
    // beginShape();
    // for(var i = 0; i < 100; i+=10) {
    //   push();
    //   rotateY(radians(this.theta+i));
    //   rotateX(radians(-this.phi));
    //   translate(0, 0, 1800/2.5-20);
    //   vertex(0, 0, 0);
    // }
    // endShape();
    pop();
  }
}

window.onload = function() {
  audio = document.getElementById('myAudio');
  audio.src="assets/kirasu.mp3";
  audio.setAttribute('preload', "none");
  var ctx = new AudioContext();
  var audioSrc = ctx.createMediaElementSource(audio);
  audioSrc.connect(ctx.destination);
  audio.play();
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
