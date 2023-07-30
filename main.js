import * as THREE from './node_modules/three/build/three.module.js';
import {OrbitControls} from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from './node_modules/three/examples/jsm/loaders/OBJLoader.js';
import {FBXLoader} from "./node_modules/three/examples/jsm/loaders/FBXLoader.js";
import Stats from './node_modules/three/examples/jsm/libs/stats.module.js';

var container, stats, controls;
var camera, scene, renderer, model, axes, clip;
var PosIndex = 0;
var clock = new THREE.Clock();
var mixer, mixer1, mixer2, mixer3;


var setMaterial = function (object, material) {
    object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material = material;
        }
    });
};

var addObject = function (object) {
    model.add(object);
    if (model.children.length == 2) {
        scene.add(model);
    }
};

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(100, 200, 300);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
    // scene.fog = new THREE.Fog(0xCACCCE, 80, 1000);

    var light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.9);

    var keyLight = new THREE.DirectionalLight(0xffffff, 0.5);
    keyLight.position.set(-100, 200, -50);
    keyLight.castShadow = true;

    var keyLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    keyLight2.position.set(-100, -200, -50);
    keyLight2.castShadow = true;
    scene.add(light);
    scene.add(keyLight);
    scene.add(keyLight2);

    // scene.add( new CameraHelper( light.shadow.camera ) );

    // ground
    // var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 1000), new THREE.MeshPhongMaterial({
    //     color: 0x999999,
    //     depthWrite: false
    // }));
    // mesh.rotation.x = -Math.PI / 2;
    // mesh.receiveShadow = true;
    // scene.add(mesh);

    // axes = new THREE.AxesHelper(500);
    // scene.add(axes);

    // var grid = new THREE.GridHelper(1000, 20, 0x000000, 0x000000);
    // grid.material.opacity = 0.2;
    // grid.material.transparent = true;
    // scene.add(grid);

    // paths
    var path1 = new THREE.Group();
    var spline = new THREE.CatmullRomCurve3([new THREE.Vector3(600, 461.1624166660247, 0),
        new THREE.Vector3(185.41019662496848, -113.82247775333701, 570.6339097770921),
        new THREE.Vector3(-485.4101966249684, 198.8742201158393, 352.67115137548393),
        new THREE.Vector3(-485.4101966249685, 413.6029483436214, -352.6711513754838),
        new THREE.Vector3(185.41019662496834, -23.302446511379117, -570.6339097770922)], true);

    var path2 = new THREE.Group();
    var spline2 = new THREE.CatmullRomCurve3([new THREE.Vector3(600, 328.90603926344295, 0),
        new THREE.Vector3(185.41019662496848, -192.6595408162731, 570.6339097770921),
        new THREE.Vector3(-485.4101966249684, 33.77671303482953, 352.67115137548393),
        new THREE.Vector3(-485.4101966249685, 454.072163198877, -352.6711513754838),
        new THREE.Vector3(185.41019662496834, -273.79402373637356, -570.6339097770922)], true);

    var path3 = new THREE.Group();
    var spline3 = new THREE.CatmullRomCurve3([new THREE.Vector3(600, 409.21981889273195, 0),
        new THREE.Vector3(185.41019662496848, 221.2263751019275, 570.6339097770921),
        new THREE.Vector3(-485.4101966249684, -84.09624055584038, 352.67115137548393),
        new THREE.Vector3(-485.4101966249685, 14.715245146383381, -352.6711513754838),
        new THREE.Vector3(185.41019662496834, 50.73559940791131, -570.6339097770922)], true);

    var path4 = new THREE.Group();
    var spline4 = new THREE.CatmullRomCurve3([new THREE.Vector3(600, 317.42017613994574, 0),
        new THREE.Vector3(185.41019662496848, 132.4471322566165, 570.6339097770921),
        new THREE.Vector3(-485.4101966249684, 231.1864756221562, 352.67115137548393),
        new THREE.Vector3(-485.4101966249685, -269.6615061990098, -352.6711513754838),
        new THREE.Vector3(185.41019662496834, 94.53924822068984, -570.6339097770922)], true);

    var points = spline.getPoints(100);
    var geometry = new THREE.BufferGeometry().setFromPoints(points);
    var material = new THREE.LineBasicMaterial({color: 0xff0000});

    var points1 = spline2.getPoints(100);
    var geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
    var material1 = new THREE.LineBasicMaterial({color: 0xff0011});

    var points2 = spline3.getPoints(100);
    var geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
    var material2 = new THREE.LineBasicMaterial({color: 0xff0011});

    var points3 = spline4.getPoints(100);
    var geometry3 = new THREE.BufferGeometry().setFromPoints(points3);
    var material3 = new THREE.LineBasicMaterial({color: 0xff0011});

// Create the final object to add to the scene
    var curveObject = new THREE.Line(geometry, material);
    // scene.add(curveObject);

    var curveObject1 = new THREE.Line(geometry1, material1);
    // scene.add(curveObject1);

    var curveObject2 = new THREE.Line(geometry2, material2);
    //  scene.add(curveObject2);

    var curveObject3 = new THREE.Line(geometry3, material3);

    // model
    var matOcean = new THREE.MeshPhongMaterial({
        color: 0x488feb,
        specular: 0xffffff,
        shininess: 0,
        flatShading: THREE.SmoothShading
    });
    var matLand = new THREE.MeshPhongMaterial({
        color: 0x6acc50,
        specular: 0xffffff,
        shininess: 0,
        flatShading: THREE.SmoothShading
    });
    // var matIce = new THREE.MeshPhongMaterial({
    //     color: 0xffffff,
    //     specular: 0xffffff,
    //     shininess: 0,
    //     flatShading: THREE.SmoothShading
    // });

    model = new THREE.Group();
    var loader = new OBJLoader();

    loader.load(
        'assets/ocean.obj',
        function (object) {
            setMaterial(object, matOcean);
            addObject(object);
        }
    );

    loader.load(
        'assets/land.obj',
        function (object) {
            setMaterial(object, matLand);
            addObject(object);
        }
    );

    // loader.load(
    //     'assets/ice.obj',
    //     function (object) {
    //         setMaterial(object, matIce);
    //         addObject(object);
    //     }
    // );

// cube
    //var boxgeometry1 = new THREE.BoxBufferGeometry(10, 10, 10);
    for (var i = 0; i < 1; i++) {
        var boxgeometry1 = new FBXLoader();
        boxgeometry1.load('assets/neoBird.fbx', function (object) {
            mixer = new THREE.AnimationMixer(object);

            var action = mixer.clipAction(object.animations[1]);
            action.play();

            object.traverse(function (child) {

                if (child.isMesh) {

                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            //for (var i = 0; i < 1; i++) {
            //     var myobj = object;
            object.scale.set(6, 6, 6);
            object.position.x = Math.random() * 600 - 400;
            object.position.y = Math.random() * 600 - 400;
            object.position.z = Math.random() * 600 - 400;
            // }
            path1.add(object);
        });
    }

    //------------------------------------
    for (var j = 0; j < 1; j++) {
        var boxgeometry2 = new FBXLoader();
        boxgeometry2.load('assets/neoBird.fbx', function (object) {
            mixer1 = new THREE.AnimationMixer(object);

            var action2 = mixer1.clipAction(object.animations[1]);
            action2.play();

            object.traverse(function (child) {

                if (child.isMesh) {

                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            //for (var i = 0; i < 1; i++) {
            //     var myobj = object;
            object.scale.set(0.1, 0.1, 0.1);
            object.position.x = Math.random() * 600 - 400;
            object.position.y = Math.random() * 600 - 400;
            object.position.z = Math.random() * 600 - 400;
            // }
            path2.add(object);
        });
    }

//------------------------------------
    for (var k = 0; k < 1; k++) {
        var boxgeometry3 = new FBXLoader();
        boxgeometry3.load('assets/neoBird.fbx', function (object) {
            mixer2 = new THREE.AnimationMixer(object);

            var action3 = mixer2.clipAction(object.animations[1]);
            action3.play();

            object.traverse(function (child) {

                if (child.isMesh) {

                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            //for (var i = 0; i < 1; i++) {
            //     var myobj = object;
            object.scale.set(0.1, 0.1, 0.1);
            object.position.x = Math.random() * 600 - 400;
            object.position.y = Math.random() * 600 - 400;
            object.position.z = Math.random() * 600 - 400;
            // }
            path3.add(object);
        });
    }
    //--------------------------------------------------------
    for (var j = 0; j < 1; j++) {
        var boxgeometry4 = new FBXLoader();
        boxgeometry4.load('assets/neoBird.fbx', function (object) {
            mixer3 = new THREE.AnimationMixer(object);

            var action4 = mixer3.clipAction(object.animations[1]);
            action4.play();

            object.traverse(function (child) {

                if (child.isMesh) {

                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            //for (var i = 0; i < 1; i++) {
            //     var myobj = object;
            object.scale.set(0.07, 0.07, 0.07);
            object.position.x = Math.random() * 600 - 400;
            object.position.y = Math.random() * 600 - 400;
            object.position.z = Math.random() * 600 - 400;
            // }
            path4.add(object);
        });
    }

// for (var i = 0; i < 10; i++) {
//
//     var object1 = new THREE.Mesh(boxgeometry1, new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}));
//
//     object1.position.x = Math.random() * 800 - 400;
//     object1.position.y = Math.random() * 800 - 400;
//     object1.position.z = Math.random() * 800 - 400;
//
//     var object2 = new THREE.Mesh(boxgeometry1, new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}));
//
//     object2.position.x = Math.random() * 800 - 400;
//     object2.position.y = Math.random() * 800 - 400;
//     object2.position.z = Math.random() * 800 - 400;
//
//     var object3 = new THREE.Mesh(boxgeometry1, new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}));
//
//     object3.position.x = Math.random() * 800 - 400;
//     object3.position.y = Math.random() * 800 - 400;
//     object3.position.z = Math.random() * 800 - 400;
//
//     path1.add(object1);
//     path2.add(object2);
//     path3.add(object3);
// }

    scene.add(path1);
    scene.add(path2);
    scene.add(path3);
    scene.add(path4);

    camera.position.z = 400;

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.enableZoom = false;

    controls.minPolarAngle = Math.PI / 180 * 90;
    controls.maxPolarAngle = Math.PI / 180 * 90;

    controls.rotateSpeed = 0.3;
    controls.update();

    window.addEventListener('resize', onWindowResize, false);

// stats
    stats = new Stats();
    container.appendChild(stats.dom);

    animate();

    function animate() {

        requestAnimationFrame(animate);

        var delta = clock.getDelta();

        if (mixer) mixer.update(delta);
        if (mixer1) mixer1.update(delta);
        if (mixer2) mixer2.update(delta);
        if (mixer3) mixer3.update(delta);

        controls.update();


        PosIndex++;
        if (PosIndex > 800) {
            PosIndex = 0;
        }

        anim(path1, spline, 800, PosIndex);
        anim(path2, spline2, 800, PosIndex);
        anim(path3, spline3, 800, PosIndex);
        anim(path4, spline4, 800, PosIndex);

        model.rotation.y += 0.005;

        renderer.render(scene, camera);

        stats.update();
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = init;

function anim(obj, curve, speed, ind) {

    var camPos = curve.getPoint(ind / speed);
    var camRot = curve.getTangent(ind / speed);

    obj.position.x = camPos.x;
    obj.position.y = camPos.y;
    obj.position.z = camPos.z;

    obj.rotation.x = camRot.x;
    obj.rotation.y = camRot.y;
    obj.rotation.z = camRot.z;
}