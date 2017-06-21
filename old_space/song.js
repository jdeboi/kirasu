var song;
var isPlaying = true;
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
  audioReady = true;

  audio.play();

  button = new PlayButton(window.innerWidth, window.innerHeight);
  button.display();
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
  button.display();
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
    if (!isPlaying) {
      $("#playAudio").attr("class","showing");
      $("#stopAudio").attr("class","hidden");
    }
    else {
      $("#playAudio").attr("class","hidden");
      $("#stopAudio").attr("class","showing");
    }
  }

  this.toggle = function() {
    this.pause = !this.pause;
  }
}
