var container,
    camera,
    scene,
    renderer,
    controls;

'use strict';

initScene();

sphere = drawSphere(5, 32, 32);

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

    // White directional light at half intensity shining from the top.
    var directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    
    scene.add(directionalLight);
    // geometry -> CYLINDER
};
function drawSphere(rad, height, depth) {
    var geometry = new THREE.SphereGeometry(rad, height, depth);
    var material = new THREE.MeshPhysicalMaterial({ color: 0xffff00 });
    material.sheen =  new THREE.Color( 10, 10,10 ).multiplyScalar( 1 / 255 );
    material.roughness = 1;
    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    scene.add(scene);
    return scene;
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