import { playToPause, pauseToPlay, pauseToReload, reloadToPlay } from './buttons';

/* Player starts, stops, resumes or reloads slide show */

// array of all slides
const slides = [];
// set of all elements used in animations. Needed for restarting, setting elements to starting positions
const objectList = new Set();
let currentSlide = 0;
let status = 'not started';

function start() {
    currentSlide = 0;
    slides[currentSlide].play();
}

function reset() {
    objectList.forEach((el) => { el.reset(); });
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
    slides.push(...slide);
}
function addObjects(object) {
    objectList.add(object);
}

document.documentElement.addEventListener('button-click', controlPlayer, false);

export { addSlides, addObjects, next };

