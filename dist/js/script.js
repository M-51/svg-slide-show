const settings = {
    svg: document.getElementsByTagName('svg')[0],   // svg element
    speed: 0.025,                                   // base animation speed
    easing: t => t * t * (3 - (2 * t)),             // easing function
};

/* Animate predefined functions, then update variables */

function animateObject(arr, ease) {
    for (let i = 0; i < arr.length; i += 1) {
        arr[i][0](ease);
    }
}
function updateObject(arr) {
    for (let i = 0; i < arr.length; i += 1) {
        arr[i][1]();
    }
}

// main animation function
function animate(s, d, arr) {
    return new Promise((resolve) => {
        let t = 0;
        let ease;
        const speed = settings.speed * s > 0 ? settings.speed * s : 0.025;
        if (s === 0) { t = 1; }

        function step() {
            if (t < 1) {
                t += speed;
                ease = settings.easing(t);
                for (let i = 0; i < arr.length; i += 1) {
                    animateObject(arr[i], ease);
                }
                window.requestAnimationFrame(step);
            } else {
                for (let i = 0; i < arr.length; i += 1) {
                    updateObject(arr[i]);
                }
                resolve();
            }
        }
        window.setTimeout(step, d);
    });
}

/*
---------------------------CREATE-ELEMENTS-OF-INTERFACE--------------------------
---------------------------------------------------------------------------------
*/

// declare variables

const icons = {
    group: null,
    polygon1: null,
    polygon2: null,
    arc1: null,
    arc2: null,
    rect: null,
};

// create icons

const xmlns = 'http://www.w3.org/2000/svg';
icons.group = document.createElementNS(xmlns, 'g');

icons.arc1 = document.createElementNS(xmlns, 'path');
icons.arc1.setAttributeNS(null, 'd', 'M10,20 A10,10 0 0,1 20,10');
icons.group.appendChild(icons.arc1);

icons.arc2 = document.createElementNS(xmlns, 'path');
icons.arc2.setAttributeNS(null, 'd', 'M30,20 A10,10 0 0,1 20,30');
icons.group.appendChild(icons.arc2);

icons.polygon1 = document.createElementNS(xmlns, 'polygon');
icons.polygon1.setAttributeNS(null, 'points', '10,10 10,30 20,25 20,15');
icons.group.appendChild(icons.polygon1);

icons.polygon2 = document.createElementNS(xmlns, 'polygon');
icons.polygon2.setAttributeNS(null, 'points', '20,25 20,15 30,20 30,20');
icons.group.appendChild(icons.polygon2);

icons.rect = document.createElementNS(xmlns, 'rect');
icons.rect.setAttributeNS(null, 'x', 0);
icons.rect.setAttributeNS(null, 'y', 0);
icons.rect.setAttributeNS(null, 'width', 40);
icons.rect.setAttributeNS(null, 'height', 40);
icons.group.appendChild(icons.rect);

// add style to interface

const css = document.createElementNS('http://www.w3.org/2000/svg', 'style');
css.textContent = '#control > rect {opacity: 0; cursor: pointer;} #control > path {stroke:#000; fill:none; stroke-width: 2px; stroke-dasharray: 16px; stroke-dashoffset: 16px}';


let defs = settings.svg.getElementsByTagName('defs')[0];
// check if defs element is already declared. If not, add it to DOM
if (!defs) {
    defs = document.createElement('defs');
    settings.svg.insertBefore(defs, settings.svg.firstChild);
}
defs.appendChild(css);

// set interface to correct position
const viewBox = settings.svg.viewBox.baseVal;
const matrix = settings.svg.createSVGMatrix();
matrix.e = viewBox.x + 10;
matrix.f = viewBox.y + (viewBox.height - 50);
icons.group.id = 'control';
icons.group.transform.baseVal.initialize(settings.svg.createSVGTransformFromMatrix(matrix));


// add interface to DOM

settings.svg.appendChild(icons.group);


// add event listeners to elements of interface, and set event propagation

const event = document.createEvent('Event');
event.initEvent('button-click', true, true);
icons.rect.addEventListener('click', () => { settings.svg.dispatchEvent(event); });


/*
-------------------------------INTERFACE-ANIMATIONS------------------------------
---------------------------------------------------------------------------------
*/

// animation - play -> pause

function animatePlayToPause() {
    let steps = 1;

    function animate() {
        if (steps <= 10) {
            icons.polygon1.setAttribute('points', `
            10,10 
            10,30 
            ${20 - (steps / 5) > 18 ? 20 - (steps / 5) : 18},${25 + (steps / 2) < 30 ? 25 + (steps / 2) : 30} 
            ${20 - (steps / 5) > 18 ? 20 - (steps / 5) : 18},${15 - (steps / 2) > 10 ? 15 - (steps / 2) : 10}
            `);
            icons.polygon2.setAttribute('points', `
            ${20 + (steps / 5) < 22 ? 20 + (steps / 5) : 22},${15 - (steps / 2) > 10 ? 15 - (steps / 2) : 10} 
            ${20 + (steps / 5) < 22 ? 20 + (steps / 5) : 22}, ${25 + (steps / 2) < 30 ? 25 + (steps / 2) : 30} 
            30,${20 + steps < 30 ? 20 + steps : 30} 
            30,${20 - steps > 10 ? 20 - steps : 10}
            `);
            steps += 1;
            window.requestAnimationFrame(animate);
        }
    }
    animate();
}

// animation - pause -> play

function animatePauseToPlay() {
    let steps = 1;

    function animate() {
        if (steps <= 10) {
            icons.polygon1.setAttribute('points', `
                10,10 
                10,30 
                ${18 + (steps / 5) < 20 ? 18 + (steps / 5) : 20},${30 - (steps / 2) > 25 ? 30 - (steps / 2) : 25} 
                ${18 + (steps / 5) < 20 ? 18 + (steps / 5) : 20},${10 + (steps / 2) < 15 ? 10 + (steps / 2) : 15}
            `);
            icons.polygon2.setAttribute('points', `
                ${22 - (steps / 5) > 20 ? 22 - (steps / 5) : 20},${10 + (steps / 2) < 15 ? 10 + (steps / 2) : 15} 
                ${22 - (steps / 5) > 20 ? 22 - (steps / 5) : 20},${30 - (steps / 2) > 25 ? 30 - (steps / 2) : 25} 
                30,${30 - (steps > 20) ? 30 - steps : 20} 
                30,${10 + (steps < 20) ? 10 + steps : 20}
            `);
            steps += 1;
            window.requestAnimationFrame(animate);
        }
    }
    animate();
}

// animation - pause -> reload

function animatePauseToReload() {
    let steps = 1;
    let offset = 16;

    function animateArc() {
        if (offset > 0) {
            offset -= 1;
            icons.arc1.setAttribute('style', `stroke-dashoffset:${offset}px`);
            icons.arc2.setAttribute('style', `stroke-dashoffset:${offset}px`);
            window.requestAnimationFrame(animateArc);
        } else {
            icons.arc1.setAttribute('style', 'stroke-dashoffset:0');
            icons.arc2.setAttribute('style', 'stroke-dashoffset:0');
        }
    }

    function animate() {
        if (steps <= 10) {
            icons.polygon1.setAttribute('points', `
                ${10 - (steps * 0.4) > 6 ? 10 - (steps * 0.4) : 6},${10 + steps < 20 ? 10 + steps : 20} 
                10,${30 - (steps * 0.4) > 26 ? 30 - (steps * 0.4) : 26} 
                ${18 - (steps * 0.8) > 10 ? 18 - (steps * 0.8) : 10},${30 - (steps * 0.4) > 26 ? 30 - (steps * 0.4) : 26} 
                ${18 - (steps * 0.4) > 14 ? 18 - (steps * 0.4) : 14},${10 + steps < 20 ? 10 + steps : 20}
            `);
            icons.polygon2.setAttribute('points', `
                ${22 + (steps * 0.8) < 30 ? 22 + (steps * 0.8) : 30},${10 + (steps * 0.4) < 14 ? 10 + (steps * 0.4) : 14} 
                ${22 + (steps * 0.4) < 26 ? 22 + (steps * 0.4) : 26},${30 - steps > 20 ? 30 - steps : 20} 
                 ${30 + (steps * 0.4) < 34 ? 30 + (steps * 0.4) : 34},${30 - steps > 20 ? 30 - steps : 20} 
                30,${10 + (steps * 0.4) < 14 ? 10 + (steps * 0.4) : 14}
            `);
            steps += 1;
            window.requestAnimationFrame(animate);
        } else {
            animateArc();
        }
    }
    animate();
}

// animation - reload -> play

function animateReloadToPlay() {
    let steps = 1;
    let offset = 0;

    function animate() {
        if (steps <= 10) {
            icons.polygon1.setAttribute('points', `
                ${6 + (steps * 0.4) < 10 ? 6 + (steps * 0.4) : 10},${20 - steps > 10 ? 20 - steps : 10} 
                10,${26 + (steps * 0.4) < 30 ? 26 + (steps * 0.4) : 30} 
                ${10 + steps < 20 ? 10 + steps : 20},${26 - (steps * 0.1) > 25 ? 26 - (steps * 0.1) : 25} 
                ${14 + (steps * 0.6) < 20 ? 14 + (steps * 0.6) : 20},${20 - (steps * 0.5) > 15 ? 20 - (steps * 0.5) : 15}
            `);
            icons.polygon2.setAttribute('points', `
                ${30 - steps > 20 ? 30 - steps : 20},${14 + (steps * 0.1) < 15 ? 14 + (steps * 0.1) : 15} 
                ${26 - (steps * 0.6) > 20 ? 26 - (steps * 0.6) : 20},${20 + (steps * 0.5) < 25 ? 20 + (steps * 0.5) : 25} 
                ${34 - (steps * 0.4) > 30 ? 34 - (steps * 0.4) : 30},20 
                30,${14 + (steps * 0.6) < 20 ? 14 + (steps * 0.6) : 20}
            `);
            steps += 1;
            window.requestAnimationFrame(animate);
        }
    }

    function animateArc() {
        if (offset < 16) {
            offset += 1;
            icons.arc1.setAttribute('style', `stroke-dashoffset:${offset}px`);
            icons.arc2.setAttribute('style', `stroke-dashoffset:${offset}`);
            window.requestAnimationFrame(animateArc);
        } else {
            icons.arc1.removeAttribute('style');
            icons.arc2.removeAttribute('style');
            animate();
        }
    }
    animateArc();
}

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
        animatePauseToReload();
    } else {
        currentSlide += 1;
        slides[currentSlide].play();
        animatePlayToPause();
    }
}

function controlPlayer() {
    if (slides.length === 0) {
        throw new Error('No slides to animate. Add slides using "addSlides" function.');
    }

    if (status === 'finished') {
        status = 'not started';
        reset();
        animateReloadToPlay();
    } else if (status === 'playing') {
        status = 'paused';
        animatePauseToPlay();
    } else if (status === 'paused') {
        status = 'playing';
        resume();
    } else if (status === 'not started') {
        status = 'playing';
        start();
        animatePlayToPause();
    }
}

function next(delay) {
    if (currentSlide + 1 >= slides.length) {
        status = 'finished';
        animatePauseToReload();
    } else if (status !== 'paused') {
        currentSlide += 1;
        window.setTimeout(() => { slides[currentSlide].play(); }, delay);
    }
}

function addSlides(...slide) {
    slides.push(...slide);
}
function addObjects(object) {
    objectList.add(object);
}

document.documentElement.addEventListener('button-click', controlPlayer, false);

const utils = {
    undef: item => (typeof item === 'undefined'),   // check if argument is undefined
};

/* Define most efficient function used to animate transform property, then add it to array of functions for animation */

function calculateTransform(el) {
    const targetTransform = el.transform;

    // check if transform animation is requested
    if (!utils.undef(targetTransform)) {
        let animateFunc;
        let updateFunc;
        const object = el.object;
        const startingTransform = el.object.tr;

        const deltaScale = targetTransform.scale - startingTransform.scale;
        const deltaRotate = targetTransform.rotate - startingTransform.rotate;
        let delta0;
        let delta1;
        if (!utils.undef(targetTransform.translate)) {
            delta0 = (targetTransform.translate[0]) - startingTransform.translate[0];
            delta1 = (targetTransform.translate[1]) - startingTransform.translate[1];
        }

        /* -------- transforms without translation -------- */
        if (utils.undef(targetTransform.translate)) {
            if (utils.undef(targetTransform.rotate)) {
                // only scaling
                animateFunc = (t) => {
                    object.scale(startingTransform.scale + (deltaScale * t));
                };
                updateFunc = () => {
                    object.scale(targetTransform.scale);
                    startingTransform.scale = targetTransform.scale;
                };
            } else if (utils.undef(targetTransform.scale)) {
                // only rotation
                animateFunc = (t) => {
                    object.rotate(
                        startingTransform.rotate + (deltaRotate * t));
                };
                updateFunc = () => {
                    object.rotate(targetTransform.rotate);
                    startingTransform.rotate = targetTransform.rotate;
                };
            } else {
                // scaling and rotating
                animateFunc = (t) => {
                    object.scaleAndRotate(
                        startingTransform.scale + (deltaScale * t),
                        startingTransform.rotate + (deltaRotate * t));
                };
                updateFunc = () => {
                    object.scaleAndRotate(targetTransform.scale, targetTransform.rotate);
                    startingTransform.scale = targetTransform.scale;
                    startingTransform.rotate = targetTransform.rotate;
                };
            }
        /* -------- transforms with translation -------- */
        } else if (utils.undef(targetTransform.scale) && utils.undef(targetTransform.rotate)) {
            // only translation
            animateFunc = (t) => {
                object.translate(
                    startingTransform.translate[0] + (delta0 * t),
                    startingTransform.translate[1] + (delta1 * t));
            };
            updateFunc = () => {
                object.translate(
                    targetTransform.translate[0],
                    targetTransform.translate[1]);
                startingTransform.translate = targetTransform.translate;
            };
        } else if (utils.undef(targetTransform.rotate)) {
            // scale and translation
            animateFunc = (t) => {
                object.scaleAndTranslate(
                    startingTransform.scale + (deltaScale * t),
                    startingTransform.translate[0] + (delta0 * t),
                    startingTransform.translate[1] + (delta1 * t));
            };
            updateFunc = () => {
                object.scaleAndTranslate(
                    targetTransform.scale,
                    targetTransform.translate[0],
                    targetTransform.translate[1]);
                startingTransform.scale = targetTransform.scale;
                startingTransform.translate = targetTransform.translate;
            };
        } else if (typeof targetTransform.scale === 'undefined') {
            // rotation and translation
            animateFunc = (t) => {
                object.rotateAndTranslate(
                    startingTransform.rotate + (deltaRotate * t),
                    startingTransform.translate[0] + (delta0 * t),
                    startingTransform.translate[1] + (delta1 * t));
            };
            updateFunc = () => {
                object.rotateAndTranslate(
                    targetTransform.rotate,
                    targetTransform.translate[0],
                    targetTransform.translate[1]);
                startingTransform.rotate = targetTransform.rotate;
                startingTransform.translate = targetTransform.translate;
            };
        } else {
            // scale, rotation and translation
            animateFunc = (t) => {
                object.scaleAndRotateAndTranslate(
                    startingTransform.scale + (deltaScale * t),
                    startingTransform.rotate + (deltaRotate * t),
                    startingTransform.translate[0] + (delta0 * t),
                    startingTransform.translate[1] + (delta1 * t));
            };
            updateFunc = () => {
                object.scaleAndRotateAndTranslate(
                    targetTransform.scale,
                    targetTransform.rotate,
                    targetTransform.translate[0],
                    targetTransform.translate[1]);
                startingTransform.scale = targetTransform.scale;
                startingTransform.rotate = targetTransform.rotate;
                startingTransform.translate = targetTransform.translate;
            };
        }

        return [animateFunc, updateFunc];
    }
    return false;
}

/* Define function used to animate attributes, then add it to array of functions for animation */

function calculateAttributes(el) {
    const table = [];

    function animateFunc(t) {
        for (let i = 0; i < table.length; i += 1) {
            el.object.obj.setAttribute(table[i][0], table[i][1] + ((table[i][2] - table[i][1]) * t));
        }
    }

    function updateFunc() {
        for (let i = 0; i < table.length; i += 1) {
            el.object.obj.setAttribute(table[i][0], table[i][2]);
            el.object.variables.set(table[i][0], table[i][2]);
        }
    }
    // check if attributes animation is requested
    if (!utils.undef(el.attributes) && el.attributes.length !== 0) {
        const attributes = Array.isArray(el.attributes) ? el.attributes : [el.attributes];
        // for every attribute
        for (let i = 0; i < attributes.length; i += 1) {
            // property name
            const name = attributes[i].name;

            // starting value
            const from = utils.undef(attributes[i].from) ? el.object.variables.get(name) : attributes[i].from;

            // throw error if starting value is not defined. Neither in request nor in DOM element
            if (utils.undef(from)) { throw new Error(`No "from" value, for ${name}`); }

            // target value
            const to = attributes[i].to;

            table.push([name, from, to]);
        }
        return [animateFunc, updateFunc];
    }
    return false;
}

function calculateRemove(el) {
    const remove = el.remove;

    if (!utils.undef(remove)) {
        if (remove.when === 'end') {
            const removeFunc = () => false;
            const updateFunc = () => {
                el.object.obj.removeAttribute(remove.name);
                el.object.variables.delete(remove.name);
            };
            return [removeFunc, updateFunc];
        }
        el.object.obj.removeAttribute(remove.name);
        el.object.variables.delete(name);
    }
    return false;
}

/* Specify functions used to animations, and send them to animate function */

function calculate(el) {
    return new Promise((resolve) => {
        // declare array of animation functions
        const arr = [];
        const objects = Array.isArray(el.objects) ? el.objects : [el.objects];
        // Set function for every object
        for (let i = 0; i < objects.length; i += 1) {
            const requestObject = objects[i];

            // define transform animation function, if transform animation is requested
            const calculatedTransform = calculateTransform(requestObject);
            if (calculatedTransform) { arr.push([calculatedTransform]); }

            // define attribute animation function, if attribute animation is requested
            const calculatedAttributes = calculateAttributes(requestObject);
            if (calculatedAttributes) { arr.push([calculatedAttributes]); }

            const calculatedRemove = calculateRemove(requestObject);
            if (calculatedRemove) { arr.push([calculatedRemove]); }

            // add objects to objects set in player.js. Needed for reseting
            addObjects(objects[i].object);
        }
        // send array of functions to animate function
        animate(
            utils.undef(el.speed) ? 1 : el.speed,
            el.delay || 0,
            arr)
        .then(() => { resolve(); });
    });
}

/* Split request to threads, and dispatch to "calculate" function */

function dispatch(...threads) {
    const promise = new Promise((resolve, reject) => {
        if (threads.length === 0) {
            // throw error, if request is empty
            reject(Error('Add objects to "step" function'));
        } else {
            const arr = [];
            // send all threads to calculation
            for (let i = 0; i < threads.length; i += 1) {
                arr.push(calculate(threads[i]));
            }
            // after animation completed, resolve promise to launch next sequence
            Promise.all(arr).then(() => { resolve(); });
        }
    });
    return promise;
}

// rename element for easier access
const step = dispatch;

class Obj {
/*
-----------------------------------CONSTRUCTOR-----------------------------------
---------------------------------------------------------------------------------
*/
    constructor(obj, transform = { translate: [0, 0], rotate: 0, scale: 1 }) {
        // access to DOM object
        this.obj = obj;
        // create zero matrix
        this.manipulationMatrix = settings.svg.createSVGMatrix();
        // set starting variables, and declare this.startingVariables and this.variables
        this.setStartingVariables(transform);
        // set initial matrix
        this.setInitialMatrix();

        /* -------- shortcuts -------- */

        // to matrix interface -> this.SVGTransform

        // to current transform
        this.tr = this.variables.get('transform');
    }

/*
-------------------------------INITIALIZING METHODS------------------------------
---------------------------------------------------------------------------------
*/


    setStartingVariables(transform) {
        const map = new Map();
        for (let i = 0; i < this.obj.attributes.length; i += 1) {
            if (this.obj.attributes[i].specified && this.obj.attributes[i].name !== 'transform') {
                map.set(this.obj.attributes[i].name, parseFloat(this.obj.attributes[i].value) || this.obj.attributes[i].value);
            }
        }
        this.startingVariables = new Map(map);
        this.variables = new Map(map);

        // reference shit
        for (let i = 0; i < 2; i += 1) {
            [this.startingVariables, this.variables][i].set('transform', {
                translate: utils.undef(transform.translate) ? [0, 0] : transform.translate,
                scale: utils.undef(transform.scale) ? 1 : transform.scale,
                rotate: utils.undef(transform.rotate) ? 0 : transform.rotate,
            });
        }
    }

    setInitialMatrix() {
        const transform = this.variables.get('transform');
        this.obj.transform.baseVal.initialize(settings.svg.createSVGTransformFromMatrix(this.manipulationMatrix));
        this.SVGTransform = this.obj.transform.baseVal.getItem(0);
        this.scaleAndRotateAndTranslate(transform.scale, transform.rotate, transform.translate[0], transform.translate[1]);
    }

/*
----------------------------------OTHER-METHODS----------------------------------
---------------------------------------------------------------------------------
*/

    setMatrix(matrix) { this.SVGTransform.setMatrix(matrix); }

    reset() {
        // reset variables
        this.variables = new Map(this.startingVariables);
        // reference shit
        const transform = this.startingVariables.get('transform');
        this.variables.set('transform', {
            translate: transform.translate,
            scale: transform.scale,
            rotate: transform.rotate,
        });
        this.tr = this.variables.get('transform');

        const obj = this.obj;

        // remove all attributes from element DOM
        for (let i = obj.attributes.length - 1; i >= 0; i -= 1) {
            if (obj.attributes[i].name !== 'transform') {
                obj.removeAttribute(obj.attributes[i].name);
            }
        }
        // add all starting attributes
        function add(value, key) {
            if (key !== 'transform') {
                obj.setAttribute(key, value);
            }
        }
        this.variables.forEach(add);


        // set starting transform
        this.setInitialMatrix();
    }

/*
---------------------------------ANIMATING-METHODS-------------------------------
---------------------------------------------------------------------------------
*/
    translate(x, y) {
        this.manipulationMatrix.e = x;
        this.manipulationMatrix.f = y;

        this.setMatrix(this.manipulationMatrix);
    }
    rotate(angle) {
        const radians = (-angle * Math.PI) / 180;
        const c = Math.sin(radians) * this.tr.scale;
        const a = Math.cos(radians) * this.tr.scale;

        this.manipulationMatrix.a = a;
        this.manipulationMatrix.b = -c;
        this.manipulationMatrix.c = c;
        this.manipulationMatrix.d = a;

        this.setMatrix(this.manipulationMatrix);
    }
    scale(s) {
        const radians = (-this.tr.rotate * Math.PI) / 180;
        const c = Math.sin(radians) * s;
        const a = Math.cos(radians) * s;

        this.manipulationMatrix.a = a;
        this.manipulationMatrix.b = -c;
        this.manipulationMatrix.c = c;
        this.manipulationMatrix.d = a;

        this.setMatrix(this.manipulationMatrix);
    }
    scaleAndRotate(s, angle) {
        const radians = (-angle * Math.PI) / 180;
        const c = Math.sin(radians) * s;
        const a = Math.cos(radians) * s;

        this.manipulationMatrix.a = a;
        this.manipulationMatrix.b = -c;
        this.manipulationMatrix.c = c;
        this.manipulationMatrix.d = a;

        this.setMatrix(this.manipulationMatrix);
    }
    scaleAndTranslate(s, x, y) {
        const radians = (-this.tr.rotate * Math.PI) / 180;
        const c = Math.sin(radians) * s;
        const a = Math.cos(radians) * s;

        this.manipulationMatrix.a = a;
        this.manipulationMatrix.b = -c;
        this.manipulationMatrix.c = c;
        this.manipulationMatrix.d = a;
        this.manipulationMatrix.e = x;
        this.manipulationMatrix.f = y;

        this.setMatrix(this.manipulationMatrix);
    }
    rotateAndTranslate(angle, x, y) {
        const radians = (-angle * Math.PI) / 180;
        const c = Math.sin(radians) * this.tr.scale;
        const a = Math.cos(radians) * this.tr.scale;

        this.manipulationMatrix.a = a;
        this.manipulationMatrix.b = -c;
        this.manipulationMatrix.c = c;
        this.manipulationMatrix.d = a;
        this.manipulationMatrix.e = x;
        this.manipulationMatrix.f = y;

        this.setMatrix(this.manipulationMatrix);
    }
    scaleAndRotateAndTranslate(s, angle, x, y) {
        const r = (-angle * Math.PI) / 180;
        const c = Math.sin(r) * s;
        const a = Math.cos(r) * s;

        this.manipulationMatrix.a = a;
        this.manipulationMatrix.b = -c;
        this.manipulationMatrix.c = c;
        this.manipulationMatrix.d = a;
        this.manipulationMatrix.e = x;
        this.manipulationMatrix.f = y;

        this.setMatrix(this.manipulationMatrix);
    }
}

class Slide {}

// rollup shit
(() => [step, Obj, Slide, addSlides, next])();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIkQ6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvc2V0dGluZ3MuanMiLCJEOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2VuZ2luZS9hbmltYXRlLmpzIiwiRDovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy9jb250cm9sL2J1dHRvbnMuanMiLCJEOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2NvbnRyb2wvcGxheWVyLmpzIiwiRDovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy91dGlscy5qcyIsIkQ6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvZW5naW5lL2NhbGN1bGF0aW9ucy90cmFuc2Zvcm0uanMiLCJEOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2VuZ2luZS9jYWxjdWxhdGlvbnMvYXR0cmlidXRlLmpzIiwiRDovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy9lbmdpbmUvY2FsY3VsYXRpb25zL3JlbW92ZS5qcyIsIkQ6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvZW5naW5lL2NhbGN1bGF0ZS5qcyIsIkQ6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvZW5naW5lL2Rpc3BhdGNoLmpzIiwiRDovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy9jbGFzc2VzL21haW4uanMiLCJEOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2NsYXNzZXMvc2xpZGUuanMiLCJEOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHNldHRpbmdzID0ge1xyXG4gICAgc3ZnOiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc3ZnJylbMF0sICAgLy8gc3ZnIGVsZW1lbnRcclxuICAgIHNwZWVkOiAwLjAyNSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJhc2UgYW5pbWF0aW9uIHNwZWVkXHJcbiAgICBlYXNpbmc6IHQgPT4gdCAqIHQgKiAoMyAtICgyICogdCkpLCAgICAgICAgICAgICAvLyBlYXNpbmcgZnVuY3Rpb25cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHNldHRpbmdzO1xyXG4iLCJpbXBvcnQgc2V0dGluZ3MgZnJvbSAnLi4vc2V0dGluZ3MnO1xyXG5cclxuLyogQW5pbWF0ZSBwcmVkZWZpbmVkIGZ1bmN0aW9ucywgdGhlbiB1cGRhdGUgdmFyaWFibGVzICovXHJcblxyXG5mdW5jdGlvbiBhbmltYXRlT2JqZWN0KGFyciwgZWFzZSkge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICBhcnJbaV1bMF0oZWFzZSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdXBkYXRlT2JqZWN0KGFycikge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICBhcnJbaV1bMV0oKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gbWFpbiBhbmltYXRpb24gZnVuY3Rpb25cclxuZnVuY3Rpb24gYW5pbWF0ZShzLCBkLCBhcnIpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgIGxldCB0ID0gMDtcclxuICAgICAgICBsZXQgZWFzZTtcclxuICAgICAgICBjb25zdCBzcGVlZCA9IHNldHRpbmdzLnNwZWVkICogcyA+IDAgPyBzZXR0aW5ncy5zcGVlZCAqIHMgOiAwLjAyNTtcclxuICAgICAgICBpZiAocyA9PT0gMCkgeyB0ID0gMTsgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKCkge1xyXG4gICAgICAgICAgICBpZiAodCA8IDEpIHtcclxuICAgICAgICAgICAgICAgIHQgKz0gc3BlZWQ7XHJcbiAgICAgICAgICAgICAgICBlYXNlID0gc2V0dGluZ3MuZWFzaW5nKHQpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRlT2JqZWN0KGFycltpXSwgZWFzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVPYmplY3QoYXJyW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChzdGVwLCBkKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhbmltYXRlO1xyXG4iLCJpbXBvcnQgc2V0dGluZ3MgZnJvbSAnLi4vc2V0dGluZ3MnO1xyXG5cclxuLypcclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tQ1JFQVRFLUVMRU1FTlRTLU9GLUlOVEVSRkFDRS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4qL1xyXG5cclxuLy8gZGVjbGFyZSB2YXJpYWJsZXNcclxuXHJcbmNvbnN0IGljb25zID0ge1xyXG4gICAgZ3JvdXA6IG51bGwsXHJcbiAgICBwb2x5Z29uMTogbnVsbCxcclxuICAgIHBvbHlnb24yOiBudWxsLFxyXG4gICAgYXJjMTogbnVsbCxcclxuICAgIGFyYzI6IG51bGwsXHJcbiAgICByZWN0OiBudWxsLFxyXG59O1xyXG5cclxuLy8gY3JlYXRlIGljb25zXHJcblxyXG5jb25zdCB4bWxucyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XHJcbmljb25zLmdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHhtbG5zLCAnZycpO1xyXG5cclxuaWNvbnMuYXJjMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh4bWxucywgJ3BhdGgnKTtcclxuaWNvbnMuYXJjMS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsICdNMTAsMjAgQTEwLDEwIDAgMCwxIDIwLDEwJyk7XHJcbmljb25zLmdyb3VwLmFwcGVuZENoaWxkKGljb25zLmFyYzEpO1xyXG5cclxuaWNvbnMuYXJjMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh4bWxucywgJ3BhdGgnKTtcclxuaWNvbnMuYXJjMi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsICdNMzAsMjAgQTEwLDEwIDAgMCwxIDIwLDMwJyk7XHJcbmljb25zLmdyb3VwLmFwcGVuZENoaWxkKGljb25zLmFyYzIpO1xyXG5cclxuaWNvbnMucG9seWdvbjEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoeG1sbnMsICdwb2x5Z29uJyk7XHJcbmljb25zLnBvbHlnb24xLnNldEF0dHJpYnV0ZU5TKG51bGwsICdwb2ludHMnLCAnMTAsMTAgMTAsMzAgMjAsMjUgMjAsMTUnKTtcclxuaWNvbnMuZ3JvdXAuYXBwZW5kQ2hpbGQoaWNvbnMucG9seWdvbjEpO1xyXG5cclxuaWNvbnMucG9seWdvbjIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoeG1sbnMsICdwb2x5Z29uJyk7XHJcbmljb25zLnBvbHlnb24yLnNldEF0dHJpYnV0ZU5TKG51bGwsICdwb2ludHMnLCAnMjAsMjUgMjAsMTUgMzAsMjAgMzAsMjAnKTtcclxuaWNvbnMuZ3JvdXAuYXBwZW5kQ2hpbGQoaWNvbnMucG9seWdvbjIpO1xyXG5cclxuaWNvbnMucmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh4bWxucywgJ3JlY3QnKTtcclxuaWNvbnMucmVjdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIDApO1xyXG5pY29ucy5yZWN0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgMCk7XHJcbmljb25zLnJlY3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgNDApO1xyXG5pY29ucy5yZWN0LnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCA0MCk7XHJcbmljb25zLmdyb3VwLmFwcGVuZENoaWxkKGljb25zLnJlY3QpO1xyXG5cclxuLy8gYWRkIHN0eWxlIHRvIGludGVyZmFjZVxyXG5cclxuY29uc3QgY3NzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdHlsZScpO1xyXG5jc3MudGV4dENvbnRlbnQgPSAnI2NvbnRyb2wgPiByZWN0IHtvcGFjaXR5OiAwOyBjdXJzb3I6IHBvaW50ZXI7fSAjY29udHJvbCA+IHBhdGgge3N0cm9rZTojMDAwOyBmaWxsOm5vbmU7IHN0cm9rZS13aWR0aDogMnB4OyBzdHJva2UtZGFzaGFycmF5OiAxNnB4OyBzdHJva2UtZGFzaG9mZnNldDogMTZweH0nO1xyXG5cclxuXHJcbmxldCBkZWZzID0gc2V0dGluZ3Muc3ZnLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkZWZzJylbMF07XHJcbi8vIGNoZWNrIGlmIGRlZnMgZWxlbWVudCBpcyBhbHJlYWR5IGRlY2xhcmVkLiBJZiBub3QsIGFkZCBpdCB0byBET01cclxuaWYgKCFkZWZzKSB7XHJcbiAgICBkZWZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGVmcycpO1xyXG4gICAgc2V0dGluZ3Muc3ZnLmluc2VydEJlZm9yZShkZWZzLCBzZXR0aW5ncy5zdmcuZmlyc3RDaGlsZCk7XHJcbn1cclxuZGVmcy5hcHBlbmRDaGlsZChjc3MpO1xyXG5cclxuLy8gc2V0IGludGVyZmFjZSB0byBjb3JyZWN0IHBvc2l0aW9uXHJcbmNvbnN0IHZpZXdCb3ggPSBzZXR0aW5ncy5zdmcudmlld0JveC5iYXNlVmFsO1xyXG5jb25zdCBtYXRyaXggPSBzZXR0aW5ncy5zdmcuY3JlYXRlU1ZHTWF0cml4KCk7XHJcbm1hdHJpeC5lID0gdmlld0JveC54ICsgMTA7XHJcbm1hdHJpeC5mID0gdmlld0JveC55ICsgKHZpZXdCb3guaGVpZ2h0IC0gNTApO1xyXG5pY29ucy5ncm91cC5pZCA9ICdjb250cm9sJztcclxuaWNvbnMuZ3JvdXAudHJhbnNmb3JtLmJhc2VWYWwuaW5pdGlhbGl6ZShzZXR0aW5ncy5zdmcuY3JlYXRlU1ZHVHJhbnNmb3JtRnJvbU1hdHJpeChtYXRyaXgpKTtcclxuXHJcblxyXG4vLyBhZGQgaW50ZXJmYWNlIHRvIERPTVxyXG5cclxuc2V0dGluZ3Muc3ZnLmFwcGVuZENoaWxkKGljb25zLmdyb3VwKTtcclxuXHJcblxyXG4vLyBhZGQgZXZlbnQgbGlzdGVuZXJzIHRvIGVsZW1lbnRzIG9mIGludGVyZmFjZSwgYW5kIHNldCBldmVudCBwcm9wYWdhdGlvblxyXG5cclxuY29uc3QgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuZXZlbnQuaW5pdEV2ZW50KCdidXR0b24tY2xpY2snLCB0cnVlLCB0cnVlKTtcclxuaWNvbnMucmVjdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgc2V0dGluZ3Muc3ZnLmRpc3BhdGNoRXZlbnQoZXZlbnQpOyB9KTtcclxuXHJcblxyXG4vKlxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tSU5URVJGQUNFLUFOSU1BVElPTlMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiovXHJcblxyXG4vLyBhbmltYXRpb24gLSBwbGF5IC0+IHBhdXNlXHJcblxyXG5mdW5jdGlvbiBhbmltYXRlUGxheVRvUGF1c2UoKSB7XHJcbiAgICBsZXQgc3RlcHMgPSAxO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFuaW1hdGUoKSB7XHJcbiAgICAgICAgaWYgKHN0ZXBzIDw9IDEwKSB7XHJcbiAgICAgICAgICAgIGljb25zLnBvbHlnb24xLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgYFxyXG4gICAgICAgICAgICAxMCwxMCBcclxuICAgICAgICAgICAgMTAsMzAgXHJcbiAgICAgICAgICAgICR7MjAgLSAoc3RlcHMgLyA1KSA+IDE4ID8gMjAgLSAoc3RlcHMgLyA1KSA6IDE4fSwkezI1ICsgKHN0ZXBzIC8gMikgPCAzMCA/IDI1ICsgKHN0ZXBzIC8gMikgOiAzMH0gXHJcbiAgICAgICAgICAgICR7MjAgLSAoc3RlcHMgLyA1KSA+IDE4ID8gMjAgLSAoc3RlcHMgLyA1KSA6IDE4fSwkezE1IC0gKHN0ZXBzIC8gMikgPiAxMCA/IDE1IC0gKHN0ZXBzIC8gMikgOiAxMH1cclxuICAgICAgICAgICAgYCk7XHJcbiAgICAgICAgICAgIGljb25zLnBvbHlnb24yLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgYFxyXG4gICAgICAgICAgICAkezIwICsgKHN0ZXBzIC8gNSkgPCAyMiA/IDIwICsgKHN0ZXBzIC8gNSkgOiAyMn0sJHsxNSAtIChzdGVwcyAvIDIpID4gMTAgPyAxNSAtIChzdGVwcyAvIDIpIDogMTB9IFxyXG4gICAgICAgICAgICAkezIwICsgKHN0ZXBzIC8gNSkgPCAyMiA/IDIwICsgKHN0ZXBzIC8gNSkgOiAyMn0sICR7MjUgKyAoc3RlcHMgLyAyKSA8IDMwID8gMjUgKyAoc3RlcHMgLyAyKSA6IDMwfSBcclxuICAgICAgICAgICAgMzAsJHsyMCArIHN0ZXBzIDwgMzAgPyAyMCArIHN0ZXBzIDogMzB9IFxyXG4gICAgICAgICAgICAzMCwkezIwIC0gc3RlcHMgPiAxMCA/IDIwIC0gc3RlcHMgOiAxMH1cclxuICAgICAgICAgICAgYCk7XHJcbiAgICAgICAgICAgIHN0ZXBzICs9IDE7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYW5pbWF0ZSgpO1xyXG59XHJcblxyXG4vLyBhbmltYXRpb24gLSBwYXVzZSAtPiBwbGF5XHJcblxyXG5mdW5jdGlvbiBhbmltYXRlUGF1c2VUb1BsYXkoKSB7XHJcbiAgICBsZXQgc3RlcHMgPSAxO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFuaW1hdGUoKSB7XHJcbiAgICAgICAgaWYgKHN0ZXBzIDw9IDEwKSB7XHJcbiAgICAgICAgICAgIGljb25zLnBvbHlnb24xLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgYFxyXG4gICAgICAgICAgICAgICAgMTAsMTAgXHJcbiAgICAgICAgICAgICAgICAxMCwzMCBcclxuICAgICAgICAgICAgICAgICR7MTggKyAoc3RlcHMgLyA1KSA8IDIwID8gMTggKyAoc3RlcHMgLyA1KSA6IDIwfSwkezMwIC0gKHN0ZXBzIC8gMikgPiAyNSA/IDMwIC0gKHN0ZXBzIC8gMikgOiAyNX0gXHJcbiAgICAgICAgICAgICAgICAkezE4ICsgKHN0ZXBzIC8gNSkgPCAyMCA/IDE4ICsgKHN0ZXBzIC8gNSkgOiAyMH0sJHsxMCArIChzdGVwcyAvIDIpIDwgMTUgPyAxMCArIChzdGVwcyAvIDIpIDogMTV9XHJcbiAgICAgICAgICAgIGApO1xyXG4gICAgICAgICAgICBpY29ucy5wb2x5Z29uMi5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsIGBcclxuICAgICAgICAgICAgICAgICR7MjIgLSAoc3RlcHMgLyA1KSA+IDIwID8gMjIgLSAoc3RlcHMgLyA1KSA6IDIwfSwkezEwICsgKHN0ZXBzIC8gMikgPCAxNSA/IDEwICsgKHN0ZXBzIC8gMikgOiAxNX0gXHJcbiAgICAgICAgICAgICAgICAkezIyIC0gKHN0ZXBzIC8gNSkgPiAyMCA/IDIyIC0gKHN0ZXBzIC8gNSkgOiAyMH0sJHszMCAtIChzdGVwcyAvIDIpID4gMjUgPyAzMCAtIChzdGVwcyAvIDIpIDogMjV9IFxyXG4gICAgICAgICAgICAgICAgMzAsJHszMCAtIChzdGVwcyA+IDIwKSA/IDMwIC0gc3RlcHMgOiAyMH0gXHJcbiAgICAgICAgICAgICAgICAzMCwkezEwICsgKHN0ZXBzIDwgMjApID8gMTAgKyBzdGVwcyA6IDIwfVxyXG4gICAgICAgICAgICBgKTtcclxuICAgICAgICAgICAgc3RlcHMgKz0gMTtcclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhbmltYXRlKCk7XHJcbn1cclxuXHJcbi8vIGFuaW1hdGlvbiAtIHBhdXNlIC0+IHJlbG9hZFxyXG5cclxuZnVuY3Rpb24gYW5pbWF0ZVBhdXNlVG9SZWxvYWQoKSB7XHJcbiAgICBsZXQgc3RlcHMgPSAxO1xyXG4gICAgbGV0IG9mZnNldCA9IDE2O1xyXG5cclxuICAgIGZ1bmN0aW9uIGFuaW1hdGVBcmMoKSB7XHJcbiAgICAgICAgaWYgKG9mZnNldCA+IDApIHtcclxuICAgICAgICAgICAgb2Zmc2V0IC09IDE7XHJcbiAgICAgICAgICAgIGljb25zLmFyYzEuc2V0QXR0cmlidXRlKCdzdHlsZScsIGBzdHJva2UtZGFzaG9mZnNldDoke29mZnNldH1weGApO1xyXG4gICAgICAgICAgICBpY29ucy5hcmMyLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBgc3Ryb2tlLWRhc2hvZmZzZXQ6JHtvZmZzZXR9cHhgKTtcclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlQXJjKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpY29ucy5hcmMxLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnc3Ryb2tlLWRhc2hvZmZzZXQ6MCcpO1xyXG4gICAgICAgICAgICBpY29ucy5hcmMyLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnc3Ryb2tlLWRhc2hvZmZzZXQ6MCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhbmltYXRlKCkge1xyXG4gICAgICAgIGlmIChzdGVwcyA8PSAxMCkge1xyXG4gICAgICAgICAgICBpY29ucy5wb2x5Z29uMS5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsIGBcclxuICAgICAgICAgICAgICAgICR7MTAgLSAoc3RlcHMgKiAwLjQpID4gNiA/IDEwIC0gKHN0ZXBzICogMC40KSA6IDZ9LCR7MTAgKyBzdGVwcyA8IDIwID8gMTAgKyBzdGVwcyA6IDIwfSBcclxuICAgICAgICAgICAgICAgIDEwLCR7MzAgLSAoc3RlcHMgKiAwLjQpID4gMjYgPyAzMCAtIChzdGVwcyAqIDAuNCkgOiAyNn0gXHJcbiAgICAgICAgICAgICAgICAkezE4IC0gKHN0ZXBzICogMC44KSA+IDEwID8gMTggLSAoc3RlcHMgKiAwLjgpIDogMTB9LCR7MzAgLSAoc3RlcHMgKiAwLjQpID4gMjYgPyAzMCAtIChzdGVwcyAqIDAuNCkgOiAyNn0gXHJcbiAgICAgICAgICAgICAgICAkezE4IC0gKHN0ZXBzICogMC40KSA+IDE0ID8gMTggLSAoc3RlcHMgKiAwLjQpIDogMTR9LCR7MTAgKyBzdGVwcyA8IDIwID8gMTAgKyBzdGVwcyA6IDIwfVxyXG4gICAgICAgICAgICBgKTtcclxuICAgICAgICAgICAgaWNvbnMucG9seWdvbjIuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBgXHJcbiAgICAgICAgICAgICAgICAkezIyICsgKHN0ZXBzICogMC44KSA8IDMwID8gMjIgKyAoc3RlcHMgKiAwLjgpIDogMzB9LCR7MTAgKyAoc3RlcHMgKiAwLjQpIDwgMTQgPyAxMCArIChzdGVwcyAqIDAuNCkgOiAxNH0gXHJcbiAgICAgICAgICAgICAgICAkezIyICsgKHN0ZXBzICogMC40KSA8IDI2ID8gMjIgKyAoc3RlcHMgKiAwLjQpIDogMjZ9LCR7MzAgLSBzdGVwcyA+IDIwID8gMzAgLSBzdGVwcyA6IDIwfSBcclxuICAgICAgICAgICAgICAgICAkezMwICsgKHN0ZXBzICogMC40KSA8IDM0ID8gMzAgKyAoc3RlcHMgKiAwLjQpIDogMzR9LCR7MzAgLSBzdGVwcyA+IDIwID8gMzAgLSBzdGVwcyA6IDIwfSBcclxuICAgICAgICAgICAgICAgIDMwLCR7MTAgKyAoc3RlcHMgKiAwLjQpIDwgMTQgPyAxMCArIChzdGVwcyAqIDAuNCkgOiAxNH1cclxuICAgICAgICAgICAgYCk7XHJcbiAgICAgICAgICAgIHN0ZXBzICs9IDE7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYW5pbWF0ZUFyYygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFuaW1hdGUoKTtcclxufVxyXG5cclxuLy8gYW5pbWF0aW9uIC0gcmVsb2FkIC0+IHBsYXlcclxuXHJcbmZ1bmN0aW9uIGFuaW1hdGVSZWxvYWRUb1BsYXkoKSB7XHJcbiAgICBsZXQgc3RlcHMgPSAxO1xyXG4gICAgbGV0IG9mZnNldCA9IDA7XHJcblxyXG4gICAgZnVuY3Rpb24gYW5pbWF0ZSgpIHtcclxuICAgICAgICBpZiAoc3RlcHMgPD0gMTApIHtcclxuICAgICAgICAgICAgaWNvbnMucG9seWdvbjEuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBgXHJcbiAgICAgICAgICAgICAgICAkezYgKyAoc3RlcHMgKiAwLjQpIDwgMTAgPyA2ICsgKHN0ZXBzICogMC40KSA6IDEwfSwkezIwIC0gc3RlcHMgPiAxMCA/IDIwIC0gc3RlcHMgOiAxMH0gXHJcbiAgICAgICAgICAgICAgICAxMCwkezI2ICsgKHN0ZXBzICogMC40KSA8IDMwID8gMjYgKyAoc3RlcHMgKiAwLjQpIDogMzB9IFxyXG4gICAgICAgICAgICAgICAgJHsxMCArIHN0ZXBzIDwgMjAgPyAxMCArIHN0ZXBzIDogMjB9LCR7MjYgLSAoc3RlcHMgKiAwLjEpID4gMjUgPyAyNiAtIChzdGVwcyAqIDAuMSkgOiAyNX0gXHJcbiAgICAgICAgICAgICAgICAkezE0ICsgKHN0ZXBzICogMC42KSA8IDIwID8gMTQgKyAoc3RlcHMgKiAwLjYpIDogMjB9LCR7MjAgLSAoc3RlcHMgKiAwLjUpID4gMTUgPyAyMCAtIChzdGVwcyAqIDAuNSkgOiAxNX1cclxuICAgICAgICAgICAgYCk7XHJcbiAgICAgICAgICAgIGljb25zLnBvbHlnb24yLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgYFxyXG4gICAgICAgICAgICAgICAgJHszMCAtIHN0ZXBzID4gMjAgPyAzMCAtIHN0ZXBzIDogMjB9LCR7MTQgKyAoc3RlcHMgKiAwLjEpIDwgMTUgPyAxNCArIChzdGVwcyAqIDAuMSkgOiAxNX0gXHJcbiAgICAgICAgICAgICAgICAkezI2IC0gKHN0ZXBzICogMC42KSA+IDIwID8gMjYgLSAoc3RlcHMgKiAwLjYpIDogMjB9LCR7MjAgKyAoc3RlcHMgKiAwLjUpIDwgMjUgPyAyMCArIChzdGVwcyAqIDAuNSkgOiAyNX0gXHJcbiAgICAgICAgICAgICAgICAkezM0IC0gKHN0ZXBzICogMC40KSA+IDMwID8gMzQgLSAoc3RlcHMgKiAwLjQpIDogMzB9LDIwIFxyXG4gICAgICAgICAgICAgICAgMzAsJHsxNCArIChzdGVwcyAqIDAuNikgPCAyMCA/IDE0ICsgKHN0ZXBzICogMC42KSA6IDIwfVxyXG4gICAgICAgICAgICBgKTtcclxuICAgICAgICAgICAgc3RlcHMgKz0gMTtcclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYW5pbWF0ZUFyYygpIHtcclxuICAgICAgICBpZiAob2Zmc2V0IDwgMTYpIHtcclxuICAgICAgICAgICAgb2Zmc2V0ICs9IDE7XHJcbiAgICAgICAgICAgIGljb25zLmFyYzEuc2V0QXR0cmlidXRlKCdzdHlsZScsIGBzdHJva2UtZGFzaG9mZnNldDoke29mZnNldH1weGApO1xyXG4gICAgICAgICAgICBpY29ucy5hcmMyLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBgc3Ryb2tlLWRhc2hvZmZzZXQ6JHtvZmZzZXR9YCk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZUFyYyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWNvbnMuYXJjMS5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XHJcbiAgICAgICAgICAgIGljb25zLmFyYzIucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xyXG4gICAgICAgICAgICBhbmltYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYW5pbWF0ZUFyYygpO1xyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgYW5pbWF0ZVBsYXlUb1BhdXNlIGFzIHBsYXlUb1BhdXNlLFxyXG4gICAgYW5pbWF0ZVBhdXNlVG9QbGF5IGFzIHBhdXNlVG9QbGF5LFxyXG4gICAgYW5pbWF0ZVBhdXNlVG9SZWxvYWQgYXMgcGF1c2VUb1JlbG9hZCxcclxuICAgIGFuaW1hdGVSZWxvYWRUb1BsYXkgYXMgcmVsb2FkVG9QbGF5LFxyXG59O1xyXG4iLCJpbXBvcnQgeyBwbGF5VG9QYXVzZSwgcGF1c2VUb1BsYXksIHBhdXNlVG9SZWxvYWQsIHJlbG9hZFRvUGxheSB9IGZyb20gJy4vYnV0dG9ucyc7XHJcblxyXG4vKiBQbGF5ZXIgc3RhcnRzLCBzdG9wcywgcmVzdW1lcyBvciByZWxvYWRzIHNsaWRlIHNob3cgKi9cclxuXHJcbi8vIGFycmF5IG9mIGFsbCBzbGlkZXNcclxuY29uc3Qgc2xpZGVzID0gW107XHJcbi8vIHNldCBvZiBhbGwgZWxlbWVudHMgdXNlZCBpbiBhbmltYXRpb25zLiBOZWVkZWQgZm9yIHJlc3RhcnRpbmcsIHNldHRpbmcgZWxlbWVudHMgdG8gc3RhcnRpbmcgcG9zaXRpb25zXHJcbmNvbnN0IG9iamVjdExpc3QgPSBuZXcgU2V0KCk7XHJcbmxldCBjdXJyZW50U2xpZGUgPSAwO1xyXG5sZXQgc3RhdHVzID0gJ25vdCBzdGFydGVkJztcclxuXHJcbmZ1bmN0aW9uIHN0YXJ0KCkge1xyXG4gICAgY3VycmVudFNsaWRlID0gMDtcclxuICAgIHNsaWRlc1tjdXJyZW50U2xpZGVdLnBsYXkoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVzZXQoKSB7XHJcbiAgICBvYmplY3RMaXN0LmZvckVhY2goKGVsKSA9PiB7IGVsLnJlc2V0KCk7IH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXN1bWUoKSB7XHJcbiAgICBpZiAoY3VycmVudFNsaWRlICsgMSA+PSBzbGlkZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgc3RhdHVzID0gJ2ZpbmlzaGVkJztcclxuICAgICAgICBwYXVzZVRvUmVsb2FkKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGN1cnJlbnRTbGlkZSArPSAxO1xyXG4gICAgICAgIHNsaWRlc1tjdXJyZW50U2xpZGVdLnBsYXkoKTtcclxuICAgICAgICBwbGF5VG9QYXVzZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjb250cm9sUGxheWVyKCkge1xyXG4gICAgaWYgKHNsaWRlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHNsaWRlcyB0byBhbmltYXRlLiBBZGQgc2xpZGVzIHVzaW5nIFwiYWRkU2xpZGVzXCIgZnVuY3Rpb24uJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN0YXR1cyA9PT0gJ2ZpbmlzaGVkJykge1xyXG4gICAgICAgIHN0YXR1cyA9ICdub3Qgc3RhcnRlZCc7XHJcbiAgICAgICAgcmVzZXQoKTtcclxuICAgICAgICByZWxvYWRUb1BsYXkoKTtcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSAncGxheWluZycpIHtcclxuICAgICAgICBzdGF0dXMgPSAncGF1c2VkJztcclxuICAgICAgICBwYXVzZVRvUGxheSgpO1xyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09ICdwYXVzZWQnKSB7XHJcbiAgICAgICAgc3RhdHVzID0gJ3BsYXlpbmcnO1xyXG4gICAgICAgIHJlc3VtZSgpO1xyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09ICdub3Qgc3RhcnRlZCcpIHtcclxuICAgICAgICBzdGF0dXMgPSAncGxheWluZyc7XHJcbiAgICAgICAgc3RhcnQoKTtcclxuICAgICAgICBwbGF5VG9QYXVzZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBuZXh0KGRlbGF5KSB7XHJcbiAgICBpZiAoY3VycmVudFNsaWRlICsgMSA+PSBzbGlkZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgc3RhdHVzID0gJ2ZpbmlzaGVkJztcclxuICAgICAgICBwYXVzZVRvUmVsb2FkKCk7XHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gJ3BhdXNlZCcpIHtcclxuICAgICAgICBjdXJyZW50U2xpZGUgKz0gMTtcclxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IHNsaWRlc1tjdXJyZW50U2xpZGVdLnBsYXkoKTsgfSwgZGVsYXkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRTbGlkZXMoLi4uc2xpZGUpIHtcclxuICAgIHNsaWRlcy5wdXNoKC4uLnNsaWRlKTtcclxufVxyXG5mdW5jdGlvbiBhZGRPYmplY3RzKG9iamVjdCkge1xyXG4gICAgb2JqZWN0TGlzdC5hZGQob2JqZWN0KTtcclxufVxyXG5cclxuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2J1dHRvbi1jbGljaycsIGNvbnRyb2xQbGF5ZXIsIGZhbHNlKTtcclxuXHJcbmV4cG9ydCB7IGFkZFNsaWRlcywgYWRkT2JqZWN0cywgbmV4dCB9O1xyXG5cclxuIiwiY29uc3QgdXRpbHMgPSB7XHJcbiAgICB1bmRlZjogaXRlbSA9PiAodHlwZW9mIGl0ZW0gPT09ICd1bmRlZmluZWQnKSwgICAvLyBjaGVjayBpZiBhcmd1bWVudCBpcyB1bmRlZmluZWRcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHV0aWxzO1xyXG4iLCJpbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi8uLi91dGlscyc7XHJcblxyXG4vKiBEZWZpbmUgbW9zdCBlZmZpY2llbnQgZnVuY3Rpb24gdXNlZCB0byBhbmltYXRlIHRyYW5zZm9ybSBwcm9wZXJ0eSwgdGhlbiBhZGQgaXQgdG8gYXJyYXkgb2YgZnVuY3Rpb25zIGZvciBhbmltYXRpb24gKi9cclxuXHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZVRyYW5zZm9ybShlbCkge1xyXG4gICAgY29uc3QgdGFyZ2V0VHJhbnNmb3JtID0gZWwudHJhbnNmb3JtO1xyXG5cclxuICAgIC8vIGNoZWNrIGlmIHRyYW5zZm9ybSBhbmltYXRpb24gaXMgcmVxdWVzdGVkXHJcbiAgICBpZiAoIXV0aWxzLnVuZGVmKHRhcmdldFRyYW5zZm9ybSkpIHtcclxuICAgICAgICBsZXQgYW5pbWF0ZUZ1bmM7XHJcbiAgICAgICAgbGV0IHVwZGF0ZUZ1bmM7XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0ID0gZWwub2JqZWN0O1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0aW5nVHJhbnNmb3JtID0gZWwub2JqZWN0LnRyO1xyXG5cclxuICAgICAgICBjb25zdCBkZWx0YVNjYWxlID0gdGFyZ2V0VHJhbnNmb3JtLnNjYWxlIC0gc3RhcnRpbmdUcmFuc2Zvcm0uc2NhbGU7XHJcbiAgICAgICAgY29uc3QgZGVsdGFSb3RhdGUgPSB0YXJnZXRUcmFuc2Zvcm0ucm90YXRlIC0gc3RhcnRpbmdUcmFuc2Zvcm0ucm90YXRlO1xyXG4gICAgICAgIGxldCBkZWx0YTA7XHJcbiAgICAgICAgbGV0IGRlbHRhMTtcclxuICAgICAgICBpZiAoIXV0aWxzLnVuZGVmKHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGUpKSB7XHJcbiAgICAgICAgICAgIGRlbHRhMCA9ICh0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlWzBdKSAtIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZVswXTtcclxuICAgICAgICAgICAgZGVsdGExID0gKHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGVbMV0pIC0gc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlWzFdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogLS0tLS0tLS0gdHJhbnNmb3JtcyB3aXRob3V0IHRyYW5zbGF0aW9uIC0tLS0tLS0tICovXHJcbiAgICAgICAgaWYgKHV0aWxzLnVuZGVmKHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGUpKSB7XHJcbiAgICAgICAgICAgIGlmICh1dGlscy51bmRlZih0YXJnZXRUcmFuc2Zvcm0ucm90YXRlKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gb25seSBzY2FsaW5nXHJcbiAgICAgICAgICAgICAgICBhbmltYXRlRnVuYyA9ICh0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnNjYWxlKHN0YXJ0aW5nVHJhbnNmb3JtLnNjYWxlICsgKGRlbHRhU2NhbGUgKiB0KSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlRnVuYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3Quc2NhbGUodGFyZ2V0VHJhbnNmb3JtLnNjYWxlKTtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5zY2FsZSA9IHRhcmdldFRyYW5zZm9ybS5zY2FsZTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodXRpbHMudW5kZWYodGFyZ2V0VHJhbnNmb3JtLnNjYWxlKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gb25seSByb3RhdGlvblxyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZUZ1bmMgPSAodCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5yb3RhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnJvdGF0ZSArIChkZWx0YVJvdGF0ZSAqIHQpKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVGdW5jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5yb3RhdGUodGFyZ2V0VHJhbnNmb3JtLnJvdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0ucm90YXRlID0gdGFyZ2V0VHJhbnNmb3JtLnJvdGF0ZTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBzY2FsaW5nIGFuZCByb3RhdGluZ1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZUZ1bmMgPSAodCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5zY2FsZUFuZFJvdGF0ZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0uc2NhbGUgKyAoZGVsdGFTY2FsZSAqIHQpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5yb3RhdGUgKyAoZGVsdGFSb3RhdGUgKiB0KSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlRnVuYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3Quc2NhbGVBbmRSb3RhdGUodGFyZ2V0VHJhbnNmb3JtLnNjYWxlLCB0YXJnZXRUcmFuc2Zvcm0ucm90YXRlKTtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5zY2FsZSA9IHRhcmdldFRyYW5zZm9ybS5zY2FsZTtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5yb3RhdGUgPSB0YXJnZXRUcmFuc2Zvcm0ucm90YXRlO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIC8qIC0tLS0tLS0tIHRyYW5zZm9ybXMgd2l0aCB0cmFuc2xhdGlvbiAtLS0tLS0tLSAqL1xyXG4gICAgICAgIH0gZWxzZSBpZiAodXRpbHMudW5kZWYodGFyZ2V0VHJhbnNmb3JtLnNjYWxlKSAmJiB1dGlscy51bmRlZih0YXJnZXRUcmFuc2Zvcm0ucm90YXRlKSkge1xyXG4gICAgICAgICAgICAvLyBvbmx5IHRyYW5zbGF0aW9uXHJcbiAgICAgICAgICAgIGFuaW1hdGVGdW5jID0gKHQpID0+IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdC50cmFuc2xhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlWzBdICsgKGRlbHRhMCAqIHQpLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZVsxXSArIChkZWx0YTEgKiB0KSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHVwZGF0ZUZ1bmMgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3QudHJhbnNsYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGVbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVsxXSk7XHJcbiAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGUgPSB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSBpZiAodXRpbHMudW5kZWYodGFyZ2V0VHJhbnNmb3JtLnJvdGF0ZSkpIHtcclxuICAgICAgICAgICAgLy8gc2NhbGUgYW5kIHRyYW5zbGF0aW9uXHJcbiAgICAgICAgICAgIGFuaW1hdGVGdW5jID0gKHQpID0+IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdC5zY2FsZUFuZFRyYW5zbGF0ZShcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5zY2FsZSArIChkZWx0YVNjYWxlICogdCksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlWzBdICsgKGRlbHRhMCAqIHQpLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZVsxXSArIChkZWx0YTEgKiB0KSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHVwZGF0ZUZ1bmMgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3Quc2NhbGVBbmRUcmFuc2xhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnNjYWxlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGVbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVsxXSk7XHJcbiAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5zY2FsZSA9IHRhcmdldFRyYW5zZm9ybS5zY2FsZTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZSA9IHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0VHJhbnNmb3JtLnNjYWxlID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAvLyByb3RhdGlvbiBhbmQgdHJhbnNsYXRpb25cclxuICAgICAgICAgICAgYW5pbWF0ZUZ1bmMgPSAodCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LnJvdGF0ZUFuZFRyYW5zbGF0ZShcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5yb3RhdGUgKyAoZGVsdGFSb3RhdGUgKiB0KSxcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGVbMF0gKyAoZGVsdGEwICogdCksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlWzFdICsgKGRlbHRhMSAqIHQpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdXBkYXRlRnVuYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdC5yb3RhdGVBbmRUcmFuc2xhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnJvdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGVbMV0pO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0ucm90YXRlID0gdGFyZ2V0VHJhbnNmb3JtLnJvdGF0ZTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZSA9IHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gc2NhbGUsIHJvdGF0aW9uIGFuZCB0cmFuc2xhdGlvblxyXG4gICAgICAgICAgICBhbmltYXRlRnVuYyA9ICh0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3Quc2NhbGVBbmRSb3RhdGVBbmRUcmFuc2xhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0uc2NhbGUgKyAoZGVsdGFTY2FsZSAqIHQpLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnJvdGF0ZSArIChkZWx0YVJvdGF0ZSAqIHQpLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZVswXSArIChkZWx0YTAgKiB0KSxcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGVbMV0gKyAoZGVsdGExICogdCkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB1cGRhdGVGdW5jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LnNjYWxlQW5kUm90YXRlQW5kVHJhbnNsYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRyYW5zZm9ybS5zY2FsZSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0ucm90YXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGVbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVsxXSk7XHJcbiAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5zY2FsZSA9IHRhcmdldFRyYW5zZm9ybS5zY2FsZTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnJvdGF0ZSA9IHRhcmdldFRyYW5zZm9ybS5yb3RhdGU7XHJcbiAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGUgPSB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFthbmltYXRlRnVuYywgdXBkYXRlRnVuY107XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNhbGN1bGF0ZVRyYW5zZm9ybTtcclxuIiwiaW1wb3J0IHV0aWxzIGZyb20gJy4vLi4vLi4vdXRpbHMnO1xyXG5cclxuLyogRGVmaW5lIGZ1bmN0aW9uIHVzZWQgdG8gYW5pbWF0ZSBhdHRyaWJ1dGVzLCB0aGVuIGFkZCBpdCB0byBhcnJheSBvZiBmdW5jdGlvbnMgZm9yIGFuaW1hdGlvbiAqL1xyXG5cclxuZnVuY3Rpb24gY2FsY3VsYXRlQXR0cmlidXRlcyhlbCkge1xyXG4gICAgY29uc3QgdGFibGUgPSBbXTtcclxuXHJcbiAgICBmdW5jdGlvbiBhbmltYXRlRnVuYyh0KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWJsZS5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBlbC5vYmplY3Qub2JqLnNldEF0dHJpYnV0ZSh0YWJsZVtpXVswXSwgdGFibGVbaV1bMV0gKyAoKHRhYmxlW2ldWzJdIC0gdGFibGVbaV1bMV0pICogdCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVGdW5jKCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFibGUubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgZWwub2JqZWN0Lm9iai5zZXRBdHRyaWJ1dGUodGFibGVbaV1bMF0sIHRhYmxlW2ldWzJdKTtcclxuICAgICAgICAgICAgZWwub2JqZWN0LnZhcmlhYmxlcy5zZXQodGFibGVbaV1bMF0sIHRhYmxlW2ldWzJdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBjaGVjayBpZiBhdHRyaWJ1dGVzIGFuaW1hdGlvbiBpcyByZXF1ZXN0ZWRcclxuICAgIGlmICghdXRpbHMudW5kZWYoZWwuYXR0cmlidXRlcykgJiYgZWwuYXR0cmlidXRlcy5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBjb25zdCBhdHRyaWJ1dGVzID0gQXJyYXkuaXNBcnJheShlbC5hdHRyaWJ1dGVzKSA/IGVsLmF0dHJpYnV0ZXMgOiBbZWwuYXR0cmlidXRlc107XHJcbiAgICAgICAgLy8gZm9yIGV2ZXJ5IGF0dHJpYnV0ZVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAvLyBwcm9wZXJ0eSBuYW1lXHJcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBhdHRyaWJ1dGVzW2ldLm5hbWU7XHJcblxyXG4gICAgICAgICAgICAvLyBzdGFydGluZyB2YWx1ZVxyXG4gICAgICAgICAgICBjb25zdCBmcm9tID0gdXRpbHMudW5kZWYoYXR0cmlidXRlc1tpXS5mcm9tKSA/IGVsLm9iamVjdC52YXJpYWJsZXMuZ2V0KG5hbWUpIDogYXR0cmlidXRlc1tpXS5mcm9tO1xyXG5cclxuICAgICAgICAgICAgLy8gdGhyb3cgZXJyb3IgaWYgc3RhcnRpbmcgdmFsdWUgaXMgbm90IGRlZmluZWQuIE5laXRoZXIgaW4gcmVxdWVzdCBub3IgaW4gRE9NIGVsZW1lbnRcclxuICAgICAgICAgICAgaWYgKHV0aWxzLnVuZGVmKGZyb20pKSB7IHRocm93IG5ldyBFcnJvcihgTm8gXCJmcm9tXCIgdmFsdWUsIGZvciAke25hbWV9YCk7IH1cclxuXHJcbiAgICAgICAgICAgIC8vIHRhcmdldCB2YWx1ZVxyXG4gICAgICAgICAgICBjb25zdCB0byA9IGF0dHJpYnV0ZXNbaV0udG87XHJcblxyXG4gICAgICAgICAgICB0YWJsZS5wdXNoKFtuYW1lLCBmcm9tLCB0b10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW2FuaW1hdGVGdW5jLCB1cGRhdGVGdW5jXTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2FsY3VsYXRlQXR0cmlidXRlcztcclxuIiwiaW1wb3J0IHV0aWxzIGZyb20gJy4vLi4vLi4vdXRpbHMnO1xyXG5cclxuZnVuY3Rpb24gY2FsY3VsYXRlUmVtb3ZlKGVsKSB7XHJcbiAgICBjb25zdCByZW1vdmUgPSBlbC5yZW1vdmU7XHJcblxyXG4gICAgaWYgKCF1dGlscy51bmRlZihyZW1vdmUpKSB7XHJcbiAgICAgICAgaWYgKHJlbW92ZS53aGVuID09PSAnZW5kJykge1xyXG4gICAgICAgICAgICBjb25zdCByZW1vdmVGdW5jID0gKCkgPT4gZmFsc2U7XHJcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZUZ1bmMgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlbC5vYmplY3Qub2JqLnJlbW92ZUF0dHJpYnV0ZShyZW1vdmUubmFtZSk7XHJcbiAgICAgICAgICAgICAgICBlbC5vYmplY3QudmFyaWFibGVzLmRlbGV0ZShyZW1vdmUubmFtZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBbcmVtb3ZlRnVuYywgdXBkYXRlRnVuY107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsLm9iamVjdC5vYmoucmVtb3ZlQXR0cmlidXRlKHJlbW92ZS5uYW1lKTtcclxuICAgICAgICBlbC5vYmplY3QudmFyaWFibGVzLmRlbGV0ZShuYW1lKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2FsY3VsYXRlUmVtb3ZlO1xyXG4iLCJpbXBvcnQgYW5pbWF0ZSBmcm9tICcuL2FuaW1hdGUnO1xyXG5pbXBvcnQgeyBhZGRPYmplY3RzIH0gZnJvbSAnLi4vY29udHJvbC9wbGF5ZXInO1xyXG5pbXBvcnQgY2FsY3VsYXRlVHJhbnNmb3JtIGZyb20gJy4vY2FsY3VsYXRpb25zL3RyYW5zZm9ybSc7XHJcbmltcG9ydCBjYWxjdWxhdGVBdHRyaWJ1dGVzIGZyb20gJy4vY2FsY3VsYXRpb25zL2F0dHJpYnV0ZSc7XHJcbmltcG9ydCBjYWxjdWxhdGVSZW1vdmUgZnJvbSAnLi9jYWxjdWxhdGlvbnMvcmVtb3ZlJztcclxuaW1wb3J0IHV0aWxzIGZyb20gJy4uL3V0aWxzJztcclxuXHJcbi8qIFNwZWNpZnkgZnVuY3Rpb25zIHVzZWQgdG8gYW5pbWF0aW9ucywgYW5kIHNlbmQgdGhlbSB0byBhbmltYXRlIGZ1bmN0aW9uICovXHJcblxyXG5mdW5jdGlvbiBjYWxjdWxhdGUoZWwpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgIC8vIGRlY2xhcmUgYXJyYXkgb2YgYW5pbWF0aW9uIGZ1bmN0aW9uc1xyXG4gICAgICAgIGNvbnN0IGFyciA9IFtdO1xyXG4gICAgICAgIGNvbnN0IG9iamVjdHMgPSBBcnJheS5pc0FycmF5KGVsLm9iamVjdHMpID8gZWwub2JqZWN0cyA6IFtlbC5vYmplY3RzXTtcclxuICAgICAgICAvLyBTZXQgZnVuY3Rpb24gZm9yIGV2ZXJ5IG9iamVjdFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb2JqZWN0cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0T2JqZWN0ID0gb2JqZWN0c1tpXTtcclxuXHJcbiAgICAgICAgICAgIC8vIGRlZmluZSB0cmFuc2Zvcm0gYW5pbWF0aW9uIGZ1bmN0aW9uLCBpZiB0cmFuc2Zvcm0gYW5pbWF0aW9uIGlzIHJlcXVlc3RlZFxyXG4gICAgICAgICAgICBjb25zdCBjYWxjdWxhdGVkVHJhbnNmb3JtID0gY2FsY3VsYXRlVHJhbnNmb3JtKHJlcXVlc3RPYmplY3QpO1xyXG4gICAgICAgICAgICBpZiAoY2FsY3VsYXRlZFRyYW5zZm9ybSkgeyBhcnIucHVzaChbY2FsY3VsYXRlZFRyYW5zZm9ybV0pOyB9XHJcblxyXG4gICAgICAgICAgICAvLyBkZWZpbmUgYXR0cmlidXRlIGFuaW1hdGlvbiBmdW5jdGlvbiwgaWYgYXR0cmlidXRlIGFuaW1hdGlvbiBpcyByZXF1ZXN0ZWRcclxuICAgICAgICAgICAgY29uc3QgY2FsY3VsYXRlZEF0dHJpYnV0ZXMgPSBjYWxjdWxhdGVBdHRyaWJ1dGVzKHJlcXVlc3RPYmplY3QpO1xyXG4gICAgICAgICAgICBpZiAoY2FsY3VsYXRlZEF0dHJpYnV0ZXMpIHsgYXJyLnB1c2goW2NhbGN1bGF0ZWRBdHRyaWJ1dGVzXSk7IH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGN1bGF0ZWRSZW1vdmUgPSBjYWxjdWxhdGVSZW1vdmUocmVxdWVzdE9iamVjdCk7XHJcbiAgICAgICAgICAgIGlmIChjYWxjdWxhdGVkUmVtb3ZlKSB7IGFyci5wdXNoKFtjYWxjdWxhdGVkUmVtb3ZlXSk7IH1cclxuXHJcbiAgICAgICAgICAgIC8vIGFkZCBvYmplY3RzIHRvIG9iamVjdHMgc2V0IGluIHBsYXllci5qcy4gTmVlZGVkIGZvciByZXNldGluZ1xyXG4gICAgICAgICAgICBhZGRPYmplY3RzKG9iamVjdHNbaV0ub2JqZWN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc2VuZCBhcnJheSBvZiBmdW5jdGlvbnMgdG8gYW5pbWF0ZSBmdW5jdGlvblxyXG4gICAgICAgIGFuaW1hdGUoXHJcbiAgICAgICAgICAgIHV0aWxzLnVuZGVmKGVsLnNwZWVkKSA/IDEgOiBlbC5zcGVlZCxcclxuICAgICAgICAgICAgZWwuZGVsYXkgfHwgMCxcclxuICAgICAgICAgICAgYXJyKVxyXG4gICAgICAgIC50aGVuKCgpID0+IHsgcmVzb2x2ZSgpOyB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjYWxjdWxhdGU7XHJcbiIsImltcG9ydCBjYWxjdWxhdGUgZnJvbSAnLi9jYWxjdWxhdGUnO1xyXG5cclxuLyogU3BsaXQgcmVxdWVzdCB0byB0aHJlYWRzLCBhbmQgZGlzcGF0Y2ggdG8gXCJjYWxjdWxhdGVcIiBmdW5jdGlvbiAqL1xyXG5cclxuZnVuY3Rpb24gZGlzcGF0Y2goLi4udGhyZWFkcykge1xyXG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBpZiAodGhyZWFkcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgLy8gdGhyb3cgZXJyb3IsIGlmIHJlcXVlc3QgaXMgZW1wdHlcclxuICAgICAgICAgICAgcmVqZWN0KEVycm9yKCdBZGQgb2JqZWN0cyB0byBcInN0ZXBcIiBmdW5jdGlvbicpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBhcnIgPSBbXTtcclxuICAgICAgICAgICAgLy8gc2VuZCBhbGwgdGhyZWFkcyB0byBjYWxjdWxhdGlvblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRocmVhZHMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgICAgIGFyci5wdXNoKGNhbGN1bGF0ZSh0aHJlYWRzW2ldKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gYWZ0ZXIgYW5pbWF0aW9uIGNvbXBsZXRlZCwgcmVzb2x2ZSBwcm9taXNlIHRvIGxhdW5jaCBuZXh0IHNlcXVlbmNlXHJcbiAgICAgICAgICAgIFByb21pc2UuYWxsKGFycikudGhlbigoKSA9PiB7IHJlc29sdmUoKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcHJvbWlzZTtcclxufVxyXG5cclxuLy8gcmVuYW1lIGVsZW1lbnQgZm9yIGVhc2llciBhY2Nlc3NcclxuY29uc3Qgc3RlcCA9IGRpc3BhdGNoO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgc3RlcDtcclxuIiwiaW1wb3J0IHNldHRpbmdzIGZyb20gJy4uL3NldHRpbmdzJzsgLy8gaW1wb3J0IHNldHRpbmdzIGZvciBnZXR0aW5nIGFjY2VzcyB0byBTVkcgZWxlbWVudFxyXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMnOyAvLyBpbXBvcnQgdXRpbHMgZm9yIHV0aWxzLnVuZGVmXHJcblxyXG5jbGFzcyBPYmoge1xyXG4vKlxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUNPTlNUUlVDVE9SLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiovXHJcbiAgICBjb25zdHJ1Y3RvcihvYmosIHRyYW5zZm9ybSA9IHsgdHJhbnNsYXRlOiBbMCwgMF0sIHJvdGF0ZTogMCwgc2NhbGU6IDEgfSkge1xyXG4gICAgICAgIC8vIGFjY2VzcyB0byBET00gb2JqZWN0XHJcbiAgICAgICAgdGhpcy5vYmogPSBvYmo7XHJcbiAgICAgICAgLy8gY3JlYXRlIHplcm8gbWF0cml4XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXggPSBzZXR0aW5ncy5zdmcuY3JlYXRlU1ZHTWF0cml4KCk7XHJcbiAgICAgICAgLy8gc2V0IHN0YXJ0aW5nIHZhcmlhYmxlcywgYW5kIGRlY2xhcmUgdGhpcy5zdGFydGluZ1ZhcmlhYmxlcyBhbmQgdGhpcy52YXJpYWJsZXNcclxuICAgICAgICB0aGlzLnNldFN0YXJ0aW5nVmFyaWFibGVzKHRyYW5zZm9ybSk7XHJcbiAgICAgICAgLy8gc2V0IGluaXRpYWwgbWF0cml4XHJcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsTWF0cml4KCk7XHJcblxyXG4gICAgICAgIC8qIC0tLS0tLS0tIHNob3J0Y3V0cyAtLS0tLS0tLSAqL1xyXG5cclxuICAgICAgICAvLyB0byBtYXRyaXggaW50ZXJmYWNlIC0+IHRoaXMuU1ZHVHJhbnNmb3JtXHJcblxyXG4gICAgICAgIC8vIHRvIGN1cnJlbnQgdHJhbnNmb3JtXHJcbiAgICAgICAgdGhpcy50ciA9IHRoaXMudmFyaWFibGVzLmdldCgndHJhbnNmb3JtJyk7XHJcbiAgICB9XHJcblxyXG4vKlxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tSU5JVElBTElaSU5HIE1FVEhPRFMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiovXHJcblxyXG5cclxuICAgIHNldFN0YXJ0aW5nVmFyaWFibGVzKHRyYW5zZm9ybSkge1xyXG4gICAgICAgIGNvbnN0IG1hcCA9IG5ldyBNYXAoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub2JqLmF0dHJpYnV0ZXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub2JqLmF0dHJpYnV0ZXNbaV0uc3BlY2lmaWVkICYmIHRoaXMub2JqLmF0dHJpYnV0ZXNbaV0ubmFtZSAhPT0gJ3RyYW5zZm9ybScpIHtcclxuICAgICAgICAgICAgICAgIG1hcC5zZXQodGhpcy5vYmouYXR0cmlidXRlc1tpXS5uYW1lLCBwYXJzZUZsb2F0KHRoaXMub2JqLmF0dHJpYnV0ZXNbaV0udmFsdWUpIHx8IHRoaXMub2JqLmF0dHJpYnV0ZXNbaV0udmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RhcnRpbmdWYXJpYWJsZXMgPSBuZXcgTWFwKG1hcCk7XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMgPSBuZXcgTWFwKG1hcCk7XHJcblxyXG4gICAgICAgIC8vIHJlZmVyZW5jZSBzaGl0XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgW3RoaXMuc3RhcnRpbmdWYXJpYWJsZXMsIHRoaXMudmFyaWFibGVzXVtpXS5zZXQoJ3RyYW5zZm9ybScsIHtcclxuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZTogdXRpbHMudW5kZWYodHJhbnNmb3JtLnRyYW5zbGF0ZSkgPyBbMCwgMF0gOiB0cmFuc2Zvcm0udHJhbnNsYXRlLFxyXG4gICAgICAgICAgICAgICAgc2NhbGU6IHV0aWxzLnVuZGVmKHRyYW5zZm9ybS5zY2FsZSkgPyAxIDogdHJhbnNmb3JtLnNjYWxlLFxyXG4gICAgICAgICAgICAgICAgcm90YXRlOiB1dGlscy51bmRlZih0cmFuc2Zvcm0ucm90YXRlKSA/IDAgOiB0cmFuc2Zvcm0ucm90YXRlLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SW5pdGlhbE1hdHJpeCgpIHtcclxuICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSB0aGlzLnZhcmlhYmxlcy5nZXQoJ3RyYW5zZm9ybScpO1xyXG4gICAgICAgIHRoaXMub2JqLnRyYW5zZm9ybS5iYXNlVmFsLmluaXRpYWxpemUoc2V0dGluZ3Muc3ZnLmNyZWF0ZVNWR1RyYW5zZm9ybUZyb21NYXRyaXgodGhpcy5tYW5pcHVsYXRpb25NYXRyaXgpKTtcclxuICAgICAgICB0aGlzLlNWR1RyYW5zZm9ybSA9IHRoaXMub2JqLnRyYW5zZm9ybS5iYXNlVmFsLmdldEl0ZW0oMCk7XHJcbiAgICAgICAgdGhpcy5zY2FsZUFuZFJvdGF0ZUFuZFRyYW5zbGF0ZSh0cmFuc2Zvcm0uc2NhbGUsIHRyYW5zZm9ybS5yb3RhdGUsIHRyYW5zZm9ybS50cmFuc2xhdGVbMF0sIHRyYW5zZm9ybS50cmFuc2xhdGVbMV0pO1xyXG4gICAgfVxyXG5cclxuLypcclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLU9USEVSLU1FVEhPRFMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4qL1xyXG5cclxuICAgIHNldE1hdHJpeChtYXRyaXgpIHsgdGhpcy5TVkdUcmFuc2Zvcm0uc2V0TWF0cml4KG1hdHJpeCk7IH1cclxuXHJcbiAgICByZXNldCgpIHtcclxuICAgICAgICAvLyByZXNldCB2YXJpYWJsZXNcclxuICAgICAgICB0aGlzLnZhcmlhYmxlcyA9IG5ldyBNYXAodGhpcy5zdGFydGluZ1ZhcmlhYmxlcyk7XHJcbiAgICAgICAgLy8gcmVmZXJlbmNlIHNoaXRcclxuICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSB0aGlzLnN0YXJ0aW5nVmFyaWFibGVzLmdldCgndHJhbnNmb3JtJyk7XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMuc2V0KCd0cmFuc2Zvcm0nLCB7XHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZTogdHJhbnNmb3JtLnRyYW5zbGF0ZSxcclxuICAgICAgICAgICAgc2NhbGU6IHRyYW5zZm9ybS5zY2FsZSxcclxuICAgICAgICAgICAgcm90YXRlOiB0cmFuc2Zvcm0ucm90YXRlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudHIgPSB0aGlzLnZhcmlhYmxlcy5nZXQoJ3RyYW5zZm9ybScpO1xyXG5cclxuICAgICAgICBjb25zdCBvYmogPSB0aGlzLm9iajtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGFsbCBhdHRyaWJ1dGVzIGZyb20gZWxlbWVudCBET01cclxuICAgICAgICBmb3IgKGxldCBpID0gb2JqLmF0dHJpYnV0ZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpIC09IDEpIHtcclxuICAgICAgICAgICAgaWYgKG9iai5hdHRyaWJ1dGVzW2ldLm5hbWUgIT09ICd0cmFuc2Zvcm0nKSB7XHJcbiAgICAgICAgICAgICAgICBvYmoucmVtb3ZlQXR0cmlidXRlKG9iai5hdHRyaWJ1dGVzW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGFkZCBhbGwgc3RhcnRpbmcgYXR0cmlidXRlc1xyXG4gICAgICAgIGZ1bmN0aW9uIGFkZCh2YWx1ZSwga2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgIT09ICd0cmFuc2Zvcm0nKSB7XHJcbiAgICAgICAgICAgICAgICBvYmouc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudmFyaWFibGVzLmZvckVhY2goYWRkKTtcclxuXHJcblxyXG4gICAgICAgIC8vIHNldCBzdGFydGluZyB0cmFuc2Zvcm1cclxuICAgICAgICB0aGlzLnNldEluaXRpYWxNYXRyaXgoKTtcclxuICAgIH1cclxuXHJcbi8qXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUFOSU1BVElORy1NRVRIT0RTLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuKi9cclxuICAgIHRyYW5zbGF0ZSh4LCB5KSB7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZSA9IHg7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZiA9IHk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TWF0cml4KHRoaXMubWFuaXB1bGF0aW9uTWF0cml4KTtcclxuICAgIH1cclxuICAgIHJvdGF0ZShhbmdsZSkge1xyXG4gICAgICAgIGNvbnN0IHJhZGlhbnMgPSAoLWFuZ2xlICogTWF0aC5QSSkgLyAxODA7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguc2luKHJhZGlhbnMpICogdGhpcy50ci5zY2FsZTtcclxuICAgICAgICBjb25zdCBhID0gTWF0aC5jb3MocmFkaWFucykgKiB0aGlzLnRyLnNjYWxlO1xyXG5cclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5hID0gYTtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5iID0gLWM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYyA9IGM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZCA9IGE7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TWF0cml4KHRoaXMubWFuaXB1bGF0aW9uTWF0cml4KTtcclxuICAgIH1cclxuICAgIHNjYWxlKHMpIHtcclxuICAgICAgICBjb25zdCByYWRpYW5zID0gKC10aGlzLnRyLnJvdGF0ZSAqIE1hdGguUEkpIC8gMTgwO1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLnNpbihyYWRpYW5zKSAqIHM7XHJcbiAgICAgICAgY29uc3QgYSA9IE1hdGguY29zKHJhZGlhbnMpICogcztcclxuXHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYSA9IGE7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYiA9IC1jO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmMgPSBjO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmQgPSBhO1xyXG5cclxuICAgICAgICB0aGlzLnNldE1hdHJpeCh0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeCk7XHJcbiAgICB9XHJcbiAgICBzY2FsZUFuZFJvdGF0ZShzLCBhbmdsZSkge1xyXG4gICAgICAgIGNvbnN0IHJhZGlhbnMgPSAoLWFuZ2xlICogTWF0aC5QSSkgLyAxODA7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguc2luKHJhZGlhbnMpICogcztcclxuICAgICAgICBjb25zdCBhID0gTWF0aC5jb3MocmFkaWFucykgKiBzO1xyXG5cclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5hID0gYTtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5iID0gLWM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYyA9IGM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZCA9IGE7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TWF0cml4KHRoaXMubWFuaXB1bGF0aW9uTWF0cml4KTtcclxuICAgIH1cclxuICAgIHNjYWxlQW5kVHJhbnNsYXRlKHMsIHgsIHkpIHtcclxuICAgICAgICBjb25zdCByYWRpYW5zID0gKC10aGlzLnRyLnJvdGF0ZSAqIE1hdGguUEkpIC8gMTgwO1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLnNpbihyYWRpYW5zKSAqIHM7XHJcbiAgICAgICAgY29uc3QgYSA9IE1hdGguY29zKHJhZGlhbnMpICogcztcclxuXHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYSA9IGE7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYiA9IC1jO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmMgPSBjO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmQgPSBhO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmUgPSB4O1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmYgPSB5O1xyXG5cclxuICAgICAgICB0aGlzLnNldE1hdHJpeCh0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeCk7XHJcbiAgICB9XHJcbiAgICByb3RhdGVBbmRUcmFuc2xhdGUoYW5nbGUsIHgsIHkpIHtcclxuICAgICAgICBjb25zdCByYWRpYW5zID0gKC1hbmdsZSAqIE1hdGguUEkpIC8gMTgwO1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLnNpbihyYWRpYW5zKSAqIHRoaXMudHIuc2NhbGU7XHJcbiAgICAgICAgY29uc3QgYSA9IE1hdGguY29zKHJhZGlhbnMpICogdGhpcy50ci5zY2FsZTtcclxuXHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYSA9IGE7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYiA9IC1jO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmMgPSBjO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmQgPSBhO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmUgPSB4O1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmYgPSB5O1xyXG5cclxuICAgICAgICB0aGlzLnNldE1hdHJpeCh0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeCk7XHJcbiAgICB9XHJcbiAgICBzY2FsZUFuZFJvdGF0ZUFuZFRyYW5zbGF0ZShzLCBhbmdsZSwgeCwgeSkge1xyXG4gICAgICAgIGNvbnN0IHIgPSAoLWFuZ2xlICogTWF0aC5QSSkgLyAxODA7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguc2luKHIpICogcztcclxuICAgICAgICBjb25zdCBhID0gTWF0aC5jb3MocikgKiBzO1xyXG5cclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5hID0gYTtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5iID0gLWM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYyA9IGM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZCA9IGE7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZSA9IHg7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZiA9IHk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TWF0cml4KHRoaXMubWFuaXB1bGF0aW9uTWF0cml4KTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE9iajtcclxuIiwiY2xhc3MgU2xpZGUge31cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNsaWRlO1xyXG4iLCJpbXBvcnQgc3RlcCBmcm9tICcuL2VuZ2luZS9kaXNwYXRjaCc7XHJcbmltcG9ydCBPYmogZnJvbSAnLi9jbGFzc2VzL21haW4nO1xyXG5pbXBvcnQgU2xpZGUgZnJvbSAnLi9jbGFzc2VzL3NsaWRlJztcclxuaW1wb3J0IHsgYWRkU2xpZGVzLCBuZXh0IH0gZnJvbSAnLi9jb250cm9sL3BsYXllcic7XHJcblxyXG4vLyByb2xsdXAgc2hpdFxyXG4oKCkgPT4gW3N0ZXAsIE9iaiwgU2xpZGUsIGFkZFNsaWRlcywgbmV4dF0pKCk7XHJcbiJdLCJuYW1lcyI6WyJwYXVzZVRvUmVsb2FkIiwicGxheVRvUGF1c2UiLCJyZWxvYWRUb1BsYXkiLCJwYXVzZVRvUGxheSJdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxRQUFRLEdBQUc7SUFDYixHQUFHLEVBQUUsUUFBUSxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QyxLQUFLLEVBQUUsS0FBSztJQUNaLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztDQUNyQyxDQUFDLEFBRUYsQUFBd0I7O0FDSnhCOztBQUVBLFNBQVMsYUFBYSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUU7SUFDOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNwQyxH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Q0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUNqRyxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3JHLENBQUMsQ0FBQyxDQUFDO1lBQ0gsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ25DLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ2pHLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7bUJBQzlGLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLEdBQUcsRUFBRSxDQUFDO21CQUN0QyxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUM3QyxDQUFDLENBQUMsQ0FBQztZQUNILEtBQUssSUFBSSxDQUFDLENBQUM7WUFDWCxNQUFNLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDekM7S0FDSjtJQUNELE9BQU8sRUFBRSxDQUFDO0NBQ2I7Ozs7QUFJRCxTQUFTLG9CQUFvQixHQUFHO0lBQzVCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNkLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQzs7SUFFaEIsU0FBUyxVQUFVLEdBQUc7UUFDbEIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ1osTUFBTSxJQUFJLENBQUMsQ0FBQztZQUNaLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM1QyxNQUFNO1lBQ0gsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLHFCQUFxQixDQUFDLENBQUM7WUFDeEQsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLHFCQUFxQixDQUFDLENBQUM7U0FDM0Q7S0FDSjs7SUFFRCxTQUFTLE9BQU8sR0FBRztRQUNmLElBQUksS0FBSyxJQUFJLEVBQUUsRUFBRTtZQUNiLEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNuQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEtBQUssR0FBRyxFQUFFLENBQUM7bUJBQ3BGLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUN2RCxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUN6RyxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDN0YsQ0FBQyxDQUFDLENBQUM7WUFDSCxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDbkMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDekcsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxLQUFLLEdBQUcsRUFBRSxDQUFDO2lCQUN4RixFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEtBQUssR0FBRyxFQUFFLENBQUM7bUJBQ3ZGLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQzNELENBQUMsQ0FBQyxDQUFDO1lBQ0gsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUNYLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN6QyxNQUFNO1lBQ0gsVUFBVSxFQUFFLENBQUM7U0FDaEI7S0FDSjtJQUNELE9BQU8sRUFBRSxDQUFDO0NBQ2I7Ozs7QUFJRCxTQUFTLG1CQUFtQixHQUFHO0lBQzNCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNkLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQzs7SUFFZixTQUFTLE9BQU8sR0FBRztRQUNmLElBQUksS0FBSyxJQUFJLEVBQUUsRUFBRTtZQUNiLEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNuQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEtBQUssR0FBRyxFQUFFLENBQUM7bUJBQ3BGLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUN2RCxFQUFFLEVBQUUsR0FBRyxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ3pGLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDN0csQ0FBQyxDQUFDLENBQUM7WUFDSCxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDbkMsRUFBRSxFQUFFLEdBQUcsS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUs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RSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3RDLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM1RjtLQUNKOztJQUVELFNBQVMsVUFBVSxHQUFHO1FBQ2xCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdEMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyRCxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3JEO0tBQ0o7O0lBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUMzRCxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDOztRQUVsRixLQUFLLElBQUksQ0FBQyxHQUFHLENB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