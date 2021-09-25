import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import {GUI} from "three/examples/jsm/libs/dat.gui.module";

const makeGui = () => {
    let gui = new GUI({ autoPlace: false });
    let customContainer = document.querySelector('#gui');
    // customContainer.appendChild(gui.domElement);
    return gui;
}

const addToScene = (scene, items, gui, notGuiItems = []) => {
    let counter = 1;
    items.forEach(item => {
        scene.add(item);

        if(!gui) return;

        const type = item.geometry ? item.geometry.type : item.type;
        const name = type + counter;

        const folder = gui.addFolder(name);
        folder.add(item.position, 'x');
        folder.add(item.position, 'y');
        folder.add(item.position, 'z');
        folder.add(item.rotation, 'x');
        folder.add(item.rotation, 'y');
        folder.add(item.rotation, 'z');
        counter++;
    });

    notGuiItems.forEach(item => {
        scene.add(item);
    });

}

const smoothChangeFov = (camera, fov, duration, easingFunction = TWEEN.Easing.Linear.None) => {
    new TWEEN.Tween(camera)
        .to({fov: fov}, duration)
        .easing(easingFunction)
        .start();
}

const smoothCameraPosition = (camera, position, duration, easingFunction = TWEEN.Easing.Linear.None) => {
    new TWEEN.Tween(camera.position)
        .to(position, duration)
        .easing(easingFunction)
        .start();
}

const smoothCameraRotation = (camera, rotation, duration, easingFunction = TWEEN.Easing.Linear.None) => {
    new TWEEN.Tween(camera.rotation)
        .to(rotation, duration)
        .easing(easingFunction)
        .start();
}

const smoothCameraLookAt = (camera, lookAt, duration) => {
    new TWEEN.Tween({})
        .to({}, duration)
        .onUpdate(() => {camera.lookAt(lookAt)})
        .start();
}

export {makeGui, addToScene, smoothChangeFov, smoothCameraPosition, smoothCameraRotation, smoothCameraLookAt};