import * as THREE from './node_modules/three/build/three.module.js';
import {OrbitControls} from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import {FBXLoader} from './node_modules/three/examples/jsm/loaders/FBXLoader.js';
import {OBJLoader} from "./node_modules/three/examples/jsm/loaders/OBJLoader.js";

$(document).ready(function () {
    setTimeout(function () {
        $('body').addClass('loaded');
    }, 4000);
});

var container, controls;
var camera, scene, renderer, model, delta;
var PosIndex = 0;
var mixer1, mixer2, mixer3, mixer4, mixerN1, mixerN2, mixerN3;
var clock = new THREE.Clock();


var nY = -300;
var nZ = 500;
var nX = 500;


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
    container = document.createElement('tag');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(100, 200, 300);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe8f7f5);
    // scene.fog = new THREE.Fog(0xCACCCE, 100, 1000);

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

    // plane mesh
    var geometry = new THREE.PlaneGeometry(100, 100);
    var material = new THREE.MeshBasicMaterial({color: 0xFFFAFA, side: THREE.DoubleSide, transparent: true});
    material.opacity = 0.6;
    var plane = new THREE.Mesh(geometry, material);
    plane.position.set(36, -200, 270);
    plane.rotateY(0.25);
    plane.scale.set(4, 2, 1);
    scene.add(plane);

    // path
    var path1 = new THREE.Group();
    var spline1 = new THREE.CatmullRomCurve3([new THREE.Vector3(600, 461.1624166660247, 0),
        new THREE.Vector3(185.41019662496848, -113.82247775333701, 570.6339097770921),
        new THREE.Vector3(-485.4101966249684, 198.8742201158393, 352.67115137548393),
        new THREE.Vector3(-485.4101966249685, 413.6029483436214, -352.6711513754838),
        new THREE.Vector3(185.41019662496834, -23.302446511379117, -570.6339097770922)], true);
    //
    var path2 = new THREE.Group();
    var spline2 = new THREE.CatmullRomCurve3([new THREE.Vector3(600, 328.90603926344295, 0),
        new THREE.Vector3(185.41019662496848, -192.6595408162731, 570.6339097770921),
        new THREE.Vector3(-485.4101966249684, 33.77671303482953, 352.67115137548393),
        new THREE.Vector3(-485.4101966249685, 454.072163198877, -352.6711513754838),
        new THREE.Vector3(185.41019662496834, -273.79402373637356, -570.6339097770922)], true);
    //
    var path3 = new THREE.Group();
    var spline3 = new THREE.CatmullRomCurve3([new THREE.Vector3(600, 409.21981889273195, 0),
        new THREE.Vector3(185.41019662496848, 221.2263751019275, 570.6339097770921),
        new THREE.Vector3(-485.4101966249684, -84.09624055584038, 352.67115137548393),
        new THREE.Vector3(-485.4101966249685, 14.715245146383381, -352.6711513754838),
        new THREE.Vector3(185.41019662496834, 50.73559940791131, -570.6339097770922)], true);
    //
    var path4 = new THREE.Group();
    var spline4 = new THREE.CatmullRomCurve3([new THREE.Vector3(600, 317.42017613994574, 0),
        new THREE.Vector3(185.41019662496848, 132.4471322566165, 570.6339097770921),
        new THREE.Vector3(-485.4101966249684, 231.1864756221562, 352.67115137548393),
        new THREE.Vector3(-485.4101966249685, -269.6615061990098, -352.6711513754838),
        new THREE.Vector3(185.41019662496834, 94.53924822068984, -570.6339097770922)], true);

    var pathN1 = new THREE.Group();
    var splineN1 = new THREE.CatmullRomCurve3([new THREE.Vector3(399.1894434532049, -44.49295273565846, -171.30880340013252),
        new THREE.Vector3(295.4135153743622, 83.43891657159529, 222.26935512572152),
        new THREE.Vector3(-63.281861500819645, 22.434048450645207, 377.045171954248),
        new THREE.Vector3(447.8979220884573, 2.108261772687719, 250.83215850443554),
        new THREE.Vector3(-77.01647568605676, 116.61603943913605, 324.13143656043997),
        new THREE.Vector3(365.98668433254477, 4.9332996323076514, 238.72871841857597)]
    );
    var pathN2 = new THREE.Group();
    var splineN2 = new THREE.CatmullRomCurve3([new THREE.Vector3(399.1894434532049, -44.49295273565846, -171.30880340013252),
        new THREE.Vector3(295.4135153743622, 83.43891657159529, 222.26935512572152),
        new THREE.Vector3(-61.766916776538956, 77.95588562446434, 313.05667387307153),
        new THREE.Vector3(294.8361583536669, -8.509599657839203, 284.6505872043449),
        new THREE.Vector3(-42.52993092595912, 5.061644920239004, 304.70979479519093),
        new THREE.Vector3(129.0557930621676, 15.270249048349037, 280.45311249009666)]
    );

    var pointsN1 = splineN1.getPoints(5000);
    var geometryN1 = new THREE.BufferGeometry().setFromPoints(pointsN1);
    var materialN1 = new THREE.LineBasicMaterial({color: 0xff0000});
    var curveObjectN1 = new THREE.Line(geometryN1, materialN1);
    // scene.add(curveObjectN1);

    var pointsN2 = splineN1.getPoints(5000);
    var geometryN2 = new THREE.BufferGeometry().setFromPoints(pointsN2);
    var materialN2 = new THREE.LineBasicMaterial({color: 0xff0f00});
    var curveObjectN2 = new THREE.Line(geometryN2, materialN2);
    // scene.add(curveObjectN2);


    var points1 = spline1.getPoints(1000);
    var geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
    var material1 = new THREE.LineBasicMaterial({color: 0xff0000});
    //
    var points2 = spline2.getPoints(1000);
    var geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
    var material2 = new THREE.LineBasicMaterial({color: 0xff0000});
    //
    var points3 = spline3.getPoints(1000);
    var geometry3 = new THREE.BufferGeometry().setFromPoints(points3);
    var material3 = new THREE.LineBasicMaterial({color: 0xff0000});
    //
    var points4 = spline4.getPoints(1000);
    var geometry4 = new THREE.BufferGeometry().setFromPoints(points4);
    var material4 = new THREE.LineBasicMaterial({color: 0xff0000});

    // path added to the scene
    var curveObject1 = new THREE.Line(geometry1, material1);
    // scene.add(curveObject1);

    var curveObject2 = new THREE.Line(geometry2, material2);
    // scene.add(curveObject2);

    var curveObject3 = new THREE.Line(geometry3, material3);
    // scene.add(curveObject3);

    var curveObject4 = new THREE.Line(geometry4, material4);
    // scene.add(curveObject4);

    // globe
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

    model.position.set(nX, nY, nZ);

    // model
    for (var i = 0; i < 8; i++) {
        var loader1 = new FBXLoader();
        loader1.load('assets/neoBird.fbx', function (object) {

            mixer1 = new THREE.AnimationMixer(object);

            mixer1.clipAction(object.animations[0]).play();

            object.traverse(function (child) {

                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            object.scale.set(0.05, 0.05, 0.05);
            object.position.x = Math.random() * 600;
            object.position.y = Math.random() * 600;
            object.position.z = Math.random() * 600;
            path1.add(object);
        });
    }
    //
    for (var i = 0; i < 8; i++) {
        var loader2 = new FBXLoader();
        loader2.load('assets/neoBird.fbx', function (object) {

            mixer2 = new THREE.AnimationMixer(object);

            var action = mixer2.clipAction(object.animations[0]);
            action.play();

            object.traverse(function (child) {

                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            object.scale.set(0.05, 0.05, 0.05);
            object.position.x = Math.random() * 600 - 400;
            object.position.y = Math.random() * 600 - 400;
            object.position.z = Math.random() * 600 - 400;
            path2.add(object);
        });
    }
    //
    for (var i = 0; i < 8; i++) {
        var loader3 = new FBXLoader();
        loader3.load('assets/neoBird.fbx', function (object) {

            mixer3 = new THREE.AnimationMixer(object);

            mixer3.clipAction(object.animations[0]).play();

            object.traverse(function (child) {

                if (child.isMesh) {

                    child.castShadow = true;
                    child.receiveShadow = true;

                }

            });
            object.scale.set(0.05, 0.05, 0.05);
            object.position.x = Math.random() * 600 - 400;
            object.position.y = Math.random() * 600 - 400;
            object.position.z = Math.random() * 600 - 400;
            path3.add(object);
        });
    }
    //
    for (var i = 0; i < 8; i++) {
        var loader4 = new FBXLoader();
        loader4.load('assets/neoBird.fbx', function (object) {

            mixer4 = new THREE.AnimationMixer(object);

            mixer4.clipAction(object.animations[0]).play();

            object.traverse(function (child) {

                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            object.scale.set(0.05, 0.05, 0.05);
            object.position.x = Math.random() * 600 - 400;
            object.position.y = Math.random() * 600 - 400;
            object.position.z = Math.random() * 600 - 400;
            path4.add(object);
        });
    }

    var loaderN1 = new FBXLoader();
    loaderN1.load('assets/neoBird.fbx', function (object) {

        mixerN1 = new THREE.AnimationMixer(object);

        mixerN1.clipAction(object.animations[0]).play();

        object.traverse(function (child) {

            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        object.scale.set(0.04, 0.04, 0.04);
        object.position.x = Math.random();
        object.position.y = Math.random();
        object.position.z = Math.random();
        pathN1.add(object);
    });

    var loaderN2 = new FBXLoader();
    loaderN2.load('assets/neoBird.fbx', function (object) {

        mixerN2 = new THREE.AnimationMixer(object);

        mixerN2.clipAction(object.animations[0]).play();

        object.traverse(function (child) {

            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        object.scale.set(0.04, 0.04, 0.04);
        // object.position.x = Math.random() * 600;
        // object.position.y = Math.random() * 600;
        // object.position.z = Math.random() * 600;
        pathN2.add(object);
    });


    scene.add(path1);
    scene.add(path2);
    scene.add(path3);
    scene.add(path4);
    scene.add(pathN1);
    scene.add(pathN2);

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
    controls.enableRotate = false;
    controls.enablePan = false;

    controls.rotateSpeed = 0.4;
    controls.update();

    window.addEventListener('resize', onWindowResize, false);

    animate();

    function animate() {

        requestAnimationFrame(animate);

        delta = clock.getDelta();
        if (mixer1) mixer1.update(delta);
        if (mixer2) mixer2.update(delta);
        if (mixer3) mixer3.update(delta);
        if (mixer4) mixer4.update(delta);
        if (mixerN1) mixerN1.update(delta);
        if (mixerN2) mixerN2.update(delta);

        controls.update();

        PosIndex++;
        if (PosIndex > 800) {
            PosIndex = 0;
        }

        anim(path1, spline1, 800, PosIndex);
        anim(path2, spline2, 800, PosIndex);
        anim(path3, spline3, 800, PosIndex);
        anim(path4, spline4, 800, PosIndex);
        anim(pathN1, splineN1, 1000, PosIndex);
        anim(pathN2, splineN2, 1000, PosIndex);


        var mX = model.position.x;
        var mY = model.position.y;
        var mZ = model.position.z;
        var newMesh = plane.position.y;

        model.rotation.y += 0.005;

        if (mX === 0) {
            model.position.x = 0;
        } else {
            model.position.x -= 10;
        }

        if (mY === 0) {
            model.position.y = 0;
        } else {
            model.position.y += 1.5;
        }

        if (mZ === 0) {
            model.position.z = 0;
        } else {
            model.position.z -= 2.5;
        }

        if (newMesh === 0) {
            plane.position.y = 0;
        } else {
            plane.position.y += 0.25;
        }
        renderer.render(scene, camera);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = init;

function anim(obj, curve, speed, index) {
    var camPos = curve.getPoint(index / speed);
    var camRot = curve.getTangent(index / speed);

    obj.position.x = camPos.x;
    obj.position.y = camPos.y;
    obj.position.z = camPos.z;

    obj.rotation.x = camRot.x;
    obj.rotation.y = camRot.y;
    obj.rotation.z = camRot.z;
}