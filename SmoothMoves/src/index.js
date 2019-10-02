import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CollisionRaycaster } from './Raycasting.js';
import TWEEN from '@tweenjs/tween.js'

'use strict';

var container,
    camera,
    scene,
    renderer,
    controls,
    selectedCube;

var colliders = [];
var raycast = new CollisionRaycaster();
main();

function main() {

    initScene();
}

function initScene() {
    // dom
    container = document.createElement('div');
    window.addEventListener('resize', onWindowResize, false);
    container.addEventListener('mousemove', mouseMove);
    container.addEventListener('mouseup', mouseUp);
    document.body.appendChild(container);

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // scene
    scene = new THREE.Scene();
    // camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(10, 10, 15);

    //controls
    controls = new OrbitControls(camera, renderer.domElement);

    //controls.update() must be called after any manual changes to the camera's transform
    controls.update();

    colliders.push(createCube(5, 5, 5, 0xffff00));


    for (var index = 0; index < 5; index++) {
        colliders.push(createCube(0.5, 10, 1, 0x00ff00));
        colliders[index + 1].position.set(index * 5, 0, 0);
    }

};

function createCube(width, height, depth, color) {
    var geometry = new THREE.BoxGeometry(width, height, depth);
    var material = new THREE.MeshBasicMaterial({ color: color });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    return cube;
}

function render() {
    renderer.render(scene, camera);
}

// animate            
(function animate() {
    requestAnimationFrame(animate);
    controls.update();
    TWEEN.update();
    render();

}());

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function mouseUp(e) {
    var mousePos = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, - (e.clientY / window.innerHeight) * 2 + 1);
    var intersects = raycast.raycastHits(camera, mousePos, colliders);
    if (intersects.length > 0) {
        selectedCube = intersects[0].object;
        onSelect(selectedCube);
    }
}


function mouseMove(e) {
    if (selectedCube) {
        //transformer.translate(selectedCube, e);
    }
}

function onSelect(element) {
    // controls.target = element.position;

    lookAtSmooth(element);
}

function lookAtSmooth(object) {

    // backup original rotation
    var startRotation = new THREE.Euler().copy(camera.rotation);
    // final rotation (with lookAt)
    camera.lookAt(object.position);
    var endRotation = new THREE.Euler().copy(camera.rotation);
    // revert to original rotation
    camera.rotation.copy(startRotation);

    // Tween
    new TWEEN.Tween(camera.rotation).to({ x: endRotation.x, y: endRotation.y, z: endRotation.z }, 250).start().onComplete(function(){
        controls.target = object.position;  
    });



}
