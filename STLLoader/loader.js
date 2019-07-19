var container,
    info,
    camera,
    scene,
    geometry,
    renderer,
    cube,
    cube2,
    controls;

'use strict';

const ScaleMM = 0.01;

initScene();

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

    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    light.intensity = 6;
    scene.add( light );
    // camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(10, 10, 15);
    //controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.update() must be called after any manual changes to the camera's transform
    controls.update();
    // geometry -> CYLINDER


    addEventListeners();

};

function addEventListeners() {
    document.getElementById('webgl').addEventListener("drop", function (event) {
        event.preventDefault();
        loadFiles(event.dataTransfer.files);
    });
    document.getElementById('webgl').addEventListener('dragover', function (event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }, false);
}

function loadFiles(files) {

    if (files.length > 0) {
        var filesMap = createFileMap(files);
        var manager = new THREE.LoadingManager();
        manager.setURLModifier(function (url) {
            var file = filesMap[url];
            if (file) {
                console.log('Loading', url);
                return URL.createObjectURL(file);
            }
            return url;

        });

        for (var i = 0; i < files.length; i++) {
            loadFile(files[i], manager);
        }
    }

};

function loadFile(file, manager) {

    var filename = file.name;
    var extension = filename.split('.').pop().toLowerCase();
    if (extension === "stl") {
        var reader = new FileReader();
        reader.addEventListener('progress', function (event) {

            var size = '(' + Math.floor(event.total / 1000).format() + ' KB)';
            var progress = Math.floor((event.loaded / event.total) * 100) + '%';

            console.log('Loading', filename, size, progress);

        });

        reader.addEventListener('load', function (event) {

            var contents = event.target.result;

            var geometry = new THREE.STLLoader().parse(contents);
            geometry.sourceType = "stl";
            geometry.sourceFile = file.name;

            var material = new THREE.MeshStandardMaterial();

            var mesh = new THREE.Mesh(geometry, material);
            mesh.name = filename;
            mesh.scale.set(ScaleMM,ScaleMM,ScaleMM);
            scene.add(mesh);
            // editor.execute( new AddObjectCommand( editor, mesh ) );

        }, false);

        if (reader.readAsBinaryString !== undefined) {

            reader.readAsBinaryString(file);

        } else {

            reader.readAsArrayBuffer(file);

        }
    }

}

function createFileMap(files) {

    var map = {};

    for (var i = 0; i < files.length; i++) {

        var file = files[i];
        map[file.name] = file;

    }

    return map;

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