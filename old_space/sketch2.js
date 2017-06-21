
function setup() {
  if (windowWidth < 675) {
    // $("#logo").css('left', '30px');
    // $("#soundIcon").css("padding-right", "10px");
  }
}

function draw() {

}

function mouseClicked() {
  var navMain = $(".navbar-collapse"); // avoid dependency on #id
  navMain.collapse('hide');
}
