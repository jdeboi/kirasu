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

window.onload = function() {
  audio = document.getElementById('myAudio');
  audio.src="assets/kirasu.mp3";
  audio.setAttribute('preload', "none");
  var ctx = new AudioContext();
  var audioSrc = ctx.createMediaElementSource(audio);
  audioSrc.connect(ctx.destination);
  audio.play();
  audioReady = true;

  button = new PlayButton(window.innerWidth, window.innerHeight);
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


function PlayButton(w, h) {
  this.w = w;
  this.h = h;
  this.x = -w/2+300;
  this.y = -h/2+100;
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
    this.x = -this.w;
    this.y = -this.h;
  }

  this.show = function() {
    this.x = -this.w/2+300;
    this.y = -this.h/2+100;
  }
  this.display = function() {
    if (this.hover) {
      fill(this.w*.5);
      stroke(this.h*.5);
    }
    else {
      noFill();
      stroke(this.w);
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
