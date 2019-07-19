var container,
    camera,
    scene,
    renderer,
    controls;

'use strict';

initScene();

cube = drawCube(20, 10, 0.01);
var box = new THREE.Box3().setFromObject(cube);
//elem3d.position.set(0, box.getSize().y / 2, 0);//;
var boxSize = new THREE.Vector3();
box.getSize(boxSize);
cube.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -boxSize.y / 2, 0));
cube.rotateX(THREE.Math.degToRad(90));

function initScene() {
    // dom
    container = document.createElement('div');
    document.body.appendChild(container);

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // scene
    scene = new THREE.Scene();
    // axes
    scene.add(new THREE.AxisHelper(5));
    // camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(10, 10, 15);
    //controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.update() must be called after any manual changes to the camera's transform
    controls.update();
    // geometry -> CYLINDER
};
function drawCube(width, height, depth) {
    var geometry = new THREE.BoxGeometry(width, height, depth);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    let cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
    return cube;
}
// render
function render() {
    renderer.render(scene, camera);

}
// animate            
(function animate() {
    requestAnimationFrame(animate);
    controls.update()
    render();

}());