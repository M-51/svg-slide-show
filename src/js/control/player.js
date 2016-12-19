import { playToPause, pauseToPlay, pauseToReload, reloadToPlay } from './buttons';

const slides = [];
const objectList = [];
let currentSlide = 0;
let status = 'not started';

function start() {
    currentSlide = 0;
    slides[currentSlide].play();
}

function reset() {
    for (let i = 0; i < objectList.length; i += 1) {
        objectList[i].reset();
    }
}

function resume() {
    if (currentSlide + 1 >= slides.length) {
        status = 'finished';
        pauseToReload();
    } else {
        currentSlide += 1;
        slides[currentSlide].play();
        playToPause();
    }
}

function controlPlayer() {
    if (slides.length === 0) {
        throw new Error('No slides to animate. Add slides using "addSlides" function.');
    }

    if (status === 'finished') {
        status = 'not started';
        reset();
        reloadToPlay();
    } else if (status === 'playing') {
        status = 'paused';
        pauseToPlay();
    } else if (status === 'paused') {
        status = 'playing';
        resume();
    } else if (status === 'not started') {
        status = 'playing';
        start();
        playToPause();
    }
}

function next() {
    if (currentSlide + 1 >= slides.length) {
        status = 'finished';
        pauseToReload();
    } else if (status !== 'paused') {
        currentSlide += 1;
        slides[currentSlide].play();
    }
}

function addSlides(...slide) {
    for (let i = 0; i < slide.length; i += 1) {
        slides.push(slide[i]);
    }
}
function addObjects(object) {
    if (objectList.indexOf(object) === -1) {
        objectList.push(object);
    }
}

document.documentElement.addEventListener('button-click', controlPlayer, false);

export { addSlides, addObjects, next };

