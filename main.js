import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GridHelper} from "three";
import {typewriter, hideElement, showElement, changeDisplay} from "./helpers";

document.querySelector('.left-arrow').addEventListener('click', event => {
    previousStep();
});
document.querySelector('.right-arrow').addEventListener('click', event => {
    nextStep();
});

// Constants for initial variables
const circleRotateSpeed = .02;
const circleTranslateXSpeed = -.2;
const circleTranslateYSpeed = .1;
const circleInitX = 40;
const circleInitY = 10;
const circleMinX = 30;
const circleMaxY = 15;


// Variable which keeps the default animator from going while a transition is happening
let transitioning = false;

console.log(window.innerWidth, window.innerHeight);

// A little demo
window.setTimeout(loopDemo, 1000);
// The scene is needed to make things
const scene = new THREE.Scene();

// The camera is used to view the objects in the scene. A PerspectiveCamera mimics the view of a human eye
const camera = new THREE.PerspectiveCamera(1, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setZ(30);

// The renderer renders the objects we're gonna view
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg')
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

function addToScene(array)
{
    array.forEach(item => {
        scene.add(item);
    });
}

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
    knot.position.setY(20);
    knot.position.setX(25);

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
    box.position.setY(-20)
    box.position.setX(-25)

    // Add a GridHelper to get an idea where we are in space
    const gridHelper = new GridHelper(200, 50);

    // Let's add some OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)

    // Add everything to the scene
    addToScene([
        circle,
        knot,
        pointLight,
        ambientLight,
        box,
        // gridHelper
    ]);

    Array(200).fill().forEach(addStar);

    // Animate loop
    let left = true;
    function animate() {
        // Don't do the default animation while a transition to another scene is happening
        if(transitioning) return;

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

        box.rotateX(.01);
        box.rotateY(.01);
        box.rotateZ(.01);

        // camera.rotateZ(0.01);

        // controls.update();
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
    console.log('next Step');
    startTransition();
    loadStep(currentStep + 1);
}
function previousStep() {
    if (transitioning) return;
    console.log('previous Step');
    loadStep(currentStep - 1);
}

function loadStep(step) {
    console.log('transitioning...');

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
        default:
            alert('Step not defined!');
            break;
    }

    currentStep = step;
    console.log('done transitioning');
    transitioning = false;
}

function changeFov(fov, times, interval) {
    let counter = 0;

    function doIt() {
        camera.fov = camera.fov + fov;
        camera.updateProjectionMatrix();
    }

    function repeat() {
        if(counter > times) return;

        setTimeout(() => {
            doIt();
            counter++;
            repeat();
        }, interval);
    }

    repeat();
}

function one_two() {
    startTransition();
    changeFov(0.1, 1000, 10);

    let timer = 0;
    const headerSpeed = 100;

    typewriter('Welcome', 'header', headerSpeed);
    timer = timer + 2000;
    setTimeout(() => typewriter('Three.js demo', 'header', headerSpeed), timer);
    timer = timer + 3000;
    setTimeout(() => typewriter('Sit back and enjoy', 'header', headerSpeed), timer);
    timer = timer + 5000;
    setTimeout(() => hideElement('header'), timer);
    timer = timer + 500;
    setTimeout(() => {
        const flashSpeed = 80;
        showElement('display-box');
        setTimeout(() => hideElement('display-box'), flashSpeed);
        setTimeout(() => showElement('display-box'), flashSpeed * 2);
        setTimeout(() => hideElement('display-box'), flashSpeed * 3);
        setTimeout(() => showElement('display-box'), flashSpeed * 4);
    }, timer);
    timer = timer + 500;
    setTimeout(() => {
        changeDisplay('center');
        setTimeout(() => typewriter('Lorem Ipsum, sometimes referred to as \'lipsum\', is the placeholder text used in design when creating content. It helps designers plan out where the content will sit, without needing to wait for the content to be written and approved. It originally comes from a Latin text, but to today\'s reader, it\'s seen as gibberish.', 'display-box', 6), 500);
    }, timer)
    timer = timer + 3000;
    setTimeout(() => endTransition(), timer);
}

function two_three() {
    startTransition();
    // camera.rotateY(10);
    // camera.rotateX(10);
    camera.translateY(20);
    camera.translateX(16);
    changeFov(-0.1, 100, 10);
    camera.updateProjectionMatrix();
    typewriter('', 'display-box');
    changeDisplay('left');
    setTimeout(() => typewriter('Lorem Ipsum, sometimes referred to as \'lipsum\', is the placeholder text used in design when creating content. It helps designers plan out where the content will sit, without needing to wait for the content to be written and approved. It originally comes from a Latin text, but to today\'s reader, it\'s seen as gibberish.', 'display-box', 6), 1000);
    endTransition();
}

function three_two() {
    startTransition();
    camera.translateY(-20);
    camera.translateX(-16);
    changeFov(0.1, 100, 10);
    camera.updateProjectionMatrix();
    typewriter('', 'display-box');
    changeDisplay('center');
    setTimeout(() => typewriter('Lorem Ipsum, sometimes referred to as \'lipsum\', is the placeholder text used in design when creating content. It helps designers plan out where the content will sit, without needing to wait for the content to be written and approved. It originally comes from a Latin text, but to today\'s reader, it\'s seen as gibberish.', 'display-box', 6), 1000);
    setTimeout(() => endTransition(), 1500);
}

function four_three() {
    console.log('four_three');
}

function startTransition() {
    transitioning = true;
    document.querySelector('.left-arrow').classList.add('disabled');
    document.querySelector('.right-arrow').classList.add('disabled');
}

function endTransition() {
    transitioning = false;
    document.querySelector('.left-arrow').classList.remove('disabled');
    document.querySelector('.right-arrow').classList.remove('disabled');
}