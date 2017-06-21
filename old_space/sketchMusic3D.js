
var domEl = document.getElementById('container');
var image = "assets/skydress3.png";
var options = {};
var sphereR =1800/2.4;
window.onresize = resize;

// custom global variables
var targetList = [];
var projector, mouse = { x: 0, y: 0 };


var camera, controls, scene, renderer, sphere;

var button;

var webglSupport = (function(){
  try {
    var canvas = document.createElement( 'canvas' );
    return !! (window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch(e) {
    return false;
  }
})();

init();
render();

function init () {
  // http://threejs.org/docs/#Reference/Cameras/PerspectiveCamera
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);
  camera.position.x = 0.1;
  camera.position.y = 0;
  camera.position.z = sphereR/2;

  setControls();

  scene = new THREE.Scene();

  var texture = THREE.ImageUtils.loadTexture(image);
  texture.minFilter = THREE.LinearFilter;
  sphere = new THREE.Mesh(
    new THREE.SphereGeometry(sphereR, 30, 30),
    new THREE.MeshBasicMaterial({
      map: texture
    })
  );
  sphere.material.side = THREE.BackSide;
  scene.add(sphere);

  renderer = webglSupport ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  domEl.appendChild(renderer.domElement);

  addLight();
  //custom();
  addText();
  //addLines();
  animate();

}

function render () {
  renderer.render(scene, camera);
}

function animate () {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

function resize () {
  camera.aspect = domEl.offsetWidth / domEl.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(domEl.offsetWidth, domEl.offsetHeight);
  render();
}

// http://stackoverflow.com/questions/21548247/clean-up-threejs-webgl-contexts
function remove () {
  scene.remove(sphere);
  while (domEl.firstChild) {
    domEl.removeChild(domEl.firstChild);
  }
}

function addText() {
  var loader = new THREE.FontLoader();

  loader.load('fonts/helvetiker_regular.typeface.json', function(font) {

    var geometry = new THREE.TextGeometry('Kirasu', {
      font: font,
      size: 50,
      height:2
    });

    var textMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0xfbbbff
    });

    var mesh = new THREE.Mesh(geometry, textMaterial);
    mesh.position.set(230,300,-sphereR*.8);
    mesh.rotation.y = THREE.Math.degToRad(-35);
    scene.add(mesh);
    targetList.push(mesh);

  });


}

function addLines() {

  var geometry = new THREE.CylinderGeometry( 3, 3, 60, 32 ); //radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, thetaStart, thetaLength)
  var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
  var cylinder = new THREE.Mesh( geometry, material );
  cylinder.position.set(100, 100, -sphereR*.8);
  cylinder.rotation.y = THREE.Math.degToRad(-35);
  scene.add( cylinder );
}

function addLight() {
  // LIGHTS
  var ambient = new THREE.AmbientLight(0xffffff);
  scene.add(ambient);
  pointLight = new THREE.PointLight(0xffffff, 2);
  scene.add(pointLight);
}

function setControls() {
  controls = new THREE.OrbitControls( camera, domEl );
  controls.addEventListener( 'change', render ); // remove when using animation loop
  // enable animation loop when using damping or autorotation
  //controls.enableDamping = true;
  //controls.dampingFactor = 0.25;
  controls.enableZoom = false;
  controls.noZoom = true;
  controls.noPan = true;
}


function custom() {
  ////////////
  // CUSTOM //
  ////////////
  // view-source:http://stemkoski.github.io/Three.js/Mouse-Click.html

  //////////////////////////////////////////////////////////////////////

  // this material causes a mesh to use colors assigned to faces
  var faceColorMaterial = new THREE.MeshBasicMaterial(
    { color: 0xffffff, vertexColors: THREE.FaceColors } );

    var sphereGeometry = new THREE.SphereGeometry( 40, 32, 16 );
    for ( var i = 0; i < sphereGeometry.faces.length; i++ )
    {
      face = sphereGeometry.faces[ i ];
      face.color.setRGB( 0, 0, 0.8 * Math.random() + 0.2 );
    }
    var sphere = new THREE.Mesh( sphereGeometry, faceColorMaterial );
    sphere.position.set(0, 50, -sphereR-10);
    scene.add(sphere);

    targetList.push(sphere);

    //////////////////////////////////////////////////////////////////////

    // initialize object to perform world/screen calculations
    projector = new THREE.Projector();

    // when the mouse moves, call the given function
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );

  }

  function onDocumentMouseDown( event )
  {
    // the following line would stop any other event handler from firing
    // (such as the mouse's TrackballControls)
    // event.preventDefault();

    console.log("Click.");

    // update the mouse variable
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // find intersections

    // create a Ray with origin at the mouse position
    //   and direction into the scene (camera direction)
    var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
    projector.unprojectVector( vector, camera );
    var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

    // create an array containing all objects in the scene with which the ray intersects
    var intersects = ray.intersectObjects( targetList );

    // if there is one (or more) intersections
    if ( intersects.length > 0 )
    {
      console.log("Hit @ " + toString( intersects[0].point ) );
      // change the color of the closest face.
      intersects[ 0 ].face.color.setRGB( 0.8 * Math.random() + 0.2, 0, 0 );
      intersects[ 0 ].object.geometry.colorsNeedUpdate = true;
    }

  }

  function toString(v) { return "[ " + v.x + ", " + v.y + ", " + v.z + " ]"; }
