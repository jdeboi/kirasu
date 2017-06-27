var whale, ocean, moon;
var bubbles = [];

function preload() {
  whale = loadImage("assets/kirasu/whale.png");
  ocean = loadImage("assets/kirasu/bluewaves.png");
  //moon = loadImage("assets/kirasu/moons.jpg");
  moon = loadImage("assets/delta/background.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, width);
  for(var i = 0; i < 10; i++) {
    bubbles[i] = new Bubble();
  }
}

function draw() {
  //settingSun();
  imageMode(CORNER);
  background(moon);
  imageMode(CENTER);
  image(whale, width/2, height/2+30+10*sin(millis()/600), whale.width*.6, whale.height*.6);
  for(var i = 0; i < bubbles.length; i++) {
    bubbles[i].display();
  }
  imageMode(CORNER);
  image(ocean, -20+15*sin(millis()/500), 100+15*sin(millis()/700), width+40, height);
}

function settingSun() {
  for (var i = 0; i < width/2; i++) {
    stroke(i/5+50, width, width-millis()/10)
    line(0, i, width, i);
  }
  noStroke();
}


function Bubble() {
  this.hidden = true;
  this.startX = width/2 - 260;
  this.rX = random(10)+1;
  this.x = width/2 - 260;
  this.y = height/2+30+10*sin(millis()/600)-70;
  this.display = function() {
    if (this.hidden) {
      if (floor(random(200)) == 0) {
        this.hidden = false;
        this.y = height/2+30+10*sin(millis()/600)-70;
      }
    }
    else {
      stroke(width);
      fill(width, 255/2);
      ellipse(this.x, this.y, 30);
      if (frameCount%2 == 0) this.x+= random(2) -1;
      if (this.y > 200) this.y--;
      else if (this.y > -300) this.y-= 3;
      else this.hidden = true;
    }

  }

}
