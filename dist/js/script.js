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

function next() {
    if (currentSlide + 1 >= slides.length) {
        status = 'finished';
        animatePauseToReload();
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
        const delta0 = targetTransform.translate[0] - startingTransform.translate[0];
        const delta1 = targetTransform.translate[1] - startingTransform.translate[1];

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
    const attributes = el.attributes;
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
    if (!utils.undef(attributes) && attributes.length !== 0) {
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

/* Specify functions used to animations, and send them to animate function */

function calculate(el) {
    // declare array of animation functions
    const arr = [];
    return new Promise((resolve) => {
        // Set function for every object
        for (let i = 0; i < el.objects.length; i += 1) {
            const requestObject = el.objects[i];

            // define transform animation function, if transform animation is requested
            const calculatedTransform = calculateTransform(requestObject);
            if (calculatedTransform) { arr.push([calculatedTransform]); }

            // define attribute animation function, if attribute animation is requested
            const calculatedAttributes = calculateAttributes(requestObject);
            if (calculatedAttributes) { arr.push([calculatedAttributes]); }

            // add objects to objects set in player.js. Needed for reseting
            addObjects(el.objects[i].object);
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
    return new Promise((resolve, reject) => {
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
        const radians = (this.tr.rotate * Math.PI) / 180;
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
        const radians = (this.tr.rotate * Math.PI) / 180;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIkQ6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvc2V0dGluZ3MuanMiLCJEOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2VuZ2luZS9hbmltYXRlLmpzIiwiRDovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy9jb250cm9sL2J1dHRvbnMuanMiLCJEOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2NvbnRyb2wvcGxheWVyLmpzIiwiRDovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy91dGlscy5qcyIsIkQ6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvZW5naW5lL2NhbGN1bGF0aW9ucy90cmFuc2Zvcm0uanMiLCJEOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2VuZ2luZS9jYWxjdWxhdGlvbnMvYXR0cmlidXRlLmpzIiwiRDovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy9lbmdpbmUvY2FsY3VsYXRlLmpzIiwiRDovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy9lbmdpbmUvZGlzcGF0Y2guanMiLCJEOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2NsYXNzZXMvbWFpbi5qcyIsIkQ6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvY2xhc3Nlcy9zbGlkZS5qcyIsIkQ6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgc2V0dGluZ3MgPSB7XHJcbiAgICBzdmc6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzdmcnKVswXSwgICAvLyBzdmcgZWxlbWVudFxyXG4gICAgc3BlZWQ6IDAuMDI1LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYmFzZSBhbmltYXRpb24gc3BlZWRcclxuICAgIGVhc2luZzogdCA9PiB0ICogdCAqICgzIC0gKDIgKiB0KSksICAgICAgICAgICAgIC8vIGVhc2luZyBmdW5jdGlvblxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgc2V0dGluZ3M7XHJcbiIsImltcG9ydCBzZXR0aW5ncyBmcm9tICcuLi9zZXR0aW5ncyc7XHJcblxyXG4vKiBBbmltYXRlIHByZWRlZmluZWQgZnVuY3Rpb25zLCB0aGVuIHVwZGF0ZSB2YXJpYWJsZXMgKi9cclxuXHJcbmZ1bmN0aW9uIGFuaW1hdGVPYmplY3QoYXJyLCBlYXNlKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGFycltpXVswXShlYXNlKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB1cGRhdGVPYmplY3QoYXJyKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGFycltpXVsxXSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBtYWluIGFuaW1hdGlvbiBmdW5jdGlvblxyXG5mdW5jdGlvbiBhbmltYXRlKHMsIGQsIGFycikge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgbGV0IHQgPSAwO1xyXG4gICAgICAgIGxldCBlYXNlO1xyXG4gICAgICAgIGNvbnN0IHNwZWVkID0gc2V0dGluZ3Muc3BlZWQgKiBzID4gMCA/IHNldHRpbmdzLnNwZWVkICogcyA6IDAuMDI1O1xyXG4gICAgICAgIGlmIChzID09PSAwKSB7IHQgPSAxOyB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0IDwgMSkge1xyXG4gICAgICAgICAgICAgICAgdCArPSBzcGVlZDtcclxuICAgICAgICAgICAgICAgIGVhc2UgPSBzZXR0aW5ncy5lYXNpbmcodCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGVPYmplY3QoYXJyW2ldLCBlYXNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iamVjdChhcnJbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KHN0ZXAsIGQpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFuaW1hdGU7XHJcbiIsImltcG9ydCBzZXR0aW5ncyBmcm9tICcuLi9zZXR0aW5ncyc7XHJcblxyXG4vKlxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1DUkVBVEUtRUxFTUVOVFMtT0YtSU5URVJGQUNFLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiovXHJcblxyXG4vLyBkZWNsYXJlIHZhcmlhYmxlc1xyXG5cclxuY29uc3QgaWNvbnMgPSB7XHJcbiAgICBncm91cDogbnVsbCxcclxuICAgIHBvbHlnb24xOiBudWxsLFxyXG4gICAgcG9seWdvbjI6IG51bGwsXHJcbiAgICBhcmMxOiBudWxsLFxyXG4gICAgYXJjMjogbnVsbCxcclxuICAgIHJlY3Q6IG51bGwsXHJcbn07XHJcblxyXG4vLyBjcmVhdGUgaWNvbnNcclxuXHJcbmNvbnN0IHhtbG5zID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcclxuaWNvbnMuZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoeG1sbnMsICdnJyk7XHJcblxyXG5pY29ucy5hcmMxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHhtbG5zLCAncGF0aCcpO1xyXG5pY29ucy5hcmMxLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgJ00xMCwyMCBBMTAsMTAgMCAwLDEgMjAsMTAnKTtcclxuaWNvbnMuZ3JvdXAuYXBwZW5kQ2hpbGQoaWNvbnMuYXJjMSk7XHJcblxyXG5pY29ucy5hcmMyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHhtbG5zLCAncGF0aCcpO1xyXG5pY29ucy5hcmMyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgJ00zMCwyMCBBMTAsMTAgMCAwLDEgMjAsMzAnKTtcclxuaWNvbnMuZ3JvdXAuYXBwZW5kQ2hpbGQoaWNvbnMuYXJjMik7XHJcblxyXG5pY29ucy5wb2x5Z29uMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh4bWxucywgJ3BvbHlnb24nKTtcclxuaWNvbnMucG9seWdvbjEuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3BvaW50cycsICcxMCwxMCAxMCwzMCAyMCwyNSAyMCwxNScpO1xyXG5pY29ucy5ncm91cC5hcHBlbmRDaGlsZChpY29ucy5wb2x5Z29uMSk7XHJcblxyXG5pY29ucy5wb2x5Z29uMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh4bWxucywgJ3BvbHlnb24nKTtcclxuaWNvbnMucG9seWdvbjIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3BvaW50cycsICcyMCwyNSAyMCwxNSAzMCwyMCAzMCwyMCcpO1xyXG5pY29ucy5ncm91cC5hcHBlbmRDaGlsZChpY29ucy5wb2x5Z29uMik7XHJcblxyXG5pY29ucy5yZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHhtbG5zLCAncmVjdCcpO1xyXG5pY29ucy5yZWN0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgMCk7XHJcbmljb25zLnJlY3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCAwKTtcclxuaWNvbnMucmVjdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCA0MCk7XHJcbmljb25zLnJlY3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIDQwKTtcclxuaWNvbnMuZ3JvdXAuYXBwZW5kQ2hpbGQoaWNvbnMucmVjdCk7XHJcblxyXG4vLyBhZGQgc3R5bGUgdG8gaW50ZXJmYWNlXHJcblxyXG5jb25zdCBjc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N0eWxlJyk7XHJcbmNzcy50ZXh0Q29udGVudCA9ICcjY29udHJvbCA+IHJlY3Qge29wYWNpdHk6IDA7IGN1cnNvcjogcG9pbnRlcjt9ICNjb250cm9sID4gcGF0aCB7c3Ryb2tlOiMwMDA7IGZpbGw6bm9uZTsgc3Ryb2tlLXdpZHRoOiAycHg7IHN0cm9rZS1kYXNoYXJyYXk6IDE2cHg7IHN0cm9rZS1kYXNob2Zmc2V0OiAxNnB4fSc7XHJcblxyXG5cclxubGV0IGRlZnMgPSBzZXR0aW5ncy5zdmcuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RlZnMnKVswXTtcclxuLy8gY2hlY2sgaWYgZGVmcyBlbGVtZW50IGlzIGFscmVhZHkgZGVjbGFyZWQuIElmIG5vdCwgYWRkIGl0IHRvIERPTVxyXG5pZiAoIWRlZnMpIHtcclxuICAgIGRlZnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkZWZzJyk7XHJcbiAgICBzZXR0aW5ncy5zdmcuaW5zZXJ0QmVmb3JlKGRlZnMsIHNldHRpbmdzLnN2Zy5maXJzdENoaWxkKTtcclxufVxyXG5kZWZzLmFwcGVuZENoaWxkKGNzcyk7XHJcblxyXG4vLyBzZXQgaW50ZXJmYWNlIHRvIGNvcnJlY3QgcG9zaXRpb25cclxuY29uc3Qgdmlld0JveCA9IHNldHRpbmdzLnN2Zy52aWV3Qm94LmJhc2VWYWw7XHJcbmNvbnN0IG1hdHJpeCA9IHNldHRpbmdzLnN2Zy5jcmVhdGVTVkdNYXRyaXgoKTtcclxubWF0cml4LmUgPSB2aWV3Qm94LnggKyAxMDtcclxubWF0cml4LmYgPSB2aWV3Qm94LnkgKyAodmlld0JveC5oZWlnaHQgLSA1MCk7XHJcbmljb25zLmdyb3VwLmlkID0gJ2NvbnRyb2wnO1xyXG5pY29ucy5ncm91cC50cmFuc2Zvcm0uYmFzZVZhbC5pbml0aWFsaXplKHNldHRpbmdzLnN2Zy5jcmVhdGVTVkdUcmFuc2Zvcm1Gcm9tTWF0cml4KG1hdHJpeCkpO1xyXG5cclxuXHJcbi8vIGFkZCBpbnRlcmZhY2UgdG8gRE9NXHJcblxyXG5zZXR0aW5ncy5zdmcuYXBwZW5kQ2hpbGQoaWNvbnMuZ3JvdXApO1xyXG5cclxuXHJcbi8vIGFkZCBldmVudCBsaXN0ZW5lcnMgdG8gZWxlbWVudHMgb2YgaW50ZXJmYWNlLCBhbmQgc2V0IGV2ZW50IHByb3BhZ2F0aW9uXHJcblxyXG5jb25zdCBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG5ldmVudC5pbml0RXZlbnQoJ2J1dHRvbi1jbGljaycsIHRydWUsIHRydWUpO1xyXG5pY29ucy5yZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyBzZXR0aW5ncy5zdmcuZGlzcGF0Y2hFdmVudChldmVudCk7IH0pO1xyXG5cclxuXHJcbi8qXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1JTlRFUkZBQ0UtQU5JTUFUSU9OUy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuKi9cclxuXHJcbi8vIGFuaW1hdGlvbiAtIHBsYXkgLT4gcGF1c2VcclxuXHJcbmZ1bmN0aW9uIGFuaW1hdGVQbGF5VG9QYXVzZSgpIHtcclxuICAgIGxldCBzdGVwcyA9IDE7XHJcblxyXG4gICAgZnVuY3Rpb24gYW5pbWF0ZSgpIHtcclxuICAgICAgICBpZiAoc3RlcHMgPD0gMTApIHtcclxuICAgICAgICAgICAgaWNvbnMucG9seWdvbjEuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBgXHJcbiAgICAgICAgICAgIDEwLDEwIFxyXG4gICAgICAgICAgICAxMCwzMCBcclxuICAgICAgICAgICAgJHsyMCAtIChzdGVwcyAvIDUpID4gMTggPyAyMCAtIChzdGVwcyAvIDUpIDogMTh9LCR7MjUgKyAoc3RlcHMgLyAyKSA8IDMwID8gMjUgKyAoc3RlcHMgLyAyKSA6IDMwfSBcclxuICAgICAgICAgICAgJHsyMCAtIChzdGVwcyAvIDUpID4gMTggPyAyMCAtIChzdGVwcyAvIDUpIDogMTh9LCR7MTUgLSAoc3RlcHMgLyAyKSA+IDEwID8gMTUgLSAoc3RlcHMgLyAyKSA6IDEwfVxyXG4gICAgICAgICAgICBgKTtcclxuICAgICAgICAgICAgaWNvbnMucG9seWdvbjIuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBgXHJcbiAgICAgICAgICAgICR7MjAgKyAoc3RlcHMgLyA1KSA8IDIyID8gMjAgKyAoc3RlcHMgLyA1KSA6IDIyfSwkezE1IC0gKHN0ZXBzIC8gMikgPiAxMCA/IDE1IC0gKHN0ZXBzIC8gMikgOiAxMH0gXHJcbiAgICAgICAgICAgICR7MjAgKyAoc3RlcHMgLyA1KSA8IDIyID8gMjAgKyAoc3RlcHMgLyA1KSA6IDIyfSwgJHsyNSArIChzdGVwcyAvIDIpIDwgMzAgPyAyNSArIChzdGVwcyAvIDIpIDogMzB9IFxyXG4gICAgICAgICAgICAzMCwkezIwICsgc3RlcHMgPCAzMCA/IDIwICsgc3RlcHMgOiAzMH0gXHJcbiAgICAgICAgICAgIDMwLCR7MjAgLSBzdGVwcyA+IDEwID8gMjAgLSBzdGVwcyA6IDEwfVxyXG4gICAgICAgICAgICBgKTtcclxuICAgICAgICAgICAgc3RlcHMgKz0gMTtcclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhbmltYXRlKCk7XHJcbn1cclxuXHJcbi8vIGFuaW1hdGlvbiAtIHBhdXNlIC0+IHBsYXlcclxuXHJcbmZ1bmN0aW9uIGFuaW1hdGVQYXVzZVRvUGxheSgpIHtcclxuICAgIGxldCBzdGVwcyA9IDE7XHJcblxyXG4gICAgZnVuY3Rpb24gYW5pbWF0ZSgpIHtcclxuICAgICAgICBpZiAoc3RlcHMgPD0gMTApIHtcclxuICAgICAgICAgICAgaWNvbnMucG9seWdvbjEuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBgXHJcbiAgICAgICAgICAgICAgICAxMCwxMCBcclxuICAgICAgICAgICAgICAgIDEwLDMwIFxyXG4gICAgICAgICAgICAgICAgJHsxOCArIChzdGVwcyAvIDUpIDwgMjAgPyAxOCArIChzdGVwcyAvIDUpIDogMjB9LCR7MzAgLSAoc3RlcHMgLyAyKSA+IDI1ID8gMzAgLSAoc3RlcHMgLyAyKSA6IDI1fSBcclxuICAgICAgICAgICAgICAgICR7MTggKyAoc3RlcHMgLyA1KSA8IDIwID8gMTggKyAoc3RlcHMgLyA1KSA6IDIwfSwkezEwICsgKHN0ZXBzIC8gMikgPCAxNSA/IDEwICsgKHN0ZXBzIC8gMikgOiAxNX1cclxuICAgICAgICAgICAgYCk7XHJcbiAgICAgICAgICAgIGljb25zLnBvbHlnb24yLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgYFxyXG4gICAgICAgICAgICAgICAgJHsyMiAtIChzdGVwcyAvIDUpID4gMjAgPyAyMiAtIChzdGVwcyAvIDUpIDogMjB9LCR7MTAgKyAoc3RlcHMgLyAyKSA8IDE1ID8gMTAgKyAoc3RlcHMgLyAyKSA6IDE1fSBcclxuICAgICAgICAgICAgICAgICR7MjIgLSAoc3RlcHMgLyA1KSA+IDIwID8gMjIgLSAoc3RlcHMgLyA1KSA6IDIwfSwkezMwIC0gKHN0ZXBzIC8gMikgPiAyNSA/IDMwIC0gKHN0ZXBzIC8gMikgOiAyNX0gXHJcbiAgICAgICAgICAgICAgICAzMCwkezMwIC0gKHN0ZXBzID4gMjApID8gMzAgLSBzdGVwcyA6IDIwfSBcclxuICAgICAgICAgICAgICAgIDMwLCR7MTAgKyAoc3RlcHMgPCAyMCkgPyAxMCArIHN0ZXBzIDogMjB9XHJcbiAgICAgICAgICAgIGApO1xyXG4gICAgICAgICAgICBzdGVwcyArPSAxO1xyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFuaW1hdGUoKTtcclxufVxyXG5cclxuLy8gYW5pbWF0aW9uIC0gcGF1c2UgLT4gcmVsb2FkXHJcblxyXG5mdW5jdGlvbiBhbmltYXRlUGF1c2VUb1JlbG9hZCgpIHtcclxuICAgIGxldCBzdGVwcyA9IDE7XHJcbiAgICBsZXQgb2Zmc2V0ID0gMTY7XHJcblxyXG4gICAgZnVuY3Rpb24gYW5pbWF0ZUFyYygpIHtcclxuICAgICAgICBpZiAob2Zmc2V0ID4gMCkge1xyXG4gICAgICAgICAgICBvZmZzZXQgLT0gMTtcclxuICAgICAgICAgICAgaWNvbnMuYXJjMS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYHN0cm9rZS1kYXNob2Zmc2V0OiR7b2Zmc2V0fXB4YCk7XHJcbiAgICAgICAgICAgIGljb25zLmFyYzIuc2V0QXR0cmlidXRlKCdzdHlsZScsIGBzdHJva2UtZGFzaG9mZnNldDoke29mZnNldH1weGApO1xyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGVBcmMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGljb25zLmFyYzEuc2V0QXR0cmlidXRlKCdzdHlsZScsICdzdHJva2UtZGFzaG9mZnNldDowJyk7XHJcbiAgICAgICAgICAgIGljb25zLmFyYzIuc2V0QXR0cmlidXRlKCdzdHlsZScsICdzdHJva2UtZGFzaG9mZnNldDowJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFuaW1hdGUoKSB7XHJcbiAgICAgICAgaWYgKHN0ZXBzIDw9IDEwKSB7XHJcbiAgICAgICAgICAgIGljb25zLnBvbHlnb24xLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgYFxyXG4gICAgICAgICAgICAgICAgJHsxMCAtIChzdGVwcyAqIDAuNCkgPiA2ID8gMTAgLSAoc3RlcHMgKiAwLjQpIDogNn0sJHsxMCArIHN0ZXBzIDwgMjAgPyAxMCArIHN0ZXBzIDogMjB9IFxyXG4gICAgICAgICAgICAgICAgMTAsJHszMCAtIChzdGVwcyAqIDAuNCkgPiAyNiA/IDMwIC0gKHN0ZXBzICogMC40KSA6IDI2fSBcclxuICAgICAgICAgICAgICAgICR7MTggLSAoc3RlcHMgKiAwLjgpID4gMTAgPyAxOCAtIChzdGVwcyAqIDAuOCkgOiAxMH0sJHszMCAtIChzdGVwcyAqIDAuNCkgPiAyNiA/IDMwIC0gKHN0ZXBzICogMC40KSA6IDI2fSBcclxuICAgICAgICAgICAgICAgICR7MTggLSAoc3RlcHMgKiAwLjQpID4gMTQgPyAxOCAtIChzdGVwcyAqIDAuNCkgOiAxNH0sJHsxMCArIHN0ZXBzIDwgMjAgPyAxMCArIHN0ZXBzIDogMjB9XHJcbiAgICAgICAgICAgIGApO1xyXG4gICAgICAgICAgICBpY29ucy5wb2x5Z29uMi5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsIGBcclxuICAgICAgICAgICAgICAgICR7MjIgKyAoc3RlcHMgKiAwLjgpIDwgMzAgPyAyMiArIChzdGVwcyAqIDAuOCkgOiAzMH0sJHsxMCArIChzdGVwcyAqIDAuNCkgPCAxNCA/IDEwICsgKHN0ZXBzICogMC40KSA6IDE0fSBcclxuICAgICAgICAgICAgICAgICR7MjIgKyAoc3RlcHMgKiAwLjQpIDwgMjYgPyAyMiArIChzdGVwcyAqIDAuNCkgOiAyNn0sJHszMCAtIHN0ZXBzID4gMjAgPyAzMCAtIHN0ZXBzIDogMjB9IFxyXG4gICAgICAgICAgICAgICAgICR7MzAgKyAoc3RlcHMgKiAwLjQpIDwgMzQgPyAzMCArIChzdGVwcyAqIDAuNCkgOiAzNH0sJHszMCAtIHN0ZXBzID4gMjAgPyAzMCAtIHN0ZXBzIDogMjB9IFxyXG4gICAgICAgICAgICAgICAgMzAsJHsxMCArIChzdGVwcyAqIDAuNCkgPCAxNCA/IDEwICsgKHN0ZXBzICogMC40KSA6IDE0fVxyXG4gICAgICAgICAgICBgKTtcclxuICAgICAgICAgICAgc3RlcHMgKz0gMTtcclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhbmltYXRlQXJjKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYW5pbWF0ZSgpO1xyXG59XHJcblxyXG4vLyBhbmltYXRpb24gLSByZWxvYWQgLT4gcGxheVxyXG5cclxuZnVuY3Rpb24gYW5pbWF0ZVJlbG9hZFRvUGxheSgpIHtcclxuICAgIGxldCBzdGVwcyA9IDE7XHJcbiAgICBsZXQgb2Zmc2V0ID0gMDtcclxuXHJcbiAgICBmdW5jdGlvbiBhbmltYXRlKCkge1xyXG4gICAgICAgIGlmIChzdGVwcyA8PSAxMCkge1xyXG4gICAgICAgICAgICBpY29ucy5wb2x5Z29uMS5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsIGBcclxuICAgICAgICAgICAgICAgICR7NiArIChzdGVwcyAqIDAuNCkgPCAxMCA/IDYgKyAoc3RlcHMgKiAwLjQpIDogMTB9LCR7MjAgLSBzdGVwcyA+IDEwID8gMjAgLSBzdGVwcyA6IDEwfSBcclxuICAgICAgICAgICAgICAgIDEwLCR7MjYgKyAoc3RlcHMgKiAwLjQpIDwgMzAgPyAyNiArIChzdGVwcyAqIDAuNCkgOiAzMH0gXHJcbiAgICAgICAgICAgICAgICAkezEwICsgc3RlcHMgPCAyMCA/IDEwICsgc3RlcHMgOiAyMH0sJHsyNiAtIChzdGVwcyAqIDAuMSkgPiAyNSA/IDI2IC0gKHN0ZXBzICogMC4xKSA6IDI1fSBcclxuICAgICAgICAgICAgICAgICR7MTQgKyAoc3RlcHMgKiAwLjYpIDwgMjAgPyAxNCArIChzdGVwcyAqIDAuNikgOiAyMH0sJHsyMCAtIChzdGVwcyAqIDAuNSkgPiAxNSA/IDIwIC0gKHN0ZXBzICogMC41KSA6IDE1fVxyXG4gICAgICAgICAgICBgKTtcclxuICAgICAgICAgICAgaWNvbnMucG9seWdvbjIuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBgXHJcbiAgICAgICAgICAgICAgICAkezMwIC0gc3RlcHMgPiAyMCA/IDMwIC0gc3RlcHMgOiAyMH0sJHsxNCArIChzdGVwcyAqIDAuMSkgPCAxNSA/IDE0ICsgKHN0ZXBzICogMC4xKSA6IDE1fSBcclxuICAgICAgICAgICAgICAgICR7MjYgLSAoc3RlcHMgKiAwLjYpID4gMjAgPyAyNiAtIChzdGVwcyAqIDAuNikgOiAyMH0sJHsyMCArIChzdGVwcyAqIDAuNSkgPCAyNSA/IDIwICsgKHN0ZXBzICogMC41KSA6IDI1fSBcclxuICAgICAgICAgICAgICAgICR7MzQgLSAoc3RlcHMgKiAwLjQpID4gMzAgPyAzNCAtIChzdGVwcyAqIDAuNCkgOiAzMH0sMjAgXHJcbiAgICAgICAgICAgICAgICAzMCwkezE0ICsgKHN0ZXBzICogMC42KSA8IDIwID8gMTQgKyAoc3RlcHMgKiAwLjYpIDogMjB9XHJcbiAgICAgICAgICAgIGApO1xyXG4gICAgICAgICAgICBzdGVwcyArPSAxO1xyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhbmltYXRlQXJjKCkge1xyXG4gICAgICAgIGlmIChvZmZzZXQgPCAxNikge1xyXG4gICAgICAgICAgICBvZmZzZXQgKz0gMTtcclxuICAgICAgICAgICAgaWNvbnMuYXJjMS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYHN0cm9rZS1kYXNob2Zmc2V0OiR7b2Zmc2V0fXB4YCk7XHJcbiAgICAgICAgICAgIGljb25zLmFyYzIuc2V0QXR0cmlidXRlKCdzdHlsZScsIGBzdHJva2UtZGFzaG9mZnNldDoke29mZnNldH1gKTtcclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlQXJjKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpY29ucy5hcmMxLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcclxuICAgICAgICAgICAgaWNvbnMuYXJjMi5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XHJcbiAgICAgICAgICAgIGFuaW1hdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhbmltYXRlQXJjKCk7XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBhbmltYXRlUGxheVRvUGF1c2UgYXMgcGxheVRvUGF1c2UsXHJcbiAgICBhbmltYXRlUGF1c2VUb1BsYXkgYXMgcGF1c2VUb1BsYXksXHJcbiAgICBhbmltYXRlUGF1c2VUb1JlbG9hZCBhcyBwYXVzZVRvUmVsb2FkLFxyXG4gICAgYW5pbWF0ZVJlbG9hZFRvUGxheSBhcyByZWxvYWRUb1BsYXksXHJcbn07XHJcbiIsImltcG9ydCB7IHBsYXlUb1BhdXNlLCBwYXVzZVRvUGxheSwgcGF1c2VUb1JlbG9hZCwgcmVsb2FkVG9QbGF5IH0gZnJvbSAnLi9idXR0b25zJztcclxuXHJcbi8qIFBsYXllciBzdGFydHMsIHN0b3BzLCByZXN1bWVzIG9yIHJlbG9hZHMgc2xpZGUgc2hvdyAqL1xyXG5cclxuLy8gYXJyYXkgb2YgYWxsIHNsaWRlc1xyXG5jb25zdCBzbGlkZXMgPSBbXTtcclxuLy8gc2V0IG9mIGFsbCBlbGVtZW50cyB1c2VkIGluIGFuaW1hdGlvbnMuIE5lZWRlZCBmb3IgcmVzdGFydGluZywgc2V0dGluZyBlbGVtZW50cyB0byBzdGFydGluZyBwb3NpdGlvbnNcclxuY29uc3Qgb2JqZWN0TGlzdCA9IG5ldyBTZXQoKTtcclxubGV0IGN1cnJlbnRTbGlkZSA9IDA7XHJcbmxldCBzdGF0dXMgPSAnbm90IHN0YXJ0ZWQnO1xyXG5cclxuZnVuY3Rpb24gc3RhcnQoKSB7XHJcbiAgICBjdXJyZW50U2xpZGUgPSAwO1xyXG4gICAgc2xpZGVzW2N1cnJlbnRTbGlkZV0ucGxheSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXNldCgpIHtcclxuICAgIG9iamVjdExpc3QuZm9yRWFjaCgoZWwpID0+IHsgZWwucmVzZXQoKTsgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc3VtZSgpIHtcclxuICAgIGlmIChjdXJyZW50U2xpZGUgKyAxID49IHNsaWRlcy5sZW5ndGgpIHtcclxuICAgICAgICBzdGF0dXMgPSAnZmluaXNoZWQnO1xyXG4gICAgICAgIHBhdXNlVG9SZWxvYWQoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY3VycmVudFNsaWRlICs9IDE7XHJcbiAgICAgICAgc2xpZGVzW2N1cnJlbnRTbGlkZV0ucGxheSgpO1xyXG4gICAgICAgIHBsYXlUb1BhdXNlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbnRyb2xQbGF5ZXIoKSB7XHJcbiAgICBpZiAoc2xpZGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gc2xpZGVzIHRvIGFuaW1hdGUuIEFkZCBzbGlkZXMgdXNpbmcgXCJhZGRTbGlkZXNcIiBmdW5jdGlvbi4nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc3RhdHVzID09PSAnZmluaXNoZWQnKSB7XHJcbiAgICAgICAgc3RhdHVzID0gJ25vdCBzdGFydGVkJztcclxuICAgICAgICByZXNldCgpO1xyXG4gICAgICAgIHJlbG9hZFRvUGxheSgpO1xyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09ICdwbGF5aW5nJykge1xyXG4gICAgICAgIHN0YXR1cyA9ICdwYXVzZWQnO1xyXG4gICAgICAgIHBhdXNlVG9QbGF5KCk7XHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gJ3BhdXNlZCcpIHtcclxuICAgICAgICBzdGF0dXMgPSAncGxheWluZyc7XHJcbiAgICAgICAgcmVzdW1lKCk7XHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gJ25vdCBzdGFydGVkJykge1xyXG4gICAgICAgIHN0YXR1cyA9ICdwbGF5aW5nJztcclxuICAgICAgICBzdGFydCgpO1xyXG4gICAgICAgIHBsYXlUb1BhdXNlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5leHQoKSB7XHJcbiAgICBpZiAoY3VycmVudFNsaWRlICsgMSA+PSBzbGlkZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgc3RhdHVzID0gJ2ZpbmlzaGVkJztcclxuICAgICAgICBwYXVzZVRvUmVsb2FkKCk7XHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gJ3BhdXNlZCcpIHtcclxuICAgICAgICBjdXJyZW50U2xpZGUgKz0gMTtcclxuICAgICAgICBzbGlkZXNbY3VycmVudFNsaWRlXS5wbGF5KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFNsaWRlcyguLi5zbGlkZSkge1xyXG4gICAgc2xpZGVzLnB1c2goLi4uc2xpZGUpO1xyXG59XHJcbmZ1bmN0aW9uIGFkZE9iamVjdHMob2JqZWN0KSB7XHJcbiAgICBvYmplY3RMaXN0LmFkZChvYmplY3QpO1xyXG59XHJcblxyXG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uLWNsaWNrJywgY29udHJvbFBsYXllciwgZmFsc2UpO1xyXG5cclxuZXhwb3J0IHsgYWRkU2xpZGVzLCBhZGRPYmplY3RzLCBuZXh0IH07XHJcblxyXG4iLCJjb25zdCB1dGlscyA9IHtcclxuICAgIHVuZGVmOiBpdGVtID0+ICh0eXBlb2YgaXRlbSA9PT0gJ3VuZGVmaW5lZCcpLCAgIC8vIGNoZWNrIGlmIGFyZ3VtZW50IGlzIHVuZGVmaW5lZFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgdXRpbHM7XHJcbiIsImltcG9ydCB1dGlscyBmcm9tICcuLy4uLy4uL3V0aWxzJztcclxuXHJcbi8qIERlZmluZSBtb3N0IGVmZmljaWVudCBmdW5jdGlvbiB1c2VkIHRvIGFuaW1hdGUgdHJhbnNmb3JtIHByb3BlcnR5LCB0aGVuIGFkZCBpdCB0byBhcnJheSBvZiBmdW5jdGlvbnMgZm9yIGFuaW1hdGlvbiAqL1xyXG5cclxuZnVuY3Rpb24gY2FsY3VsYXRlVHJhbnNmb3JtKGVsKSB7XHJcbiAgICBjb25zdCB0YXJnZXRUcmFuc2Zvcm0gPSBlbC50cmFuc2Zvcm07XHJcblxyXG4gICAgLy8gY2hlY2sgaWYgdHJhbnNmb3JtIGFuaW1hdGlvbiBpcyByZXF1ZXN0ZWRcclxuICAgIGlmICghdXRpbHMudW5kZWYodGFyZ2V0VHJhbnNmb3JtKSkge1xyXG4gICAgICAgIGxldCBhbmltYXRlRnVuYztcclxuICAgICAgICBsZXQgdXBkYXRlRnVuYztcclxuICAgICAgICBjb25zdCBvYmplY3QgPSBlbC5vYmplY3Q7XHJcbiAgICAgICAgY29uc3Qgc3RhcnRpbmdUcmFuc2Zvcm0gPSBlbC5vYmplY3QudHI7XHJcblxyXG4gICAgICAgIGNvbnN0IGRlbHRhU2NhbGUgPSB0YXJnZXRUcmFuc2Zvcm0uc2NhbGUgLSBzdGFydGluZ1RyYW5zZm9ybS5zY2FsZTtcclxuICAgICAgICBjb25zdCBkZWx0YVJvdGF0ZSA9IHRhcmdldFRyYW5zZm9ybS5yb3RhdGUgLSBzdGFydGluZ1RyYW5zZm9ybS5yb3RhdGU7XHJcbiAgICAgICAgY29uc3QgZGVsdGEwID0gdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVswXSAtIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZVswXTtcclxuICAgICAgICBjb25zdCBkZWx0YTEgPSB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlWzFdIC0gc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlWzFdO1xyXG5cclxuICAgICAgICAvKiAtLS0tLS0tLSB0cmFuc2Zvcm1zIHdpdGhvdXQgdHJhbnNsYXRpb24gLS0tLS0tLS0gKi9cclxuICAgICAgICBpZiAodXRpbHMudW5kZWYodGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZSkpIHtcclxuICAgICAgICAgICAgaWYgKHV0aWxzLnVuZGVmKHRhcmdldFRyYW5zZm9ybS5yb3RhdGUpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBvbmx5IHNjYWxpbmdcclxuICAgICAgICAgICAgICAgIGFuaW1hdGVGdW5jID0gKHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3Quc2NhbGUoc3RhcnRpbmdUcmFuc2Zvcm0uc2NhbGUgKyAoZGVsdGFTY2FsZSAqIHQpKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVGdW5jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5zY2FsZSh0YXJnZXRUcmFuc2Zvcm0uc2NhbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnNjYWxlID0gdGFyZ2V0VHJhbnNmb3JtLnNjYWxlO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh1dGlscy51bmRlZih0YXJnZXRUcmFuc2Zvcm0uc2NhbGUpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBvbmx5IHJvdGF0aW9uXHJcbiAgICAgICAgICAgICAgICBhbmltYXRlRnVuYyA9ICh0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnJvdGF0ZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0ucm90YXRlICsgKGRlbHRhUm90YXRlICogdCkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUZ1bmMgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnJvdGF0ZSh0YXJnZXRUcmFuc2Zvcm0ucm90YXRlKTtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5yb3RhdGUgPSB0YXJnZXRUcmFuc2Zvcm0ucm90YXRlO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIHNjYWxpbmcgYW5kIHJvdGF0aW5nXHJcbiAgICAgICAgICAgICAgICBhbmltYXRlRnVuYyA9ICh0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnNjYWxlQW5kUm90YXRlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5zY2FsZSArIChkZWx0YVNjYWxlICogdCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnJvdGF0ZSArIChkZWx0YVJvdGF0ZSAqIHQpKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVGdW5jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5zY2FsZUFuZFJvdGF0ZSh0YXJnZXRUcmFuc2Zvcm0uc2NhbGUsIHRhcmdldFRyYW5zZm9ybS5yb3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnNjYWxlID0gdGFyZ2V0VHJhbnNmb3JtLnNjYWxlO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnJvdGF0ZSA9IHRhcmdldFRyYW5zZm9ybS5yb3RhdGU7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgLyogLS0tLS0tLS0gdHJhbnNmb3JtcyB3aXRoIHRyYW5zbGF0aW9uIC0tLS0tLS0tICovXHJcbiAgICAgICAgfSBlbHNlIGlmICh1dGlscy51bmRlZih0YXJnZXRUcmFuc2Zvcm0uc2NhbGUpICYmIHV0aWxzLnVuZGVmKHRhcmdldFRyYW5zZm9ybS5yb3RhdGUpKSB7XHJcbiAgICAgICAgICAgIC8vIG9ubHkgdHJhbnNsYXRpb25cclxuICAgICAgICAgICAgYW5pbWF0ZUZ1bmMgPSAodCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LnRyYW5zbGF0ZShcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGVbMF0gKyAoZGVsdGEwICogdCksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlWzFdICsgKGRlbHRhMSAqIHQpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdXBkYXRlRnVuYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdC50cmFuc2xhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVswXSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlWzFdKTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZSA9IHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIGlmICh1dGlscy51bmRlZih0YXJnZXRUcmFuc2Zvcm0ucm90YXRlKSkge1xyXG4gICAgICAgICAgICAvLyBzY2FsZSBhbmQgdHJhbnNsYXRpb25cclxuICAgICAgICAgICAgYW5pbWF0ZUZ1bmMgPSAodCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LnNjYWxlQW5kVHJhbnNsYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnNjYWxlICsgKGRlbHRhU2NhbGUgKiB0KSxcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGVbMF0gKyAoZGVsdGEwICogdCksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlWzFdICsgKGRlbHRhMSAqIHQpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdXBkYXRlRnVuYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdC5zY2FsZUFuZFRyYW5zbGF0ZShcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0uc2NhbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVswXSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlWzFdKTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnNjYWxlID0gdGFyZ2V0VHJhbnNmb3JtLnNjYWxlO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlID0gdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0YXJnZXRUcmFuc2Zvcm0uc2NhbGUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIC8vIHJvdGF0aW9uIGFuZCB0cmFuc2xhdGlvblxyXG4gICAgICAgICAgICBhbmltYXRlRnVuYyA9ICh0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3Qucm90YXRlQW5kVHJhbnNsYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnJvdGF0ZSArIChkZWx0YVJvdGF0ZSAqIHQpLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZVswXSArIChkZWx0YTAgKiB0KSxcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGVbMV0gKyAoZGVsdGExICogdCkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB1cGRhdGVGdW5jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LnJvdGF0ZUFuZFRyYW5zbGF0ZShcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0ucm90YXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGVbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVsxXSk7XHJcbiAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5yb3RhdGUgPSB0YXJnZXRUcmFuc2Zvcm0ucm90YXRlO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlID0gdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBzY2FsZSwgcm90YXRpb24gYW5kIHRyYW5zbGF0aW9uXHJcbiAgICAgICAgICAgIGFuaW1hdGVGdW5jID0gKHQpID0+IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdC5zY2FsZUFuZFJvdGF0ZUFuZFRyYW5zbGF0ZShcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5zY2FsZSArIChkZWx0YVNjYWxlICogdCksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0ucm90YXRlICsgKGRlbHRhUm90YXRlICogdCksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlWzBdICsgKGRlbHRhMCAqIHQpLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZVsxXSArIChkZWx0YTEgKiB0KSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHVwZGF0ZUZ1bmMgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3Quc2NhbGVBbmRSb3RhdGVBbmRUcmFuc2xhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnNjYWxlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRyYW5zZm9ybS5yb3RhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVswXSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlWzFdKTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnNjYWxlID0gdGFyZ2V0VHJhbnNmb3JtLnNjYWxlO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0ucm90YXRlID0gdGFyZ2V0VHJhbnNmb3JtLnJvdGF0ZTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZSA9IHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gW2FuaW1hdGVGdW5jLCB1cGRhdGVGdW5jXTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2FsY3VsYXRlVHJhbnNmb3JtO1xyXG4iLCJpbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi8uLi91dGlscyc7XHJcblxyXG4vKiBEZWZpbmUgZnVuY3Rpb24gdXNlZCB0byBhbmltYXRlIGF0dHJpYnV0ZXMsIHRoZW4gYWRkIGl0IHRvIGFycmF5IG9mIGZ1bmN0aW9ucyBmb3IgYW5pbWF0aW9uICovXHJcblxyXG5mdW5jdGlvbiBjYWxjdWxhdGVBdHRyaWJ1dGVzKGVsKSB7XHJcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gZWwuYXR0cmlidXRlcztcclxuICAgIGNvbnN0IHRhYmxlID0gW107XHJcblxyXG4gICAgZnVuY3Rpb24gYW5pbWF0ZUZ1bmModCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFibGUubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgZWwub2JqZWN0Lm9iai5zZXRBdHRyaWJ1dGUodGFibGVbaV1bMF0sIHRhYmxlW2ldWzFdICsgKCh0YWJsZVtpXVsyXSAtIHRhYmxlW2ldWzFdKSAqIHQpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlRnVuYygpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhYmxlLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGVsLm9iamVjdC5vYmouc2V0QXR0cmlidXRlKHRhYmxlW2ldWzBdLCB0YWJsZVtpXVsyXSk7XHJcbiAgICAgICAgICAgIGVsLm9iamVjdC52YXJpYWJsZXMuc2V0KHRhYmxlW2ldWzBdLCB0YWJsZVtpXVsyXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gY2hlY2sgaWYgYXR0cmlidXRlcyBhbmltYXRpb24gaXMgcmVxdWVzdGVkXHJcbiAgICBpZiAoIXV0aWxzLnVuZGVmKGF0dHJpYnV0ZXMpICYmIGF0dHJpYnV0ZXMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgLy8gZm9yIGV2ZXJ5IGF0dHJpYnV0ZVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAvLyBwcm9wZXJ0eSBuYW1lXHJcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBhdHRyaWJ1dGVzW2ldLm5hbWU7XHJcblxyXG4gICAgICAgICAgICAvLyBzdGFydGluZyB2YWx1ZVxyXG4gICAgICAgICAgICBjb25zdCBmcm9tID0gdXRpbHMudW5kZWYoYXR0cmlidXRlc1tpXS5mcm9tKSA/IGVsLm9iamVjdC52YXJpYWJsZXMuZ2V0KG5hbWUpIDogYXR0cmlidXRlc1tpXS5mcm9tO1xyXG5cclxuICAgICAgICAgICAgLy8gdGhyb3cgZXJyb3IgaWYgc3RhcnRpbmcgdmFsdWUgaXMgbm90IGRlZmluZWQuIE5laXRoZXIgaW4gcmVxdWVzdCBub3IgaW4gRE9NIGVsZW1lbnRcclxuICAgICAgICAgICAgaWYgKHV0aWxzLnVuZGVmKGZyb20pKSB7IHRocm93IG5ldyBFcnJvcihgTm8gXCJmcm9tXCIgdmFsdWUsIGZvciAke25hbWV9YCk7IH1cclxuXHJcbiAgICAgICAgICAgIC8vIHRhcmdldCB2YWx1ZVxyXG4gICAgICAgICAgICBjb25zdCB0byA9IGF0dHJpYnV0ZXNbaV0udG87XHJcblxyXG4gICAgICAgICAgICB0YWJsZS5wdXNoKFtuYW1lLCBmcm9tLCB0b10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW2FuaW1hdGVGdW5jLCB1cGRhdGVGdW5jXTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2FsY3VsYXRlQXR0cmlidXRlcztcclxuIiwiaW1wb3J0IGFuaW1hdGUgZnJvbSAnLi9hbmltYXRlJztcclxuaW1wb3J0IHsgYWRkT2JqZWN0cyB9IGZyb20gJy4uL2NvbnRyb2wvcGxheWVyJztcclxuaW1wb3J0IGNhbGN1bGF0ZVRyYW5zZm9ybSBmcm9tICcuL2NhbGN1bGF0aW9ucy90cmFuc2Zvcm0nO1xyXG5pbXBvcnQgY2FsY3VsYXRlQXR0cmlidXRlcyBmcm9tICcuL2NhbGN1bGF0aW9ucy9hdHRyaWJ1dGUnO1xyXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMnO1xyXG5cclxuLyogU3BlY2lmeSBmdW5jdGlvbnMgdXNlZCB0byBhbmltYXRpb25zLCBhbmQgc2VuZCB0aGVtIHRvIGFuaW1hdGUgZnVuY3Rpb24gKi9cclxuXHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZShlbCkge1xyXG4gICAgLy8gZGVjbGFyZSBhcnJheSBvZiBhbmltYXRpb24gZnVuY3Rpb25zXHJcbiAgICBjb25zdCBhcnIgPSBbXTtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgIC8vIFNldCBmdW5jdGlvbiBmb3IgZXZlcnkgb2JqZWN0XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbC5vYmplY3RzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RPYmplY3QgPSBlbC5vYmplY3RzW2ldO1xyXG5cclxuICAgICAgICAgICAgLy8gZGVmaW5lIHRyYW5zZm9ybSBhbmltYXRpb24gZnVuY3Rpb24sIGlmIHRyYW5zZm9ybSBhbmltYXRpb24gaXMgcmVxdWVzdGVkXHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGN1bGF0ZWRUcmFuc2Zvcm0gPSBjYWxjdWxhdGVUcmFuc2Zvcm0ocmVxdWVzdE9iamVjdCk7XHJcbiAgICAgICAgICAgIGlmIChjYWxjdWxhdGVkVHJhbnNmb3JtKSB7IGFyci5wdXNoKFtjYWxjdWxhdGVkVHJhbnNmb3JtXSk7IH1cclxuXHJcbiAgICAgICAgICAgIC8vIGRlZmluZSBhdHRyaWJ1dGUgYW5pbWF0aW9uIGZ1bmN0aW9uLCBpZiBhdHRyaWJ1dGUgYW5pbWF0aW9uIGlzIHJlcXVlc3RlZFxyXG4gICAgICAgICAgICBjb25zdCBjYWxjdWxhdGVkQXR0cmlidXRlcyA9IGNhbGN1bGF0ZUF0dHJpYnV0ZXMocmVxdWVzdE9iamVjdCk7XHJcbiAgICAgICAgICAgIGlmIChjYWxjdWxhdGVkQXR0cmlidXRlcykgeyBhcnIucHVzaChbY2FsY3VsYXRlZEF0dHJpYnV0ZXNdKTsgfVxyXG5cclxuICAgICAgICAgICAgLy8gYWRkIG9iamVjdHMgdG8gb2JqZWN0cyBzZXQgaW4gcGxheWVyLmpzLiBOZWVkZWQgZm9yIHJlc2V0aW5nXHJcbiAgICAgICAgICAgIGFkZE9iamVjdHMoZWwub2JqZWN0c1tpXS5vYmplY3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZW5kIGFycmF5IG9mIGZ1bmN0aW9ucyB0byBhbmltYXRlIGZ1bmN0aW9uXHJcbiAgICAgICAgYW5pbWF0ZShcclxuICAgICAgICAgICAgdXRpbHMudW5kZWYoZWwuc3BlZWQpID8gMSA6IGVsLnNwZWVkLFxyXG4gICAgICAgICAgICBlbC5kZWxheSB8fCAwLFxyXG4gICAgICAgICAgICBhcnIpXHJcbiAgICAgICAgLnRoZW4oKCkgPT4geyByZXNvbHZlKCk7IH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNhbGN1bGF0ZTtcclxuIiwiaW1wb3J0IGNhbGN1bGF0ZSBmcm9tICcuL2NhbGN1bGF0ZSc7XHJcblxyXG4vKiBTcGxpdCByZXF1ZXN0IHRvIHRocmVhZHMsIGFuZCBkaXNwYXRjaCB0byBcImNhbGN1bGF0ZVwiIGZ1bmN0aW9uICovXHJcblxyXG5mdW5jdGlvbiBkaXNwYXRjaCguLi50aHJlYWRzKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGlmICh0aHJlYWRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAvLyB0aHJvdyBlcnJvciwgaWYgcmVxdWVzdCBpcyBlbXB0eVxyXG4gICAgICAgICAgICByZWplY3QoRXJyb3IoJ0FkZCBvYmplY3RzIHRvIFwic3RlcFwiIGZ1bmN0aW9uJykpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFyciA9IFtdO1xyXG4gICAgICAgICAgICAvLyBzZW5kIGFsbCB0aHJlYWRzIHRvIGNhbGN1bGF0aW9uXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhyZWFkcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgYXJyLnB1c2goY2FsY3VsYXRlKHRocmVhZHNbaV0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBhZnRlciBhbmltYXRpb24gY29tcGxldGVkLCByZXNvbHZlIHByb21pc2UgdG8gbGF1bmNoIG5leHQgc2VxdWVuY2VcclxuICAgICAgICAgICAgUHJvbWlzZS5hbGwoYXJyKS50aGVuKCgpID0+IHsgcmVzb2x2ZSgpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuLy8gcmVuYW1lIGVsZW1lbnQgZm9yIGVhc2llciBhY2Nlc3NcclxuY29uc3Qgc3RlcCA9IGRpc3BhdGNoO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgc3RlcDtcclxuIiwiaW1wb3J0IHNldHRpbmdzIGZyb20gJy4uL3NldHRpbmdzJzsgLy8gaW1wb3J0IHNldHRpbmdzIGZvciBnZXR0aW5nIGFjY2VzcyB0byBTVkcgZWxlbWVudFxyXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMnOyAvLyBpbXBvcnQgdXRpbHMgZm9yIHV0aWxzLnVuZGVmXHJcblxyXG5jbGFzcyBPYmoge1xyXG4vKlxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUNPTlNUUlVDVE9SLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiovXHJcbiAgICBjb25zdHJ1Y3RvcihvYmosIHRyYW5zZm9ybSA9IHsgdHJhbnNsYXRlOiBbMCwgMF0sIHJvdGF0ZTogMCwgc2NhbGU6IDEgfSkge1xyXG4gICAgICAgIC8vIGFjY2VzcyB0byBET00gb2JqZWN0XHJcbiAgICAgICAgdGhpcy5vYmogPSBvYmo7XHJcbiAgICAgICAgLy8gY3JlYXRlIHplcm8gbWF0cml4XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXggPSBzZXR0aW5ncy5zdmcuY3JlYXRlU1ZHTWF0cml4KCk7XHJcbiAgICAgICAgLy8gc2V0IHN0YXJ0aW5nIHZhcmlhYmxlcywgYW5kIGRlY2xhcmUgdGhpcy5zdGFydGluZ1ZhcmlhYmxlcyBhbmQgdGhpcy52YXJpYWJsZXNcclxuICAgICAgICB0aGlzLnNldFN0YXJ0aW5nVmFyaWFibGVzKHRyYW5zZm9ybSk7XHJcbiAgICAgICAgLy8gc2V0IGluaXRpYWwgbWF0cml4XHJcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsTWF0cml4KCk7XHJcblxyXG4gICAgICAgIC8qIC0tLS0tLS0tIHNob3J0Y3V0cyAtLS0tLS0tLSAqL1xyXG5cclxuICAgICAgICAvLyB0byBtYXRyaXggaW50ZXJmYWNlIC0+IHRoaXMuU1ZHVHJhbnNmb3JtXHJcblxyXG4gICAgICAgIC8vIHRvIGN1cnJlbnQgdHJhbnNmb3JtXHJcbiAgICAgICAgdGhpcy50ciA9IHRoaXMudmFyaWFibGVzLmdldCgndHJhbnNmb3JtJyk7XHJcbiAgICB9XHJcblxyXG4vKlxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tSU5JVElBTElaSU5HIE1FVEhPRFMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiovXHJcblxyXG5cclxuICAgIHNldFN0YXJ0aW5nVmFyaWFibGVzKHRyYW5zZm9ybSkge1xyXG4gICAgICAgIGNvbnN0IG1hcCA9IG5ldyBNYXAoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub2JqLmF0dHJpYnV0ZXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub2JqLmF0dHJpYnV0ZXNbaV0uc3BlY2lmaWVkICYmIHRoaXMub2JqLmF0dHJpYnV0ZXNbaV0ubmFtZSAhPT0gJ3RyYW5zZm9ybScpIHtcclxuICAgICAgICAgICAgICAgIG1hcC5zZXQodGhpcy5vYmouYXR0cmlidXRlc1tpXS5uYW1lLCBwYXJzZUZsb2F0KHRoaXMub2JqLmF0dHJpYnV0ZXNbaV0udmFsdWUpIHx8IHRoaXMub2JqLmF0dHJpYnV0ZXNbaV0udmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RhcnRpbmdWYXJpYWJsZXMgPSBuZXcgTWFwKG1hcCk7XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMgPSBuZXcgTWFwKG1hcCk7XHJcblxyXG4gICAgICAgIC8vIHJlZmVyZW5jZSBzaGl0XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgW3RoaXMuc3RhcnRpbmdWYXJpYWJsZXMsIHRoaXMudmFyaWFibGVzXVtpXS5zZXQoJ3RyYW5zZm9ybScsIHtcclxuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZTogdXRpbHMudW5kZWYodHJhbnNmb3JtLnRyYW5zbGF0ZSkgPyBbMCwgMF0gOiB0cmFuc2Zvcm0udHJhbnNsYXRlLFxyXG4gICAgICAgICAgICAgICAgc2NhbGU6IHV0aWxzLnVuZGVmKHRyYW5zZm9ybS5zY2FsZSkgPyAxIDogdHJhbnNmb3JtLnNjYWxlLFxyXG4gICAgICAgICAgICAgICAgcm90YXRlOiB1dGlscy51bmRlZih0cmFuc2Zvcm0ucm90YXRlKSA/IDAgOiB0cmFuc2Zvcm0ucm90YXRlLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SW5pdGlhbE1hdHJpeCgpIHtcclxuICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSB0aGlzLnZhcmlhYmxlcy5nZXQoJ3RyYW5zZm9ybScpO1xyXG4gICAgICAgIHRoaXMub2JqLnRyYW5zZm9ybS5iYXNlVmFsLmluaXRpYWxpemUoc2V0dGluZ3Muc3ZnLmNyZWF0ZVNWR1RyYW5zZm9ybUZyb21NYXRyaXgodGhpcy5tYW5pcHVsYXRpb25NYXRyaXgpKTtcclxuICAgICAgICB0aGlzLlNWR1RyYW5zZm9ybSA9IHRoaXMub2JqLnRyYW5zZm9ybS5iYXNlVmFsLmdldEl0ZW0oMCk7XHJcbiAgICAgICAgdGhpcy5zY2FsZUFuZFJvdGF0ZUFuZFRyYW5zbGF0ZSh0cmFuc2Zvcm0uc2NhbGUsIHRyYW5zZm9ybS5yb3RhdGUsIHRyYW5zZm9ybS50cmFuc2xhdGVbMF0sIHRyYW5zZm9ybS50cmFuc2xhdGVbMV0pO1xyXG4gICAgfVxyXG5cclxuLypcclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLU9USEVSLU1FVEhPRFMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4qL1xyXG5cclxuICAgIHNldE1hdHJpeChtYXRyaXgpIHsgdGhpcy5TVkdUcmFuc2Zvcm0uc2V0TWF0cml4KG1hdHJpeCk7IH1cclxuXHJcbiAgICByZXNldCgpIHtcclxuICAgICAgICAvLyByZXNldCB2YXJpYWJsZXNcclxuICAgICAgICB0aGlzLnZhcmlhYmxlcyA9IG5ldyBNYXAodGhpcy5zdGFydGluZ1ZhcmlhYmxlcyk7XHJcbiAgICAgICAgLy8gcmVmZXJlbmNlIHNoaXRcclxuICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSB0aGlzLnN0YXJ0aW5nVmFyaWFibGVzLmdldCgndHJhbnNmb3JtJyk7XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMuc2V0KCd0cmFuc2Zvcm0nLCB7XHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZTogdHJhbnNmb3JtLnRyYW5zbGF0ZSxcclxuICAgICAgICAgICAgc2NhbGU6IHRyYW5zZm9ybS5zY2FsZSxcclxuICAgICAgICAgICAgcm90YXRlOiB0cmFuc2Zvcm0ucm90YXRlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudHIgPSB0aGlzLnZhcmlhYmxlcy5nZXQoJ3RyYW5zZm9ybScpO1xyXG5cclxuICAgICAgICBjb25zdCBvYmogPSB0aGlzLm9iajtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGFsbCBhdHRyaWJ1dGVzIGZyb20gZWxlbWVudCBET01cclxuICAgICAgICBmb3IgKGxldCBpID0gb2JqLmF0dHJpYnV0ZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpIC09IDEpIHtcclxuICAgICAgICAgICAgaWYgKG9iai5hdHRyaWJ1dGVzW2ldLm5hbWUgIT09ICd0cmFuc2Zvcm0nKSB7XHJcbiAgICAgICAgICAgICAgICBvYmoucmVtb3ZlQXR0cmlidXRlKG9iai5hdHRyaWJ1dGVzW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGFkZCBhbGwgc3RhcnRpbmcgYXR0cmlidXRlc1xyXG4gICAgICAgIGZ1bmN0aW9uIGFkZCh2YWx1ZSwga2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgIT09ICd0cmFuc2Zvcm0nKSB7XHJcbiAgICAgICAgICAgICAgICBvYmouc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudmFyaWFibGVzLmZvckVhY2goYWRkKTtcclxuXHJcblxyXG4gICAgICAgIC8vIHNldCBzdGFydGluZyB0cmFuc2Zvcm1cclxuICAgICAgICB0aGlzLnNldEluaXRpYWxNYXRyaXgoKTtcclxuICAgIH1cclxuXHJcbi8qXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUFOSU1BVElORy1NRVRIT0RTLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuKi9cclxuICAgIHRyYW5zbGF0ZSh4LCB5KSB7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZSA9IHg7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZiA9IHk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TWF0cml4KHRoaXMubWFuaXB1bGF0aW9uTWF0cml4KTtcclxuICAgIH1cclxuICAgIHJvdGF0ZShhbmdsZSkge1xyXG4gICAgICAgIGNvbnN0IHJhZGlhbnMgPSAoLWFuZ2xlICogTWF0aC5QSSkgLyAxODA7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguc2luKHJhZGlhbnMpICogdGhpcy50ci5zY2FsZTtcclxuICAgICAgICBjb25zdCBhID0gTWF0aC5jb3MocmFkaWFucykgKiB0aGlzLnRyLnNjYWxlO1xyXG5cclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5hID0gYTtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5iID0gLWM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYyA9IGM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZCA9IGE7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TWF0cml4KHRoaXMubWFuaXB1bGF0aW9uTWF0cml4KTtcclxuICAgIH1cclxuICAgIHNjYWxlKHMpIHtcclxuICAgICAgICBjb25zdCByYWRpYW5zID0gKHRoaXMudHIucm90YXRlICogTWF0aC5QSSkgLyAxODA7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguc2luKHJhZGlhbnMpICogcztcclxuICAgICAgICBjb25zdCBhID0gTWF0aC5jb3MocmFkaWFucykgKiBzO1xyXG5cclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5hID0gYTtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5iID0gLWM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYyA9IGM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZCA9IGE7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TWF0cml4KHRoaXMubWFuaXB1bGF0aW9uTWF0cml4KTtcclxuICAgIH1cclxuICAgIHNjYWxlQW5kUm90YXRlKHMsIGFuZ2xlKSB7XHJcbiAgICAgICAgY29uc3QgcmFkaWFucyA9ICgtYW5nbGUgKiBNYXRoLlBJKSAvIDE4MDtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5zaW4ocmFkaWFucykgKiBzO1xyXG4gICAgICAgIGNvbnN0IGEgPSBNYXRoLmNvcyhyYWRpYW5zKSAqIHM7XHJcblxyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmEgPSBhO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmIgPSAtYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5jID0gYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5kID0gYTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRNYXRyaXgodGhpcy5tYW5pcHVsYXRpb25NYXRyaXgpO1xyXG4gICAgfVxyXG4gICAgc2NhbGVBbmRUcmFuc2xhdGUocywgeCwgeSkge1xyXG4gICAgICAgIGNvbnN0IHJhZGlhbnMgPSAodGhpcy50ci5yb3RhdGUgKiBNYXRoLlBJKSAvIDE4MDtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5zaW4ocmFkaWFucykgKiBzO1xyXG4gICAgICAgIGNvbnN0IGEgPSBNYXRoLmNvcyhyYWRpYW5zKSAqIHM7XHJcblxyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmEgPSBhO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmIgPSAtYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5jID0gYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5kID0gYTtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5lID0geDtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5mID0geTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRNYXRyaXgodGhpcy5tYW5pcHVsYXRpb25NYXRyaXgpO1xyXG4gICAgfVxyXG4gICAgcm90YXRlQW5kVHJhbnNsYXRlKGFuZ2xlLCB4LCB5KSB7XHJcbiAgICAgICAgY29uc3QgcmFkaWFucyA9ICgtYW5nbGUgKiBNYXRoLlBJKSAvIDE4MDtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5zaW4ocmFkaWFucykgKiB0aGlzLnRyLnNjYWxlO1xyXG4gICAgICAgIGNvbnN0IGEgPSBNYXRoLmNvcyhyYWRpYW5zKSAqIHRoaXMudHIuc2NhbGU7XHJcblxyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmEgPSBhO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmIgPSAtYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5jID0gYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5kID0gYTtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5lID0geDtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5mID0geTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRNYXRyaXgodGhpcy5tYW5pcHVsYXRpb25NYXRyaXgpO1xyXG4gICAgfVxyXG4gICAgc2NhbGVBbmRSb3RhdGVBbmRUcmFuc2xhdGUocywgYW5nbGUsIHgsIHkpIHtcclxuICAgICAgICBjb25zdCByID0gKC1hbmdsZSAqIE1hdGguUEkpIC8gMTgwO1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLnNpbihyKSAqIHM7XHJcbiAgICAgICAgY29uc3QgYSA9IE1hdGguY29zKHIpICogcztcclxuXHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYSA9IGE7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYiA9IC1jO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmMgPSBjO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmQgPSBhO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmUgPSB4O1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmYgPSB5O1xyXG5cclxuICAgICAgICB0aGlzLnNldE1hdHJpeCh0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBPYmo7XHJcbiIsImNsYXNzIFNsaWRlIHt9XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTbGlkZTtcclxuIiwiaW1wb3J0IHN0ZXAgZnJvbSAnLi9lbmdpbmUvZGlzcGF0Y2gnO1xyXG5pbXBvcnQgT2JqIGZyb20gJy4vY2xhc3Nlcy9tYWluJztcclxuaW1wb3J0IFNsaWRlIGZyb20gJy4vY2xhc3Nlcy9zbGlkZSc7XHJcbmltcG9ydCB7IGFkZFNsaWRlcywgbmV4dCB9IGZyb20gJy4vY29udHJvbC9wbGF5ZXInO1xyXG5cclxuLy8gcm9sbHVwIHNoaXRcclxuKCgpID0+IFtzdGVwLCBPYmosIFNsaWRlLCBhZGRTbGlkZXMsIG5leHRdKSgpO1xyXG4iXSwibmFtZXMiOlsicGF1c2VUb1JlbG9hZCIsInBsYXlUb1BhdXNlIiwicmVsb2FkVG9QbGF5IiwicGF1c2VUb1BsYXkiXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sUUFBUSxHQUFHO0lBQ2IsR0FBRyxFQUFFLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUMsS0FBSyxFQUFFLEtBQUs7SUFDWixNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Q0FDckMsQ0FBQyxBQUVGLEFBQXdCOztBQ0p4Qjs7QUFFQSxTQUFTLGFBQWEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFO0lBQzlCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDcEMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ25CO0NBQ0o7QUFDRCxTQUFTLFlBQVksQ0FBQyxHQUFHLEVBQUU7SUFDdkIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNwQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztLQUNmO0NBQ0o7OztBQUdELFNBQVMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEtBQUs7UUFDNUIsSUFBSSxDQUFDLEdB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LEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2pHLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDakcsQ0FBQyxDQUFDLENBQUM7WUFDSCxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN2QyxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2pHLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUss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QUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDekcsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQzdGLENBQUMsQ0FBQyxDQUFDO1lBQ0gsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ25DLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ3pHLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsS0FBSyxHQUFHLEVBQUUsQ0FBQztpQkFDeEYsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxLQUFLLEdBQUcsRUFBRSxDQUFDO21CQUN2RixFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUMzRCxDQUFDLENBQUMsQ0FBQztZQUNILEtBQUssSUFBSSxDQUFDLENBQUM7WUFDWCxNQUFNLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDekMsTUFBTTtZQUNILFVBQVUsRUFBRSxDQUFDO1NBQ2hCO0tBQ0o7SUFDRCxPQUFPLEVBQUUsQ0FBQztDQUNiOzs7O0FBSUQsU0FBUyxtQkFBbUIsR0FBRztJQUMzQixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDZCxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7O0lBRWYsU0FBUyxPQUFPLEdBQUc7UUFDZixJQUFJLEtBQUssSUFBSSxFQUFFLEVBQUU7WUFDYixLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDbkMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxLQUFLLEdBQUcsRUFBRSxDQUFDO21CQUNwRixFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDdkQsRUFBRSxFQUFFLEdBQUcsS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUN6RixFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQzdHLENBQUMsQ0FBQyxDQUFDO1lBQ0gsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ25DLEVBQUUsRUFBRSxHQUFHLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDekYsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDekcsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFD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