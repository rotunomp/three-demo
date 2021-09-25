import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GridHelper} from "three";
import {typewriter, clearTypewriter, hideElement, showElement, changeDisplay, flashDisplay} from "./helpers";
import * as TH from "./ThreeHelper";
import {GUI} from "three/examples/jsm/libs/dat.gui.module";

document.addEventListener("DOMContentLoaded", function(){
    document.body.removeAttribute('hidden');
});


document.querySelector('.left-arrow').addEventListener('click', event => {
    previousStep();
});
document.querySelector('.right-arrow').addEventListener('click', event => {
    nextStep();
});
document.querySelector('#begin').addEventListener('click', event => {
    document.querySelector('#begin').style.visibility = "hidden";
    nextStep();
});

// Initial Positions for the objects in space. These will be used for determining where to focus things
const circleInitX = 40;
const circleInitY = 10;
const knotInitX = 25;
const knotInitY = 20;
const boxInitX = -25;
const boxInitY = -20;
const coneInitX = boxInitX + 5;
const coneInitY = boxInitY - 5;
const cameraInitZ = 30;

// Variable which keeps the default animator from going while a transition is happening
let transitioning = false;

// A little demo
window.setTimeout(loopDemo, 1000);
// The scene is needed to make things
const scene = new THREE.Scene();

// The camera is used to view the objects in the scene. A PerspectiveCamera mimics the view of a human eye
const camera = new THREE.PerspectiveCamera(1, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setZ(cameraInitZ);

// The renderer renders the objects we're gonna view
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

// GUI helper for changing properties
const gui = TH.makeGui();
const cameraFolder = gui.addFolder('camera');
cameraFolder.add(camera, 'fov');
cameraFolder.add(camera.position, 'x');
cameraFolder.add(camera.position, 'y');
cameraFolder.add(camera.position, 'z');


function loopDemo()
{
    // Let's make shapes!
    // This circle uses a MeshBasicMaterial, which means that it doesn't need a light source to show up
    const geometry = new THREE.CircleGeometry(8);
    const material = new THREE.MeshBasicMaterial({color: '#FFFFFF', wireframe: true});
    const circle = new THREE.Mesh(geometry, material);
    circle.translateX(circleInitX);
    circle.translateY(circleInitY);

    // This torus knot is gonna have a Mesh that's dependant on a light source. Cool!
    const knotGeometry = new THREE.TorusKnotGeometry(8, 2, 37, 12, 1, 2);
    const knotMaterial = new THREE.MeshStandardMaterial({color: 0xEF959D});
    const knot = new THREE.Mesh(knotGeometry, knotMaterial);
    knot.position.setX(knotInitX);
    knot.position.setY(knotInitY);

    // And to view the torus knot, we gotta add a light source
    let pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.set(10, 10, 0);
    // You can add a lighthelper if you want, to see the position of the light itself
    // pointLight = new THREE.PointLightHelper(pointLight);

    // AmbientLight is kinda like a giant floodlight which is nice cause you can just see everything
    const ambientLight = new THREE.AmbientLight(0xFFFFFF);

    // Let's add a SHITLOAD of stars for some fun ambient objects
    function addStar() {
        const geometry = new THREE.SphereGeometry(0.25, 24, 24);
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const star = new THREE.Mesh(geometry, material);

        const [x, y, z] = Array(3)
            .fill()
            .map(() => THREE.MathUtils.randFloatSpread(100));

        star.position.set(x, y, z);
        scene.add(star);
    }

    // Box for placeholder
    const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
    const boxMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: true});
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.setX(boxInitX)
    box.position.setY(boxInitY)

    // Parametric geometry?
    // const paraGeometry = new THREE.ParametricGeometry(THREE.ParametricGeometries.klein, 25, 25 );
    const coneGeometry = new THREE.ConeGeometry( 5, 5, 4 );
    const coneMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: true} );
    const cone = new THREE.Mesh( coneGeometry, coneMaterial );
    cone.position.setX(coneInitX);
    cone.position.setY(coneInitY);


    // Add a GridHelper to get an idea where we are in space
    const gridHelper = new GridHelper(200, 50);

    // Let's add some OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)

    // Add everything to the scene
    TH.addToScene(scene, [
        circle,
        knot,
        ambientLight,
        box,
        cone,
        // gridHelper
    ], gui, [
        pointLight,
    ]);

    Array(200).fill().forEach(addStar);

    // Animate loop
    // Constants for animation
    const circleRotateSpeed = .02;
    const circleTranslateXSpeed = -.2;
    const circleTranslateYSpeed = .1;
    const circleMinX = 30;
    const circleMaxY = 15;

    const circleVector = new THREE.Vector3(circleInitX, circleInitY, 0);

    function animate() {
        requestAnimationFrame(animate);

        // Rotate the circle
        circle.rotateX(circleRotateSpeed);
        circle.rotateY(circleRotateSpeed);
        circle.rotateZ(circleRotateSpeed);

        // If it's more than the min X, but

        // Bounce the circle back and forth
        // if(circle.position.x > circleMinX && left) {
        //     console.log('back')
        //     circle.translateX(circleTranslateXSpeed);
        //     circle.translateY(circleTranslateYSpeed);
        // }
        // else {
        //     left = circle.position.x <= circleMinX;
        //     console.log('forth')
        //     circle.translateX(-circleTranslateXSpeed);
        //     circle.translateY(-circleTranslateYSpeed);
        // }

        // Rotate the knot
        knot.rotateX(.0075);
        knot.rotateY(.0075);
        knot.rotateZ(.0075);

        // rotate the box
        box.rotateX(.01);
        box.rotateY(.01);
        box.rotateZ(.01);

        // Move the cone around the box
        cone.rotateX(.02);
        cone.rotateY(.02);
        cone.rotateZ(.02);

        // cone.rotateOnAxis(circleVector, .001);


        // controls.update();
        TWEEN.update();
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    }

    animate();

    document.querySelector('#loading').classList.add('loaded');
    setTimeout(() => {
        document.querySelector('#loading').remove();
    }, 1000)
}

// Steps which are defined by arrow clicks
let currentStep = 1;
function nextStep() {
    if (transitioning) return;
    loadStep(1);
}
function previousStep() {
    if (transitioning) return;
    loadStep(-1);
}

function loadStep(increment) {
    let step = currentStep + increment;

    switch (step) {
        case 1:
            return;
        case 2:
            if(currentStep === 1) {
                one_two();
            }
            else {
                three_two();
            }
            break;
        case 3:
            if(currentStep === 2) {
                two_three();
            }
            else {
                four_three();
            }
            break;
        case 4:
            if(currentStep === 3) {
                three_four();
            }
            else {
                four_three();
            }
            break;
        default:
            return;
    }

    currentStep = step;
}

// Display Box Typing Speed
const displayTypingSpeed = 6;
const headerTypingSpeed = 100;

// Zoom out
function one_two() {
    startTransition();
    TH.smoothChangeFov(camera, 110, 11000);

    let timer = 0;

    typewriter('Welcome', 'header', headerTypingSpeed);
    timer = timer + 2000;
    setTimeout(() => typewriter('Three.js demo', 'header', headerTypingSpeed), timer);
    timer = timer + 3000;
    setTimeout(() => typewriter('Sit back and enjoy', 'header', headerTypingSpeed), timer);
    timer = timer + 5000;
    setTimeout(() => hideElement('header'), timer);
    timer = timer + 500;
    setTimeout(flashDisplay, timer);
    timer = timer + 500;
    setTimeout(() => {
        changeDisplay('center');
        setTimeout(() => typewriter('Lorem Ipsum, sometimes referred to as \'lipsum\', is the placeholder text used in design when creating content. It helps designers plan out where the content will sit, without needing to wait for the content to be written and approved. It originally comes from a Latin text, but to today\'s reader, it\'s seen as gibberish.', 'display-box-content', 6, endTransition), 500);
    }, timer)
}

// Move to Loop
function two_three() {
    startTransition();
    TH.smoothCameraPosition(camera, {x: 16, y: 20, z: cameraInitZ - 10}, 1000);
    flashDisplay();
    setTimeout(() => changeDisplay('left'), 500);
    // changeDisplay('left');
    setTimeout(() => typewriter('Lorem Ipsum, sometimes referred to as \'lipsum\', is the placeholder text used in design when creating content. It helps designers plan out where the content will sit, without needing to wait for the content to be written and approved. It originally comes from a Latin text, but to today\'s reader, it\'s seen as gibberish.', 'display-box-content', displayTypingSpeed, endTransition), 1000);
}

function three_two() {
    startTransition();
    TH.smoothCameraPosition(camera, {x: 0, y: 0, z: cameraInitZ}, 1000)
    flashDisplay();
    setTimeout(() => changeDisplay('center'), 500);
    setTimeout(() => typewriter('Lorem Ipsum, sometimes referred to as \'lipsum\', is the placeholder text used in design when creating content. It helps designers plan out where the content will sit, without needing to wait for the content to be written and approved. It originally comes from a Latin text, but to today\'s reader, it\'s seen as gibberish.', 'display-box-content', displayTypingSpeed, endTransition), 1000);
}

// Move to Box wireframe
function three_four () {
    startTransition();
    TH.smoothCameraPosition(camera, {x: boxInitX + 10, y: boxInitY, z: cameraInitZ - 10}, 1000)
    flashDisplay();
    setTimeout(() => changeDisplay('right'), 500);
    setTimeout(() => typewriter('Lorem Ipsum, sometimes referred to as \'lipsum\', is the placeholder text used in design when creating content. It helps designers plan out where the content will sit, without needing to wait for the content to be written and approved. It originally comes from a Latin text, but to today\'s reader, it\'s seen as gibberish.', 'display-box-content', displayTypingSpeed, endTransition), 1000);
}

function four_three() {
    startTransition();
    TH.smoothCameraPosition(camera, {x: 16, y: 20, z: cameraInitZ - 10}, 1000);
    flashDisplay();
    setTimeout(() => changeDisplay('left'), 500);
    // changeDisplay('left');
    setTimeout(() => typewriter('Lorem Ipsum, sometimes referred to as \'lipsum\', is the placeholder text used in design when creating content. It helps designers plan out where the content will sit, without needing to wait for the content to be written and approved. It originally comes from a Latin text, but to today\'s reader, it\'s seen as gibberish.', 'display-box-content', displayTypingSpeed, endTransition), 1000);
}

function five_four() {
    console.log('five_four');
}

function startTransition() {
    transitioning = true;
    document.querySelector('.left-arrow').classList.add('disabled');
    document.querySelector('.right-arrow').classList.add('disabled');
}

function endTransition() {
    transitioning = false;
    if(currentStep > 2)
    {
        document.querySelector('.left-arrow').classList.remove('disabled');
    }

    if(currentStep < 4)
    {
        document.querySelector('.right-arrow').classList.remove('disabled');
    }
}