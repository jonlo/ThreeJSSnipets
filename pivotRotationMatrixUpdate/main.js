var container,
    camera,
    scene,
    renderer,
    pivot_matrix,
    cube,
    controls;

'use strict';

main();

function main() {
    initScene();
    cube = drawCube(20, 10, 0.01);
    var box = new THREE.Box3().setFromObject(cube);
    var boxSize = new THREE.Vector3();
    box.getSize(boxSize);
    cube.position.set(boxSize.x / 2, 0, 0);

    //CREATE PIVOT MATRIX
    var position = new THREE.Vector3(cube.position.x - boxSize.x / 2, 0, 0);
    var rotation = new THREE.Quaternion();
    var eulerRot = new THREE.Euler();
    eulerRot.set(0, 0, 0);
    rotation.setFromEuler(eulerRot);

    pivot_matrix = createPivotMatrix(position, rotation);
    applyPivot();
}

function createPivotMatrix(position, rotation) {
    var pivot_matrix = new THREE.Matrix4();
    var scale = new THREE.Vector3(1, 1, 1);
    pivot_matrix.compose(position, rotation, scale);
    return pivot_matrix;
}

function applyPivot() {

    // get world transforms from desired pivot
    // inverse it to know how to move pivot to [0,0,0]
    let pivot_inv = new THREE.Matrix4().getInverse(pivot_matrix, false);

    // place pivot to [0,0,0]
    // apply same transforms to object
    cube.applyMatrix(pivot_inv);
    var rotation = new THREE.Quaternion();
    var eulerRot = new THREE.Euler();
    eulerRot.set(0, 0, 0);
    rotation.setFromEuler(eulerRot);
    // say, we want to rotate 0.1deg around Y axis of pivot
    var desiredTransform = new THREE.Matrix4().compose(new THREE.Vector3(0,5,0),rotation,new THREE.Vector3(1, 1, 1));
    cube.applyMatrix(desiredTransform);

    // and put things back, i.e. apply pivot initial transformation
   cube.applyMatrix(pivot_matrix);
}

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

function drawCube(width, height, depth, color = 0x00ff00) {
    var geometry = new THREE.BoxGeometry(width, height, depth);
    var material = new THREE.MeshBasicMaterial({ color });
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