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

/* function that removes attributes */

function calculateRemove(el) {
    const remove = el.remove;
    let removeFunc;
    let updateFunc;

    // check if there are attributes to remove
    if (!utils.undef(remove)) {
        const start = []; // array of attributes removed at start
        const end = []; // array of attributes removed at end
        const items = Array.isArray(remove) ? remove : [remove];

        // add attributes to start/end array
        for (let i = 0; i < items.length; i += 1) {
            if (items[i].when === 'end') {
                end.push(items[i]);
            } else {
                start.push(items[i]);
            }
        }
        // remove attributes at start
        if (start.length) {
            for (let i = 0; i < start.length; i += 1) {
                el.object.obj.removeAttribute(start[i].name);
                el.object.variables.delete(start[i].name);
            }
        }
        // define and return function to remove attributes at the end
        if (end.length) {
            removeFunc = () => false;
            updateFunc = () => {
                for (let i = 0; i < end.length; i += 1) {
                    el.object.obj.removeAttribute(end[i].name);
                    el.object.variables.delete(end[i].name);
                }
            };
            return [removeFunc, updateFunc];
        }
    }
    return false;
}

/* function that sets attributes */

function calculateSet(el) {
    const set = el.set;
    let setFunc;
    let updateFunc;

    // check if there are attributes to set
    if (!utils.undef(set)) {
        const start = []; // array of attributes set at start
        const end = []; // array of attributes set at end
        const items = Array.isArray(set) ? set : [set];

        // add attributes to start/end array
        for (let i = 0; i < items.length; i += 1) {
            if (items[i].when === 'end') {
                end.push(items[i]);
            } else {
                start.push(items[i]);
            }
        }
        // set attributes at start
        if (start.length) {
            for (let i = 0; i < start.length; i += 1) {
                el.object.obj.setAttribute(start[i].name, start[i].value);
                el.object.variables.set(start[i].name, start[i].value);
            }
        }
        // define and return function to set attributes at the end
        if (end.length) {
            setFunc = () => false;
            updateFunc = () => {
                for (let i = 0; i < end.length; i += 1) {
                    el.object.obj.setAttribute(end[i].name, end[i].value);
                    el.object.variables.set(end[i].name, end[i].value);
                }
            };
            return [setFunc, updateFunc];
        }
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

            // define remove attribute function, if attributes needs to be removed
            const calculatedRemove = calculateRemove(requestObject);
            if (calculatedRemove) { arr.push([calculatedRemove]); }

            // define set attribute function, if attributes needs to be set
            const calculatedSet = calculateSet(requestObject);
            if (calculatedSet) { arr.push([calculatedSet]); }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIkQ6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvc2V0dGluZ3MuanMiLCJEOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2VuZ2luZS9hbmltYXRlLmpzIiwiRDovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy9jb250cm9sL2J1dHRvbnMuanMiLCJEOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2NvbnRyb2wvcGxheWVyLmpzIiwiRDovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy91dGlscy5qcyIsIkQ6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvZW5naW5lL2NhbGN1bGF0aW9ucy90cmFuc2Zvcm0uanMiLCJEOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2VuZ2luZS9jYWxjdWxhdGlvbnMvYXR0cmlidXRlLmpzIiwiRDovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy9lbmdpbmUvY2FsY3VsYXRpb25zL3JlbW92ZS5qcyIsIkQ6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvZW5naW5lL2NhbGN1bGF0aW9ucy9zZXQuanMiLCJEOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2VuZ2luZS9jYWxjdWxhdGUuanMiLCJEOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2VuZ2luZS9kaXNwYXRjaC5qcyIsIkQ6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvY2xhc3Nlcy9tYWluLmpzIiwiRDovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy9jbGFzc2VzL3NsaWRlLmpzIiwiRDovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBzZXR0aW5ncyA9IHtcclxuICAgIHN2ZzogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3N2ZycpWzBdLCAgIC8vIHN2ZyBlbGVtZW50XHJcbiAgICBzcGVlZDogMC4wMjUsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBiYXNlIGFuaW1hdGlvbiBzcGVlZFxyXG4gICAgZWFzaW5nOiB0ID0+IHQgKiB0ICogKDMgLSAoMiAqIHQpKSwgICAgICAgICAgICAgLy8gZWFzaW5nIGZ1bmN0aW9uXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBzZXR0aW5ncztcclxuIiwiaW1wb3J0IHNldHRpbmdzIGZyb20gJy4uL3NldHRpbmdzJztcclxuXHJcbi8qIEFuaW1hdGUgcHJlZGVmaW5lZCBmdW5jdGlvbnMsIHRoZW4gdXBkYXRlIHZhcmlhYmxlcyAqL1xyXG5cclxuZnVuY3Rpb24gYW5pbWF0ZU9iamVjdChhcnIsIGVhc2UpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgYXJyW2ldWzBdKGVhc2UpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHVwZGF0ZU9iamVjdChhcnIpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgYXJyW2ldWzFdKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIG1haW4gYW5pbWF0aW9uIGZ1bmN0aW9uXHJcbmZ1bmN0aW9uIGFuaW1hdGUocywgZCwgYXJyKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICBsZXQgdCA9IDA7XHJcbiAgICAgICAgbGV0IGVhc2U7XHJcbiAgICAgICAgY29uc3Qgc3BlZWQgPSBzZXR0aW5ncy5zcGVlZCAqIHMgPiAwID8gc2V0dGluZ3Muc3BlZWQgKiBzIDogMC4wMjU7XHJcbiAgICAgICAgaWYgKHMgPT09IDApIHsgdCA9IDE7IH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcCgpIHtcclxuICAgICAgICAgICAgaWYgKHQgPCAxKSB7XHJcbiAgICAgICAgICAgICAgICB0ICs9IHNwZWVkO1xyXG4gICAgICAgICAgICAgICAgZWFzZSA9IHNldHRpbmdzLmVhc2luZyh0KTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZU9iamVjdChhcnJbaV0sIGVhc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqZWN0KGFycltpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoc3RlcCwgZCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgYW5pbWF0ZTtcclxuIiwiaW1wb3J0IHNldHRpbmdzIGZyb20gJy4uL3NldHRpbmdzJztcclxuXHJcbi8qXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUNSRUFURS1FTEVNRU5UUy1PRi1JTlRFUkZBQ0UtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuKi9cclxuXHJcbi8vIGRlY2xhcmUgdmFyaWFibGVzXHJcblxyXG5jb25zdCBpY29ucyA9IHtcclxuICAgIGdyb3VwOiBudWxsLFxyXG4gICAgcG9seWdvbjE6IG51bGwsXHJcbiAgICBwb2x5Z29uMjogbnVsbCxcclxuICAgIGFyYzE6IG51bGwsXHJcbiAgICBhcmMyOiBudWxsLFxyXG4gICAgcmVjdDogbnVsbCxcclxufTtcclxuXHJcbi8vIGNyZWF0ZSBpY29uc1xyXG5cclxuY29uc3QgeG1sbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xyXG5pY29ucy5ncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh4bWxucywgJ2cnKTtcclxuXHJcbmljb25zLmFyYzEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoeG1sbnMsICdwYXRoJyk7XHJcbmljb25zLmFyYzEuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCAnTTEwLDIwIEExMCwxMCAwIDAsMSAyMCwxMCcpO1xyXG5pY29ucy5ncm91cC5hcHBlbmRDaGlsZChpY29ucy5hcmMxKTtcclxuXHJcbmljb25zLmFyYzIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoeG1sbnMsICdwYXRoJyk7XHJcbmljb25zLmFyYzIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCAnTTMwLDIwIEExMCwxMCAwIDAsMSAyMCwzMCcpO1xyXG5pY29ucy5ncm91cC5hcHBlbmRDaGlsZChpY29ucy5hcmMyKTtcclxuXHJcbmljb25zLnBvbHlnb24xID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHhtbG5zLCAncG9seWdvbicpO1xyXG5pY29ucy5wb2x5Z29uMS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncG9pbnRzJywgJzEwLDEwIDEwLDMwIDIwLDI1IDIwLDE1Jyk7XHJcbmljb25zLmdyb3VwLmFwcGVuZENoaWxkKGljb25zLnBvbHlnb24xKTtcclxuXHJcbmljb25zLnBvbHlnb24yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHhtbG5zLCAncG9seWdvbicpO1xyXG5pY29ucy5wb2x5Z29uMi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncG9pbnRzJywgJzIwLDI1IDIwLDE1IDMwLDIwIDMwLDIwJyk7XHJcbmljb25zLmdyb3VwLmFwcGVuZENoaWxkKGljb25zLnBvbHlnb24yKTtcclxuXHJcbmljb25zLnJlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoeG1sbnMsICdyZWN0Jyk7XHJcbmljb25zLnJlY3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCAwKTtcclxuaWNvbnMucmVjdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIDApO1xyXG5pY29ucy5yZWN0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIDQwKTtcclxuaWNvbnMucmVjdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgNDApO1xyXG5pY29ucy5ncm91cC5hcHBlbmRDaGlsZChpY29ucy5yZWN0KTtcclxuXHJcbi8vIGFkZCBzdHlsZSB0byBpbnRlcmZhY2VcclxuXHJcbmNvbnN0IGNzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3R5bGUnKTtcclxuY3NzLnRleHRDb250ZW50ID0gJyNjb250cm9sID4gcmVjdCB7b3BhY2l0eTogMDsgY3Vyc29yOiBwb2ludGVyO30gI2NvbnRyb2wgPiBwYXRoIHtzdHJva2U6IzAwMDsgZmlsbDpub25lOyBzdHJva2Utd2lkdGg6IDJweDsgc3Ryb2tlLWRhc2hhcnJheTogMTZweDsgc3Ryb2tlLWRhc2hvZmZzZXQ6IDE2cHh9JztcclxuXHJcblxyXG5sZXQgZGVmcyA9IHNldHRpbmdzLnN2Zy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGVmcycpWzBdO1xyXG4vLyBjaGVjayBpZiBkZWZzIGVsZW1lbnQgaXMgYWxyZWFkeSBkZWNsYXJlZC4gSWYgbm90LCBhZGQgaXQgdG8gRE9NXHJcbmlmICghZGVmcykge1xyXG4gICAgZGVmcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RlZnMnKTtcclxuICAgIHNldHRpbmdzLnN2Zy5pbnNlcnRCZWZvcmUoZGVmcywgc2V0dGluZ3Muc3ZnLmZpcnN0Q2hpbGQpO1xyXG59XHJcbmRlZnMuYXBwZW5kQ2hpbGQoY3NzKTtcclxuXHJcbi8vIHNldCBpbnRlcmZhY2UgdG8gY29ycmVjdCBwb3NpdGlvblxyXG5jb25zdCB2aWV3Qm94ID0gc2V0dGluZ3Muc3ZnLnZpZXdCb3guYmFzZVZhbDtcclxuY29uc3QgbWF0cml4ID0gc2V0dGluZ3Muc3ZnLmNyZWF0ZVNWR01hdHJpeCgpO1xyXG5tYXRyaXguZSA9IHZpZXdCb3gueCArIDEwO1xyXG5tYXRyaXguZiA9IHZpZXdCb3gueSArICh2aWV3Qm94LmhlaWdodCAtIDUwKTtcclxuaWNvbnMuZ3JvdXAuaWQgPSAnY29udHJvbCc7XHJcbmljb25zLmdyb3VwLnRyYW5zZm9ybS5iYXNlVmFsLmluaXRpYWxpemUoc2V0dGluZ3Muc3ZnLmNyZWF0ZVNWR1RyYW5zZm9ybUZyb21NYXRyaXgobWF0cml4KSk7XHJcblxyXG5cclxuLy8gYWRkIGludGVyZmFjZSB0byBET01cclxuXHJcbnNldHRpbmdzLnN2Zy5hcHBlbmRDaGlsZChpY29ucy5ncm91cCk7XHJcblxyXG5cclxuLy8gYWRkIGV2ZW50IGxpc3RlbmVycyB0byBlbGVtZW50cyBvZiBpbnRlcmZhY2UsIGFuZCBzZXQgZXZlbnQgcHJvcGFnYXRpb25cclxuXHJcbmNvbnN0IGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbmV2ZW50LmluaXRFdmVudCgnYnV0dG9uLWNsaWNrJywgdHJ1ZSwgdHJ1ZSk7XHJcbmljb25zLnJlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7IHNldHRpbmdzLnN2Zy5kaXNwYXRjaEV2ZW50KGV2ZW50KTsgfSk7XHJcblxyXG5cclxuLypcclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUlOVEVSRkFDRS1BTklNQVRJT05TLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4qL1xyXG5cclxuLy8gYW5pbWF0aW9uIC0gcGxheSAtPiBwYXVzZVxyXG5cclxuZnVuY3Rpb24gYW5pbWF0ZVBsYXlUb1BhdXNlKCkge1xyXG4gICAgbGV0IHN0ZXBzID0gMTtcclxuXHJcbiAgICBmdW5jdGlvbiBhbmltYXRlKCkge1xyXG4gICAgICAgIGlmIChzdGVwcyA8PSAxMCkge1xyXG4gICAgICAgICAgICBpY29ucy5wb2x5Z29uMS5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsIGBcclxuICAgICAgICAgICAgMTAsMTAgXHJcbiAgICAgICAgICAgIDEwLDMwIFxyXG4gICAgICAgICAgICAkezIwIC0gKHN0ZXBzIC8gNSkgPiAxOCA/IDIwIC0gKHN0ZXBzIC8gNSkgOiAxOH0sJHsyNSArIChzdGVwcyAvIDIpIDwgMzAgPyAyNSArIChzdGVwcyAvIDIpIDogMzB9IFxyXG4gICAgICAgICAgICAkezIwIC0gKHN0ZXBzIC8gNSkgPiAxOCA/IDIwIC0gKHN0ZXBzIC8gNSkgOiAxOH0sJHsxNSAtIChzdGVwcyAvIDIpID4gMTAgPyAxNSAtIChzdGVwcyAvIDIpIDogMTB9XHJcbiAgICAgICAgICAgIGApO1xyXG4gICAgICAgICAgICBpY29ucy5wb2x5Z29uMi5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsIGBcclxuICAgICAgICAgICAgJHsyMCArIChzdGVwcyAvIDUpIDwgMjIgPyAyMCArIChzdGVwcyAvIDUpIDogMjJ9LCR7MTUgLSAoc3RlcHMgLyAyKSA+IDEwID8gMTUgLSAoc3RlcHMgLyAyKSA6IDEwfSBcclxuICAgICAgICAgICAgJHsyMCArIChzdGVwcyAvIDUpIDwgMjIgPyAyMCArIChzdGVwcyAvIDUpIDogMjJ9LCAkezI1ICsgKHN0ZXBzIC8gMikgPCAzMCA/IDI1ICsgKHN0ZXBzIC8gMikgOiAzMH0gXHJcbiAgICAgICAgICAgIDMwLCR7MjAgKyBzdGVwcyA8IDMwID8gMjAgKyBzdGVwcyA6IDMwfSBcclxuICAgICAgICAgICAgMzAsJHsyMCAtIHN0ZXBzID4gMTAgPyAyMCAtIHN0ZXBzIDogMTB9XHJcbiAgICAgICAgICAgIGApO1xyXG4gICAgICAgICAgICBzdGVwcyArPSAxO1xyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFuaW1hdGUoKTtcclxufVxyXG5cclxuLy8gYW5pbWF0aW9uIC0gcGF1c2UgLT4gcGxheVxyXG5cclxuZnVuY3Rpb24gYW5pbWF0ZVBhdXNlVG9QbGF5KCkge1xyXG4gICAgbGV0IHN0ZXBzID0gMTtcclxuXHJcbiAgICBmdW5jdGlvbiBhbmltYXRlKCkge1xyXG4gICAgICAgIGlmIChzdGVwcyA8PSAxMCkge1xyXG4gICAgICAgICAgICBpY29ucy5wb2x5Z29uMS5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsIGBcclxuICAgICAgICAgICAgICAgIDEwLDEwIFxyXG4gICAgICAgICAgICAgICAgMTAsMzAgXHJcbiAgICAgICAgICAgICAgICAkezE4ICsgKHN0ZXBzIC8gNSkgPCAyMCA/IDE4ICsgKHN0ZXBzIC8gNSkgOiAyMH0sJHszMCAtIChzdGVwcyAvIDIpID4gMjUgPyAzMCAtIChzdGVwcyAvIDIpIDogMjV9IFxyXG4gICAgICAgICAgICAgICAgJHsxOCArIChzdGVwcyAvIDUpIDwgMjAgPyAxOCArIChzdGVwcyAvIDUpIDogMjB9LCR7MTAgKyAoc3RlcHMgLyAyKSA8IDE1ID8gMTAgKyAoc3RlcHMgLyAyKSA6IDE1fVxyXG4gICAgICAgICAgICBgKTtcclxuICAgICAgICAgICAgaWNvbnMucG9seWdvbjIuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBgXHJcbiAgICAgICAgICAgICAgICAkezIyIC0gKHN0ZXBzIC8gNSkgPiAyMCA/IDIyIC0gKHN0ZXBzIC8gNSkgOiAyMH0sJHsxMCArIChzdGVwcyAvIDIpIDwgMTUgPyAxMCArIChzdGVwcyAvIDIpIDogMTV9IFxyXG4gICAgICAgICAgICAgICAgJHsyMiAtIChzdGVwcyAvIDUpID4gMjAgPyAyMiAtIChzdGVwcyAvIDUpIDogMjB9LCR7MzAgLSAoc3RlcHMgLyAyKSA+IDI1ID8gMzAgLSAoc3RlcHMgLyAyKSA6IDI1fSBcclxuICAgICAgICAgICAgICAgIDMwLCR7MzAgLSAoc3RlcHMgPiAyMCkgPyAzMCAtIHN0ZXBzIDogMjB9IFxyXG4gICAgICAgICAgICAgICAgMzAsJHsxMCArIChzdGVwcyA8IDIwKSA/IDEwICsgc3RlcHMgOiAyMH1cclxuICAgICAgICAgICAgYCk7XHJcbiAgICAgICAgICAgIHN0ZXBzICs9IDE7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYW5pbWF0ZSgpO1xyXG59XHJcblxyXG4vLyBhbmltYXRpb24gLSBwYXVzZSAtPiByZWxvYWRcclxuXHJcbmZ1bmN0aW9uIGFuaW1hdGVQYXVzZVRvUmVsb2FkKCkge1xyXG4gICAgbGV0IHN0ZXBzID0gMTtcclxuICAgIGxldCBvZmZzZXQgPSAxNjtcclxuXHJcbiAgICBmdW5jdGlvbiBhbmltYXRlQXJjKCkge1xyXG4gICAgICAgIGlmIChvZmZzZXQgPiAwKSB7XHJcbiAgICAgICAgICAgIG9mZnNldCAtPSAxO1xyXG4gICAgICAgICAgICBpY29ucy5hcmMxLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBgc3Ryb2tlLWRhc2hvZmZzZXQ6JHtvZmZzZXR9cHhgKTtcclxuICAgICAgICAgICAgaWNvbnMuYXJjMi5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYHN0cm9rZS1kYXNob2Zmc2V0OiR7b2Zmc2V0fXB4YCk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZUFyYyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWNvbnMuYXJjMS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3N0cm9rZS1kYXNob2Zmc2V0OjAnKTtcclxuICAgICAgICAgICAgaWNvbnMuYXJjMi5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3N0cm9rZS1kYXNob2Zmc2V0OjAnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYW5pbWF0ZSgpIHtcclxuICAgICAgICBpZiAoc3RlcHMgPD0gMTApIHtcclxuICAgICAgICAgICAgaWNvbnMucG9seWdvbjEuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBgXHJcbiAgICAgICAgICAgICAgICAkezEwIC0gKHN0ZXBzICogMC40KSA+IDYgPyAxMCAtIChzdGVwcyAqIDAuNCkgOiA2fSwkezEwICsgc3RlcHMgPCAyMCA/IDEwICsgc3RlcHMgOiAyMH0gXHJcbiAgICAgICAgICAgICAgICAxMCwkezMwIC0gKHN0ZXBzICogMC40KSA+IDI2ID8gMzAgLSAoc3RlcHMgKiAwLjQpIDogMjZ9IFxyXG4gICAgICAgICAgICAgICAgJHsxOCAtIChzdGVwcyAqIDAuOCkgPiAxMCA/IDE4IC0gKHN0ZXBzICogMC44KSA6IDEwfSwkezMwIC0gKHN0ZXBzICogMC40KSA+IDI2ID8gMzAgLSAoc3RlcHMgKiAwLjQpIDogMjZ9IFxyXG4gICAgICAgICAgICAgICAgJHsxOCAtIChzdGVwcyAqIDAuNCkgPiAxNCA/IDE4IC0gKHN0ZXBzICogMC40KSA6IDE0fSwkezEwICsgc3RlcHMgPCAyMCA/IDEwICsgc3RlcHMgOiAyMH1cclxuICAgICAgICAgICAgYCk7XHJcbiAgICAgICAgICAgIGljb25zLnBvbHlnb24yLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgYFxyXG4gICAgICAgICAgICAgICAgJHsyMiArIChzdGVwcyAqIDAuOCkgPCAzMCA/IDIyICsgKHN0ZXBzICogMC44KSA6IDMwfSwkezEwICsgKHN0ZXBzICogMC40KSA8IDE0ID8gMTAgKyAoc3RlcHMgKiAwLjQpIDogMTR9IFxyXG4gICAgICAgICAgICAgICAgJHsyMiArIChzdGVwcyAqIDAuNCkgPCAyNiA/IDIyICsgKHN0ZXBzICogMC40KSA6IDI2fSwkezMwIC0gc3RlcHMgPiAyMCA/IDMwIC0gc3RlcHMgOiAyMH0gXHJcbiAgICAgICAgICAgICAgICAgJHszMCArIChzdGVwcyAqIDAuNCkgPCAzNCA/IDMwICsgKHN0ZXBzICogMC40KSA6IDM0fSwkezMwIC0gc3RlcHMgPiAyMCA/IDMwIC0gc3RlcHMgOiAyMH0gXHJcbiAgICAgICAgICAgICAgICAzMCwkezEwICsgKHN0ZXBzICogMC40KSA8IDE0ID8gMTAgKyAoc3RlcHMgKiAwLjQpIDogMTR9XHJcbiAgICAgICAgICAgIGApO1xyXG4gICAgICAgICAgICBzdGVwcyArPSAxO1xyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFuaW1hdGVBcmMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhbmltYXRlKCk7XHJcbn1cclxuXHJcbi8vIGFuaW1hdGlvbiAtIHJlbG9hZCAtPiBwbGF5XHJcblxyXG5mdW5jdGlvbiBhbmltYXRlUmVsb2FkVG9QbGF5KCkge1xyXG4gICAgbGV0IHN0ZXBzID0gMTtcclxuICAgIGxldCBvZmZzZXQgPSAwO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFuaW1hdGUoKSB7XHJcbiAgICAgICAgaWYgKHN0ZXBzIDw9IDEwKSB7XHJcbiAgICAgICAgICAgIGljb25zLnBvbHlnb24xLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgYFxyXG4gICAgICAgICAgICAgICAgJHs2ICsgKHN0ZXBzICogMC40KSA8IDEwID8gNiArIChzdGVwcyAqIDAuNCkgOiAxMH0sJHsyMCAtIHN0ZXBzID4gMTAgPyAyMCAtIHN0ZXBzIDogMTB9IFxyXG4gICAgICAgICAgICAgICAgMTAsJHsyNiArIChzdGVwcyAqIDAuNCkgPCAzMCA/IDI2ICsgKHN0ZXBzICogMC40KSA6IDMwfSBcclxuICAgICAgICAgICAgICAgICR7MTAgKyBzdGVwcyA8IDIwID8gMTAgKyBzdGVwcyA6IDIwfSwkezI2IC0gKHN0ZXBzICogMC4xKSA+IDI1ID8gMjYgLSAoc3RlcHMgKiAwLjEpIDogMjV9IFxyXG4gICAgICAgICAgICAgICAgJHsxNCArIChzdGVwcyAqIDAuNikgPCAyMCA/IDE0ICsgKHN0ZXBzICogMC42KSA6IDIwfSwkezIwIC0gKHN0ZXBzICogMC41KSA+IDE1ID8gMjAgLSAoc3RlcHMgKiAwLjUpIDogMTV9XHJcbiAgICAgICAgICAgIGApO1xyXG4gICAgICAgICAgICBpY29ucy5wb2x5Z29uMi5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsIGBcclxuICAgICAgICAgICAgICAgICR7MzAgLSBzdGVwcyA+IDIwID8gMzAgLSBzdGVwcyA6IDIwfSwkezE0ICsgKHN0ZXBzICogMC4xKSA8IDE1ID8gMTQgKyAoc3RlcHMgKiAwLjEpIDogMTV9IFxyXG4gICAgICAgICAgICAgICAgJHsyNiAtIChzdGVwcyAqIDAuNikgPiAyMCA/IDI2IC0gKHN0ZXBzICogMC42KSA6IDIwfSwkezIwICsgKHN0ZXBzICogMC41KSA8IDI1ID8gMjAgKyAoc3RlcHMgKiAwLjUpIDogMjV9IFxyXG4gICAgICAgICAgICAgICAgJHszNCAtIChzdGVwcyAqIDAuNCkgPiAzMCA/IDM0IC0gKHN0ZXBzICogMC40KSA6IDMwfSwyMCBcclxuICAgICAgICAgICAgICAgIDMwLCR7MTQgKyAoc3RlcHMgKiAwLjYpIDwgMjAgPyAxNCArIChzdGVwcyAqIDAuNikgOiAyMH1cclxuICAgICAgICAgICAgYCk7XHJcbiAgICAgICAgICAgIHN0ZXBzICs9IDE7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFuaW1hdGVBcmMoKSB7XHJcbiAgICAgICAgaWYgKG9mZnNldCA8IDE2KSB7XHJcbiAgICAgICAgICAgIG9mZnNldCArPSAxO1xyXG4gICAgICAgICAgICBpY29ucy5hcmMxLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBgc3Ryb2tlLWRhc2hvZmZzZXQ6JHtvZmZzZXR9cHhgKTtcclxuICAgICAgICAgICAgaWNvbnMuYXJjMi5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYHN0cm9rZS1kYXNob2Zmc2V0OiR7b2Zmc2V0fWApO1xyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGVBcmMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGljb25zLmFyYzEucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xyXG4gICAgICAgICAgICBpY29ucy5hcmMyLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcclxuICAgICAgICAgICAgYW5pbWF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFuaW1hdGVBcmMoKTtcclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIGFuaW1hdGVQbGF5VG9QYXVzZSBhcyBwbGF5VG9QYXVzZSxcclxuICAgIGFuaW1hdGVQYXVzZVRvUGxheSBhcyBwYXVzZVRvUGxheSxcclxuICAgIGFuaW1hdGVQYXVzZVRvUmVsb2FkIGFzIHBhdXNlVG9SZWxvYWQsXHJcbiAgICBhbmltYXRlUmVsb2FkVG9QbGF5IGFzIHJlbG9hZFRvUGxheSxcclxufTtcclxuIiwiaW1wb3J0IHsgcGxheVRvUGF1c2UsIHBhdXNlVG9QbGF5LCBwYXVzZVRvUmVsb2FkLCByZWxvYWRUb1BsYXkgfSBmcm9tICcuL2J1dHRvbnMnO1xyXG5cclxuLyogUGxheWVyIHN0YXJ0cywgc3RvcHMsIHJlc3VtZXMgb3IgcmVsb2FkcyBzbGlkZSBzaG93ICovXHJcblxyXG4vLyBhcnJheSBvZiBhbGwgc2xpZGVzXHJcbmNvbnN0IHNsaWRlcyA9IFtdO1xyXG4vLyBzZXQgb2YgYWxsIGVsZW1lbnRzIHVzZWQgaW4gYW5pbWF0aW9ucy4gTmVlZGVkIGZvciByZXN0YXJ0aW5nLCBzZXR0aW5nIGVsZW1lbnRzIHRvIHN0YXJ0aW5nIHBvc2l0aW9uc1xyXG5jb25zdCBvYmplY3RMaXN0ID0gbmV3IFNldCgpO1xyXG5sZXQgY3VycmVudFNsaWRlID0gMDtcclxubGV0IHN0YXR1cyA9ICdub3Qgc3RhcnRlZCc7XHJcblxyXG5mdW5jdGlvbiBzdGFydCgpIHtcclxuICAgIGN1cnJlbnRTbGlkZSA9IDA7XHJcbiAgICBzbGlkZXNbY3VycmVudFNsaWRlXS5wbGF5KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc2V0KCkge1xyXG4gICAgb2JqZWN0TGlzdC5mb3JFYWNoKChlbCkgPT4geyBlbC5yZXNldCgpOyB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVzdW1lKCkge1xyXG4gICAgaWYgKGN1cnJlbnRTbGlkZSArIDEgPj0gc2xpZGVzLmxlbmd0aCkge1xyXG4gICAgICAgIHN0YXR1cyA9ICdmaW5pc2hlZCc7XHJcbiAgICAgICAgcGF1c2VUb1JlbG9hZCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjdXJyZW50U2xpZGUgKz0gMTtcclxuICAgICAgICBzbGlkZXNbY3VycmVudFNsaWRlXS5wbGF5KCk7XHJcbiAgICAgICAgcGxheVRvUGF1c2UoKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY29udHJvbFBsYXllcigpIHtcclxuICAgIGlmIChzbGlkZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBzbGlkZXMgdG8gYW5pbWF0ZS4gQWRkIHNsaWRlcyB1c2luZyBcImFkZFNsaWRlc1wiIGZ1bmN0aW9uLicpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzdGF0dXMgPT09ICdmaW5pc2hlZCcpIHtcclxuICAgICAgICBzdGF0dXMgPSAnbm90IHN0YXJ0ZWQnO1xyXG4gICAgICAgIHJlc2V0KCk7XHJcbiAgICAgICAgcmVsb2FkVG9QbGF5KCk7XHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gJ3BsYXlpbmcnKSB7XHJcbiAgICAgICAgc3RhdHVzID0gJ3BhdXNlZCc7XHJcbiAgICAgICAgcGF1c2VUb1BsYXkoKTtcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSAncGF1c2VkJykge1xyXG4gICAgICAgIHN0YXR1cyA9ICdwbGF5aW5nJztcclxuICAgICAgICByZXN1bWUoKTtcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSAnbm90IHN0YXJ0ZWQnKSB7XHJcbiAgICAgICAgc3RhdHVzID0gJ3BsYXlpbmcnO1xyXG4gICAgICAgIHN0YXJ0KCk7XHJcbiAgICAgICAgcGxheVRvUGF1c2UoKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbmV4dChkZWxheSkge1xyXG4gICAgaWYgKGN1cnJlbnRTbGlkZSArIDEgPj0gc2xpZGVzLmxlbmd0aCkge1xyXG4gICAgICAgIHN0YXR1cyA9ICdmaW5pc2hlZCc7XHJcbiAgICAgICAgcGF1c2VUb1JlbG9hZCgpO1xyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgIT09ICdwYXVzZWQnKSB7XHJcbiAgICAgICAgY3VycmVudFNsaWRlICs9IDE7XHJcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4geyBzbGlkZXNbY3VycmVudFNsaWRlXS5wbGF5KCk7IH0sIGRlbGF5KTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gYWRkU2xpZGVzKC4uLnNsaWRlKSB7XHJcbiAgICBzbGlkZXMucHVzaCguLi5zbGlkZSk7XHJcbn1cclxuZnVuY3Rpb24gYWRkT2JqZWN0cyhvYmplY3QpIHtcclxuICAgIG9iamVjdExpc3QuYWRkKG9iamVjdCk7XHJcbn1cclxuXHJcbmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdidXR0b24tY2xpY2snLCBjb250cm9sUGxheWVyLCBmYWxzZSk7XHJcblxyXG5leHBvcnQgeyBhZGRTbGlkZXMsIGFkZE9iamVjdHMsIG5leHQgfTtcclxuXHJcbiIsImNvbnN0IHV0aWxzID0ge1xyXG4gICAgdW5kZWY6IGl0ZW0gPT4gKHR5cGVvZiBpdGVtID09PSAndW5kZWZpbmVkJyksICAgLy8gY2hlY2sgaWYgYXJndW1lbnQgaXMgdW5kZWZpbmVkXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCB1dGlscztcclxuIiwiaW1wb3J0IHV0aWxzIGZyb20gJy4vLi4vLi4vdXRpbHMnO1xyXG5cclxuLyogRGVmaW5lIG1vc3QgZWZmaWNpZW50IGZ1bmN0aW9uIHVzZWQgdG8gYW5pbWF0ZSB0cmFuc2Zvcm0gcHJvcGVydHksIHRoZW4gYWRkIGl0IHRvIGFycmF5IG9mIGZ1bmN0aW9ucyBmb3IgYW5pbWF0aW9uICovXHJcblxyXG5mdW5jdGlvbiBjYWxjdWxhdGVUcmFuc2Zvcm0oZWwpIHtcclxuICAgIGNvbnN0IHRhcmdldFRyYW5zZm9ybSA9IGVsLnRyYW5zZm9ybTtcclxuXHJcbiAgICAvLyBjaGVjayBpZiB0cmFuc2Zvcm0gYW5pbWF0aW9uIGlzIHJlcXVlc3RlZFxyXG4gICAgaWYgKCF1dGlscy51bmRlZih0YXJnZXRUcmFuc2Zvcm0pKSB7XHJcbiAgICAgICAgbGV0IGFuaW1hdGVGdW5jO1xyXG4gICAgICAgIGxldCB1cGRhdGVGdW5jO1xyXG4gICAgICAgIGNvbnN0IG9iamVjdCA9IGVsLm9iamVjdDtcclxuICAgICAgICBjb25zdCBzdGFydGluZ1RyYW5zZm9ybSA9IGVsLm9iamVjdC50cjtcclxuXHJcbiAgICAgICAgY29uc3QgZGVsdGFTY2FsZSA9IHRhcmdldFRyYW5zZm9ybS5zY2FsZSAtIHN0YXJ0aW5nVHJhbnNmb3JtLnNjYWxlO1xyXG4gICAgICAgIGNvbnN0IGRlbHRhUm90YXRlID0gdGFyZ2V0VHJhbnNmb3JtLnJvdGF0ZSAtIHN0YXJ0aW5nVHJhbnNmb3JtLnJvdGF0ZTtcclxuICAgICAgICBsZXQgZGVsdGEwO1xyXG4gICAgICAgIGxldCBkZWx0YTE7XHJcbiAgICAgICAgaWYgKCF1dGlscy51bmRlZih0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlKSkge1xyXG4gICAgICAgICAgICBkZWx0YTAgPSAodGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVswXSkgLSBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGVbMF07XHJcbiAgICAgICAgICAgIGRlbHRhMSA9ICh0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlWzFdKSAtIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZVsxXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIC0tLS0tLS0tIHRyYW5zZm9ybXMgd2l0aG91dCB0cmFuc2xhdGlvbiAtLS0tLS0tLSAqL1xyXG4gICAgICAgIGlmICh1dGlscy51bmRlZih0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlKSkge1xyXG4gICAgICAgICAgICBpZiAodXRpbHMudW5kZWYodGFyZ2V0VHJhbnNmb3JtLnJvdGF0ZSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIG9ubHkgc2NhbGluZ1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZUZ1bmMgPSAodCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5zY2FsZShzdGFydGluZ1RyYW5zZm9ybS5zY2FsZSArIChkZWx0YVNjYWxlICogdCkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUZ1bmMgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnNjYWxlKHRhcmdldFRyYW5zZm9ybS5zY2FsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0uc2NhbGUgPSB0YXJnZXRUcmFuc2Zvcm0uc2NhbGU7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHV0aWxzLnVuZGVmKHRhcmdldFRyYW5zZm9ybS5zY2FsZSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIG9ubHkgcm90YXRpb25cclxuICAgICAgICAgICAgICAgIGFuaW1hdGVGdW5jID0gKHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3Qucm90YXRlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5yb3RhdGUgKyAoZGVsdGFSb3RhdGUgKiB0KSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlRnVuYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3Qucm90YXRlKHRhcmdldFRyYW5zZm9ybS5yb3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnJvdGF0ZSA9IHRhcmdldFRyYW5zZm9ybS5yb3RhdGU7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gc2NhbGluZyBhbmQgcm90YXRpbmdcclxuICAgICAgICAgICAgICAgIGFuaW1hdGVGdW5jID0gKHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3Quc2NhbGVBbmRSb3RhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnNjYWxlICsgKGRlbHRhU2NhbGUgKiB0KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0ucm90YXRlICsgKGRlbHRhUm90YXRlICogdCkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUZ1bmMgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnNjYWxlQW5kUm90YXRlKHRhcmdldFRyYW5zZm9ybS5zY2FsZSwgdGFyZ2V0VHJhbnNmb3JtLnJvdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0uc2NhbGUgPSB0YXJnZXRUcmFuc2Zvcm0uc2NhbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0ucm90YXRlID0gdGFyZ2V0VHJhbnNmb3JtLnJvdGF0ZTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAvKiAtLS0tLS0tLSB0cmFuc2Zvcm1zIHdpdGggdHJhbnNsYXRpb24gLS0tLS0tLS0gKi9cclxuICAgICAgICB9IGVsc2UgaWYgKHV0aWxzLnVuZGVmKHRhcmdldFRyYW5zZm9ybS5zY2FsZSkgJiYgdXRpbHMudW5kZWYodGFyZ2V0VHJhbnNmb3JtLnJvdGF0ZSkpIHtcclxuICAgICAgICAgICAgLy8gb25seSB0cmFuc2xhdGlvblxyXG4gICAgICAgICAgICBhbmltYXRlRnVuYyA9ICh0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3QudHJhbnNsYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZVswXSArIChkZWx0YTAgKiB0KSxcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGVbMV0gKyAoZGVsdGExICogdCkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB1cGRhdGVGdW5jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LnRyYW5zbGF0ZShcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGVbMV0pO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlID0gdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2UgaWYgKHV0aWxzLnVuZGVmKHRhcmdldFRyYW5zZm9ybS5yb3RhdGUpKSB7XHJcbiAgICAgICAgICAgIC8vIHNjYWxlIGFuZCB0cmFuc2xhdGlvblxyXG4gICAgICAgICAgICBhbmltYXRlRnVuYyA9ICh0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3Quc2NhbGVBbmRUcmFuc2xhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0uc2NhbGUgKyAoZGVsdGFTY2FsZSAqIHQpLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZVswXSArIChkZWx0YTAgKiB0KSxcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGVbMV0gKyAoZGVsdGExICogdCkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB1cGRhdGVGdW5jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LnNjYWxlQW5kVHJhbnNsYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRyYW5zZm9ybS5zY2FsZSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGVbMV0pO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0uc2NhbGUgPSB0YXJnZXRUcmFuc2Zvcm0uc2NhbGU7XHJcbiAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGUgPSB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRhcmdldFRyYW5zZm9ybS5zY2FsZSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgLy8gcm90YXRpb24gYW5kIHRyYW5zbGF0aW9uXHJcbiAgICAgICAgICAgIGFuaW1hdGVGdW5jID0gKHQpID0+IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdC5yb3RhdGVBbmRUcmFuc2xhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0ucm90YXRlICsgKGRlbHRhUm90YXRlICogdCksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlWzBdICsgKGRlbHRhMCAqIHQpLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZVsxXSArIChkZWx0YTEgKiB0KSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHVwZGF0ZUZ1bmMgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3Qucm90YXRlQW5kVHJhbnNsYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRyYW5zZm9ybS5yb3RhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVswXSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlWzFdKTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnJvdGF0ZSA9IHRhcmdldFRyYW5zZm9ybS5yb3RhdGU7XHJcbiAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGUgPSB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHNjYWxlLCByb3RhdGlvbiBhbmQgdHJhbnNsYXRpb25cclxuICAgICAgICAgICAgYW5pbWF0ZUZ1bmMgPSAodCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LnNjYWxlQW5kUm90YXRlQW5kVHJhbnNsYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnNjYWxlICsgKGRlbHRhU2NhbGUgKiB0KSxcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5yb3RhdGUgKyAoZGVsdGFSb3RhdGUgKiB0KSxcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGVbMF0gKyAoZGVsdGEwICogdCksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlWzFdICsgKGRlbHRhMSAqIHQpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdXBkYXRlRnVuYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdC5zY2FsZUFuZFJvdGF0ZUFuZFRyYW5zbGF0ZShcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0uc2NhbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnJvdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGVbMV0pO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0uc2NhbGUgPSB0YXJnZXRUcmFuc2Zvcm0uc2NhbGU7XHJcbiAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5yb3RhdGUgPSB0YXJnZXRUcmFuc2Zvcm0ucm90YXRlO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlID0gdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBbYW5pbWF0ZUZ1bmMsIHVwZGF0ZUZ1bmNdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjYWxjdWxhdGVUcmFuc2Zvcm07XHJcbiIsImltcG9ydCB1dGlscyBmcm9tICcuLy4uLy4uL3V0aWxzJztcclxuXHJcbi8qIERlZmluZSBmdW5jdGlvbiB1c2VkIHRvIGFuaW1hdGUgYXR0cmlidXRlcywgdGhlbiBhZGQgaXQgdG8gYXJyYXkgb2YgZnVuY3Rpb25zIGZvciBhbmltYXRpb24gKi9cclxuXHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZUF0dHJpYnV0ZXMoZWwpIHtcclxuICAgIGNvbnN0IHRhYmxlID0gW107XHJcblxyXG4gICAgZnVuY3Rpb24gYW5pbWF0ZUZ1bmModCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFibGUubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgZWwub2JqZWN0Lm9iai5zZXRBdHRyaWJ1dGUodGFibGVbaV1bMF0sIHRhYmxlW2ldWzFdICsgKCh0YWJsZVtpXVsyXSAtIHRhYmxlW2ldWzFdKSAqIHQpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlRnVuYygpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhYmxlLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGVsLm9iamVjdC5vYmouc2V0QXR0cmlidXRlKHRhYmxlW2ldWzBdLCB0YWJsZVtpXVsyXSk7XHJcbiAgICAgICAgICAgIGVsLm9iamVjdC52YXJpYWJsZXMuc2V0KHRhYmxlW2ldWzBdLCB0YWJsZVtpXVsyXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gY2hlY2sgaWYgYXR0cmlidXRlcyBhbmltYXRpb24gaXMgcmVxdWVzdGVkXHJcbiAgICBpZiAoIXV0aWxzLnVuZGVmKGVsLmF0dHJpYnV0ZXMpICYmIGVsLmF0dHJpYnV0ZXMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgY29uc3QgYXR0cmlidXRlcyA9IEFycmF5LmlzQXJyYXkoZWwuYXR0cmlidXRlcykgPyBlbC5hdHRyaWJ1dGVzIDogW2VsLmF0dHJpYnV0ZXNdO1xyXG4gICAgICAgIC8vIGZvciBldmVyeSBhdHRyaWJ1dGVcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgLy8gcHJvcGVydHkgbmFtZVxyXG4gICAgICAgICAgICBjb25zdCBuYW1lID0gYXR0cmlidXRlc1tpXS5uYW1lO1xyXG5cclxuICAgICAgICAgICAgLy8gc3RhcnRpbmcgdmFsdWVcclxuICAgICAgICAgICAgY29uc3QgZnJvbSA9IHV0aWxzLnVuZGVmKGF0dHJpYnV0ZXNbaV0uZnJvbSkgPyBlbC5vYmplY3QudmFyaWFibGVzLmdldChuYW1lKSA6IGF0dHJpYnV0ZXNbaV0uZnJvbTtcclxuXHJcbiAgICAgICAgICAgIC8vIHRocm93IGVycm9yIGlmIHN0YXJ0aW5nIHZhbHVlIGlzIG5vdCBkZWZpbmVkLiBOZWl0aGVyIGluIHJlcXVlc3Qgbm9yIGluIERPTSBlbGVtZW50XHJcbiAgICAgICAgICAgIGlmICh1dGlscy51bmRlZihmcm9tKSkgeyB0aHJvdyBuZXcgRXJyb3IoYE5vIFwiZnJvbVwiIHZhbHVlLCBmb3IgJHtuYW1lfWApOyB9XHJcblxyXG4gICAgICAgICAgICAvLyB0YXJnZXQgdmFsdWVcclxuICAgICAgICAgICAgY29uc3QgdG8gPSBhdHRyaWJ1dGVzW2ldLnRvO1xyXG5cclxuICAgICAgICAgICAgdGFibGUucHVzaChbbmFtZSwgZnJvbSwgdG9dKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFthbmltYXRlRnVuYywgdXBkYXRlRnVuY107XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNhbGN1bGF0ZUF0dHJpYnV0ZXM7XHJcbiIsImltcG9ydCB1dGlscyBmcm9tICcuLy4uLy4uL3V0aWxzJztcclxuXHJcbi8qIGZ1bmN0aW9uIHRoYXQgcmVtb3ZlcyBhdHRyaWJ1dGVzICovXHJcblxyXG5mdW5jdGlvbiBjYWxjdWxhdGVSZW1vdmUoZWwpIHtcclxuICAgIGNvbnN0IHJlbW92ZSA9IGVsLnJlbW92ZTtcclxuICAgIGxldCByZW1vdmVGdW5jO1xyXG4gICAgbGV0IHVwZGF0ZUZ1bmM7XHJcblxyXG4gICAgLy8gY2hlY2sgaWYgdGhlcmUgYXJlIGF0dHJpYnV0ZXMgdG8gcmVtb3ZlXHJcbiAgICBpZiAoIXV0aWxzLnVuZGVmKHJlbW92ZSkpIHtcclxuICAgICAgICBjb25zdCBzdGFydCA9IFtdOyAvLyBhcnJheSBvZiBhdHRyaWJ1dGVzIHJlbW92ZWQgYXQgc3RhcnRcclxuICAgICAgICBjb25zdCBlbmQgPSBbXTsgLy8gYXJyYXkgb2YgYXR0cmlidXRlcyByZW1vdmVkIGF0IGVuZFxyXG4gICAgICAgIGNvbnN0IGl0ZW1zID0gQXJyYXkuaXNBcnJheShyZW1vdmUpID8gcmVtb3ZlIDogW3JlbW92ZV07XHJcblxyXG4gICAgICAgIC8vIGFkZCBhdHRyaWJ1dGVzIHRvIHN0YXJ0L2VuZCBhcnJheVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW1zW2ldLndoZW4gPT09ICdlbmQnKSB7XHJcbiAgICAgICAgICAgICAgICBlbmQucHVzaChpdGVtc1tpXSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzdGFydC5wdXNoKGl0ZW1zW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyByZW1vdmUgYXR0cmlidXRlcyBhdCBzdGFydFxyXG4gICAgICAgIGlmIChzdGFydC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFydC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgZWwub2JqZWN0Lm9iai5yZW1vdmVBdHRyaWJ1dGUoc3RhcnRbaV0ubmFtZSk7XHJcbiAgICAgICAgICAgICAgICBlbC5vYmplY3QudmFyaWFibGVzLmRlbGV0ZShzdGFydFtpXS5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBkZWZpbmUgYW5kIHJldHVybiBmdW5jdGlvbiB0byByZW1vdmUgYXR0cmlidXRlcyBhdCB0aGUgZW5kXHJcbiAgICAgICAgaWYgKGVuZC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmVtb3ZlRnVuYyA9ICgpID0+IGZhbHNlO1xyXG4gICAgICAgICAgICB1cGRhdGVGdW5jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbmQubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbC5vYmplY3Qub2JqLnJlbW92ZUF0dHJpYnV0ZShlbmRbaV0ubmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwub2JqZWN0LnZhcmlhYmxlcy5kZWxldGUoZW5kW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gW3JlbW92ZUZ1bmMsIHVwZGF0ZUZ1bmNdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2FsY3VsYXRlUmVtb3ZlO1xyXG4iLCJpbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi8uLi91dGlscyc7XHJcblxyXG4vKiBmdW5jdGlvbiB0aGF0IHNldHMgYXR0cmlidXRlcyAqL1xyXG5cclxuZnVuY3Rpb24gY2FsY3VsYXRlU2V0KGVsKSB7XHJcbiAgICBjb25zdCBzZXQgPSBlbC5zZXQ7XHJcbiAgICBsZXQgc2V0RnVuYztcclxuICAgIGxldCB1cGRhdGVGdW5jO1xyXG5cclxuICAgIC8vIGNoZWNrIGlmIHRoZXJlIGFyZSBhdHRyaWJ1dGVzIHRvIHNldFxyXG4gICAgaWYgKCF1dGlscy51bmRlZihzZXQpKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBbXTsgLy8gYXJyYXkgb2YgYXR0cmlidXRlcyBzZXQgYXQgc3RhcnRcclxuICAgICAgICBjb25zdCBlbmQgPSBbXTsgLy8gYXJyYXkgb2YgYXR0cmlidXRlcyBzZXQgYXQgZW5kXHJcbiAgICAgICAgY29uc3QgaXRlbXMgPSBBcnJheS5pc0FycmF5KHNldCkgPyBzZXQgOiBbc2V0XTtcclxuXHJcbiAgICAgICAgLy8gYWRkIGF0dHJpYnV0ZXMgdG8gc3RhcnQvZW5kIGFycmF5XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBpZiAoaXRlbXNbaV0ud2hlbiA9PT0gJ2VuZCcpIHtcclxuICAgICAgICAgICAgICAgIGVuZC5wdXNoKGl0ZW1zW2ldKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0LnB1c2goaXRlbXNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldCBhdHRyaWJ1dGVzIGF0IHN0YXJ0XHJcbiAgICAgICAgaWYgKHN0YXJ0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXJ0Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICBlbC5vYmplY3Qub2JqLnNldEF0dHJpYnV0ZShzdGFydFtpXS5uYW1lLCBzdGFydFtpXS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBlbC5vYmplY3QudmFyaWFibGVzLnNldChzdGFydFtpXS5uYW1lLCBzdGFydFtpXS52YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZGVmaW5lIGFuZCByZXR1cm4gZnVuY3Rpb24gdG8gc2V0IGF0dHJpYnV0ZXMgYXQgdGhlIGVuZFxyXG4gICAgICAgIGlmIChlbmQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHNldEZ1bmMgPSAoKSA9PiBmYWxzZTtcclxuICAgICAgICAgICAgdXBkYXRlRnVuYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW5kLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwub2JqZWN0Lm9iai5zZXRBdHRyaWJ1dGUoZW5kW2ldLm5hbWUsIGVuZFtpXS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwub2JqZWN0LnZhcmlhYmxlcy5zZXQoZW5kW2ldLm5hbWUsIGVuZFtpXS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBbc2V0RnVuYywgdXBkYXRlRnVuY107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjYWxjdWxhdGVTZXQ7XHJcbiIsImltcG9ydCBhbmltYXRlIGZyb20gJy4vYW5pbWF0ZSc7XHJcbmltcG9ydCB7IGFkZE9iamVjdHMgfSBmcm9tICcuLi9jb250cm9sL3BsYXllcic7XHJcbmltcG9ydCBjYWxjdWxhdGVUcmFuc2Zvcm0gZnJvbSAnLi9jYWxjdWxhdGlvbnMvdHJhbnNmb3JtJztcclxuaW1wb3J0IGNhbGN1bGF0ZUF0dHJpYnV0ZXMgZnJvbSAnLi9jYWxjdWxhdGlvbnMvYXR0cmlidXRlJztcclxuaW1wb3J0IGNhbGN1bGF0ZVJlbW92ZSBmcm9tICcuL2NhbGN1bGF0aW9ucy9yZW1vdmUnO1xyXG5pbXBvcnQgY2FsY3VsYXRlU2V0IGZyb20gJy4vY2FsY3VsYXRpb25zL3NldCc7XHJcbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscyc7XHJcblxyXG4vKiBTcGVjaWZ5IGZ1bmN0aW9ucyB1c2VkIHRvIGFuaW1hdGlvbnMsIGFuZCBzZW5kIHRoZW0gdG8gYW5pbWF0ZSBmdW5jdGlvbiAqL1xyXG5cclxuZnVuY3Rpb24gY2FsY3VsYXRlKGVsKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAvLyBkZWNsYXJlIGFycmF5IG9mIGFuaW1hdGlvbiBmdW5jdGlvbnNcclxuICAgICAgICBjb25zdCBhcnIgPSBbXTtcclxuICAgICAgICBjb25zdCBvYmplY3RzID0gQXJyYXkuaXNBcnJheShlbC5vYmplY3RzKSA/IGVsLm9iamVjdHMgOiBbZWwub2JqZWN0c107XHJcbiAgICAgICAgLy8gU2V0IGZ1bmN0aW9uIGZvciBldmVyeSBvYmplY3RcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iamVjdHMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdE9iamVjdCA9IG9iamVjdHNbaV07XHJcblxyXG4gICAgICAgICAgICAvLyBkZWZpbmUgdHJhbnNmb3JtIGFuaW1hdGlvbiBmdW5jdGlvbiwgaWYgdHJhbnNmb3JtIGFuaW1hdGlvbiBpcyByZXF1ZXN0ZWRcclxuICAgICAgICAgICAgY29uc3QgY2FsY3VsYXRlZFRyYW5zZm9ybSA9IGNhbGN1bGF0ZVRyYW5zZm9ybShyZXF1ZXN0T2JqZWN0KTtcclxuICAgICAgICAgICAgaWYgKGNhbGN1bGF0ZWRUcmFuc2Zvcm0pIHsgYXJyLnB1c2goW2NhbGN1bGF0ZWRUcmFuc2Zvcm1dKTsgfVxyXG5cclxuICAgICAgICAgICAgLy8gZGVmaW5lIGF0dHJpYnV0ZSBhbmltYXRpb24gZnVuY3Rpb24sIGlmIGF0dHJpYnV0ZSBhbmltYXRpb24gaXMgcmVxdWVzdGVkXHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGN1bGF0ZWRBdHRyaWJ1dGVzID0gY2FsY3VsYXRlQXR0cmlidXRlcyhyZXF1ZXN0T2JqZWN0KTtcclxuICAgICAgICAgICAgaWYgKGNhbGN1bGF0ZWRBdHRyaWJ1dGVzKSB7IGFyci5wdXNoKFtjYWxjdWxhdGVkQXR0cmlidXRlc10pOyB9XHJcblxyXG4gICAgICAgICAgICAvLyBkZWZpbmUgcmVtb3ZlIGF0dHJpYnV0ZSBmdW5jdGlvbiwgaWYgYXR0cmlidXRlcyBuZWVkcyB0byBiZSByZW1vdmVkXHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGN1bGF0ZWRSZW1vdmUgPSBjYWxjdWxhdGVSZW1vdmUocmVxdWVzdE9iamVjdCk7XHJcbiAgICAgICAgICAgIGlmIChjYWxjdWxhdGVkUmVtb3ZlKSB7IGFyci5wdXNoKFtjYWxjdWxhdGVkUmVtb3ZlXSk7IH1cclxuXHJcbiAgICAgICAgICAgIC8vIGRlZmluZSBzZXQgYXR0cmlidXRlIGZ1bmN0aW9uLCBpZiBhdHRyaWJ1dGVzIG5lZWRzIHRvIGJlIHNldFxyXG4gICAgICAgICAgICBjb25zdCBjYWxjdWxhdGVkU2V0ID0gY2FsY3VsYXRlU2V0KHJlcXVlc3RPYmplY3QpO1xyXG4gICAgICAgICAgICBpZiAoY2FsY3VsYXRlZFNldCkgeyBhcnIucHVzaChbY2FsY3VsYXRlZFNldF0pOyB9XHJcblxyXG4gICAgICAgICAgICAvLyBhZGQgb2JqZWN0cyB0byBvYmplY3RzIHNldCBpbiBwbGF5ZXIuanMuIE5lZWRlZCBmb3IgcmVzZXRpbmdcclxuICAgICAgICAgICAgYWRkT2JqZWN0cyhvYmplY3RzW2ldLm9iamVjdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNlbmQgYXJyYXkgb2YgZnVuY3Rpb25zIHRvIGFuaW1hdGUgZnVuY3Rpb25cclxuICAgICAgICBhbmltYXRlKFxyXG4gICAgICAgICAgICB1dGlscy51bmRlZihlbC5zcGVlZCkgPyAxIDogZWwuc3BlZWQsXHJcbiAgICAgICAgICAgIGVsLmRlbGF5IHx8IDAsXHJcbiAgICAgICAgICAgIGFycilcclxuICAgICAgICAudGhlbigoKSA9PiB7IHJlc29sdmUoKTsgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2FsY3VsYXRlO1xyXG4iLCJpbXBvcnQgY2FsY3VsYXRlIGZyb20gJy4vY2FsY3VsYXRlJztcclxuXHJcbi8qIFNwbGl0IHJlcXVlc3QgdG8gdGhyZWFkcywgYW5kIGRpc3BhdGNoIHRvIFwiY2FsY3VsYXRlXCIgZnVuY3Rpb24gKi9cclxuXHJcbmZ1bmN0aW9uIGRpc3BhdGNoKC4uLnRocmVhZHMpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgaWYgKHRocmVhZHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIC8vIHRocm93IGVycm9yLCBpZiByZXF1ZXN0IGlzIGVtcHR5XHJcbiAgICAgICAgICAgIHJlamVjdChFcnJvcignQWRkIG9iamVjdHMgdG8gXCJzdGVwXCIgZnVuY3Rpb24nKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgYXJyID0gW107XHJcbiAgICAgICAgICAgIC8vIHNlbmQgYWxsIHRocmVhZHMgdG8gY2FsY3VsYXRpb25cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aHJlYWRzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICBhcnIucHVzaChjYWxjdWxhdGUodGhyZWFkc1tpXSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGFmdGVyIGFuaW1hdGlvbiBjb21wbGV0ZWQsIHJlc29sdmUgcHJvbWlzZSB0byBsYXVuY2ggbmV4dCBzZXF1ZW5jZVxyXG4gICAgICAgICAgICBQcm9taXNlLmFsbChhcnIpLnRoZW4oKCkgPT4geyByZXNvbHZlKCk7IH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG4vLyByZW5hbWUgZWxlbWVudCBmb3IgZWFzaWVyIGFjY2Vzc1xyXG5jb25zdCBzdGVwID0gZGlzcGF0Y2g7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBzdGVwO1xyXG4iLCJpbXBvcnQgc2V0dGluZ3MgZnJvbSAnLi4vc2V0dGluZ3MnOyAvLyBpbXBvcnQgc2V0dGluZ3MgZm9yIGdldHRpbmcgYWNjZXNzIHRvIFNWRyBlbGVtZW50XHJcbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscyc7IC8vIGltcG9ydCB1dGlscyBmb3IgdXRpbHMudW5kZWZcclxuXHJcbmNsYXNzIE9iaiB7XHJcbi8qXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tQ09OU1RSVUNUT1ItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuKi9cclxuICAgIGNvbnN0cnVjdG9yKG9iaiwgdHJhbnNmb3JtID0geyB0cmFuc2xhdGU6IFswLCAwXSwgcm90YXRlOiAwLCBzY2FsZTogMSB9KSB7XHJcbiAgICAgICAgLy8gYWNjZXNzIHRvIERPTSBvYmplY3RcclxuICAgICAgICB0aGlzLm9iaiA9IG9iajtcclxuICAgICAgICAvLyBjcmVhdGUgemVybyBtYXRyaXhcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeCA9IHNldHRpbmdzLnN2Zy5jcmVhdGVTVkdNYXRyaXgoKTtcclxuICAgICAgICAvLyBzZXQgc3RhcnRpbmcgdmFyaWFibGVzLCBhbmQgZGVjbGFyZSB0aGlzLnN0YXJ0aW5nVmFyaWFibGVzIGFuZCB0aGlzLnZhcmlhYmxlc1xyXG4gICAgICAgIHRoaXMuc2V0U3RhcnRpbmdWYXJpYWJsZXModHJhbnNmb3JtKTtcclxuICAgICAgICAvLyBzZXQgaW5pdGlhbCBtYXRyaXhcclxuICAgICAgICB0aGlzLnNldEluaXRpYWxNYXRyaXgoKTtcclxuXHJcbiAgICAgICAgLyogLS0tLS0tLS0gc2hvcnRjdXRzIC0tLS0tLS0tICovXHJcblxyXG4gICAgICAgIC8vIHRvIG1hdHJpeCBpbnRlcmZhY2UgLT4gdGhpcy5TVkdUcmFuc2Zvcm1cclxuXHJcbiAgICAgICAgLy8gdG8gY3VycmVudCB0cmFuc2Zvcm1cclxuICAgICAgICB0aGlzLnRyID0gdGhpcy52YXJpYWJsZXMuZ2V0KCd0cmFuc2Zvcm0nKTtcclxuICAgIH1cclxuXHJcbi8qXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1JTklUSUFMSVpJTkcgTUVUSE9EUy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuKi9cclxuXHJcblxyXG4gICAgc2V0U3RhcnRpbmdWYXJpYWJsZXModHJhbnNmb3JtKSB7XHJcbiAgICAgICAgY29uc3QgbWFwID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5vYmouYXR0cmlidXRlcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vYmouYXR0cmlidXRlc1tpXS5zcGVjaWZpZWQgJiYgdGhpcy5vYmouYXR0cmlidXRlc1tpXS5uYW1lICE9PSAndHJhbnNmb3JtJykge1xyXG4gICAgICAgICAgICAgICAgbWFwLnNldCh0aGlzLm9iai5hdHRyaWJ1dGVzW2ldLm5hbWUsIHBhcnNlRmxvYXQodGhpcy5vYmouYXR0cmlidXRlc1tpXS52YWx1ZSkgfHwgdGhpcy5vYmouYXR0cmlidXRlc1tpXS52YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdGFydGluZ1ZhcmlhYmxlcyA9IG5ldyBNYXAobWFwKTtcclxuICAgICAgICB0aGlzLnZhcmlhYmxlcyA9IG5ldyBNYXAobWFwKTtcclxuXHJcbiAgICAgICAgLy8gcmVmZXJlbmNlIHNoaXRcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBbdGhpcy5zdGFydGluZ1ZhcmlhYmxlcywgdGhpcy52YXJpYWJsZXNdW2ldLnNldCgndHJhbnNmb3JtJywge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlOiB1dGlscy51bmRlZih0cmFuc2Zvcm0udHJhbnNsYXRlKSA/IFswLCAwXSA6IHRyYW5zZm9ybS50cmFuc2xhdGUsXHJcbiAgICAgICAgICAgICAgICBzY2FsZTogdXRpbHMudW5kZWYodHJhbnNmb3JtLnNjYWxlKSA/IDEgOiB0cmFuc2Zvcm0uc2NhbGUsXHJcbiAgICAgICAgICAgICAgICByb3RhdGU6IHV0aWxzLnVuZGVmKHRyYW5zZm9ybS5yb3RhdGUpID8gMCA6IHRyYW5zZm9ybS5yb3RhdGUsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRJbml0aWFsTWF0cml4KCkge1xyXG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IHRoaXMudmFyaWFibGVzLmdldCgndHJhbnNmb3JtJyk7XHJcbiAgICAgICAgdGhpcy5vYmoudHJhbnNmb3JtLmJhc2VWYWwuaW5pdGlhbGl6ZShzZXR0aW5ncy5zdmcuY3JlYXRlU1ZHVHJhbnNmb3JtRnJvbU1hdHJpeCh0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeCkpO1xyXG4gICAgICAgIHRoaXMuU1ZHVHJhbnNmb3JtID0gdGhpcy5vYmoudHJhbnNmb3JtLmJhc2VWYWwuZ2V0SXRlbSgwKTtcclxuICAgICAgICB0aGlzLnNjYWxlQW5kUm90YXRlQW5kVHJhbnNsYXRlKHRyYW5zZm9ybS5zY2FsZSwgdHJhbnNmb3JtLnJvdGF0ZSwgdHJhbnNmb3JtLnRyYW5zbGF0ZVswXSwgdHJhbnNmb3JtLnRyYW5zbGF0ZVsxXSk7XHJcbiAgICB9XHJcblxyXG4vKlxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tT1RIRVItTUVUSE9EUy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiovXHJcblxyXG4gICAgc2V0TWF0cml4KG1hdHJpeCkgeyB0aGlzLlNWR1RyYW5zZm9ybS5zZXRNYXRyaXgobWF0cml4KTsgfVxyXG5cclxuICAgIHJlc2V0KCkge1xyXG4gICAgICAgIC8vIHJlc2V0IHZhcmlhYmxlc1xyXG4gICAgICAgIHRoaXMudmFyaWFibGVzID0gbmV3IE1hcCh0aGlzLnN0YXJ0aW5nVmFyaWFibGVzKTtcclxuICAgICAgICAvLyByZWZlcmVuY2Ugc2hpdFxyXG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IHRoaXMuc3RhcnRpbmdWYXJpYWJsZXMuZ2V0KCd0cmFuc2Zvcm0nKTtcclxuICAgICAgICB0aGlzLnZhcmlhYmxlcy5zZXQoJ3RyYW5zZm9ybScsIHtcclxuICAgICAgICAgICAgdHJhbnNsYXRlOiB0cmFuc2Zvcm0udHJhbnNsYXRlLFxyXG4gICAgICAgICAgICBzY2FsZTogdHJhbnNmb3JtLnNjYWxlLFxyXG4gICAgICAgICAgICByb3RhdGU6IHRyYW5zZm9ybS5yb3RhdGUsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy50ciA9IHRoaXMudmFyaWFibGVzLmdldCgndHJhbnNmb3JtJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IG9iaiA9IHRoaXMub2JqO1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgYWxsIGF0dHJpYnV0ZXMgZnJvbSBlbGVtZW50IERPTVxyXG4gICAgICAgIGZvciAobGV0IGkgPSBvYmouYXR0cmlidXRlcy5sZW5ndGggLSAxOyBpID49IDA7IGkgLT0gMSkge1xyXG4gICAgICAgICAgICBpZiAob2JqLmF0dHJpYnV0ZXNbaV0ubmFtZSAhPT0gJ3RyYW5zZm9ybScpIHtcclxuICAgICAgICAgICAgICAgIG9iai5yZW1vdmVBdHRyaWJ1dGUob2JqLmF0dHJpYnV0ZXNbaV0ubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gYWRkIGFsbCBzdGFydGluZyBhdHRyaWJ1dGVzXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkKHZhbHVlLCBrZXkpIHtcclxuICAgICAgICAgICAgaWYgKGtleSAhPT0gJ3RyYW5zZm9ybScpIHtcclxuICAgICAgICAgICAgICAgIG9iai5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMuZm9yRWFjaChhZGQpO1xyXG5cclxuXHJcbiAgICAgICAgLy8gc2V0IHN0YXJ0aW5nIHRyYW5zZm9ybVxyXG4gICAgICAgIHRoaXMuc2V0SW5pdGlhbE1hdHJpeCgpO1xyXG4gICAgfVxyXG5cclxuLypcclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tQU5JTUFUSU5HLU1FVEhPRFMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4qL1xyXG4gICAgdHJhbnNsYXRlKHgsIHkpIHtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5lID0geDtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5mID0geTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRNYXRyaXgodGhpcy5tYW5pcHVsYXRpb25NYXRyaXgpO1xyXG4gICAgfVxyXG4gICAgcm90YXRlKGFuZ2xlKSB7XHJcbiAgICAgICAgY29uc3QgcmFkaWFucyA9ICgtYW5nbGUgKiBNYXRoLlBJKSAvIDE4MDtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5zaW4ocmFkaWFucykgKiB0aGlzLnRyLnNjYWxlO1xyXG4gICAgICAgIGNvbnN0IGEgPSBNYXRoLmNvcyhyYWRpYW5zKSAqIHRoaXMudHIuc2NhbGU7XHJcblxyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmEgPSBhO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmIgPSAtYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5jID0gYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5kID0gYTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRNYXRyaXgodGhpcy5tYW5pcHVsYXRpb25NYXRyaXgpO1xyXG4gICAgfVxyXG4gICAgc2NhbGUocykge1xyXG4gICAgICAgIGNvbnN0IHJhZGlhbnMgPSAoLXRoaXMudHIucm90YXRlICogTWF0aC5QSSkgLyAxODA7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguc2luKHJhZGlhbnMpICogcztcclxuICAgICAgICBjb25zdCBhID0gTWF0aC5jb3MocmFkaWFucykgKiBzO1xyXG5cclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5hID0gYTtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5iID0gLWM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYyA9IGM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZCA9IGE7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TWF0cml4KHRoaXMubWFuaXB1bGF0aW9uTWF0cml4KTtcclxuICAgIH1cclxuICAgIHNjYWxlQW5kUm90YXRlKHMsIGFuZ2xlKSB7XHJcbiAgICAgICAgY29uc3QgcmFkaWFucyA9ICgtYW5nbGUgKiBNYXRoLlBJKSAvIDE4MDtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5zaW4ocmFkaWFucykgKiBzO1xyXG4gICAgICAgIGNvbnN0IGEgPSBNYXRoLmNvcyhyYWRpYW5zKSAqIHM7XHJcblxyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmEgPSBhO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmIgPSAtYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5jID0gYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5kID0gYTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRNYXRyaXgodGhpcy5tYW5pcHVsYXRpb25NYXRyaXgpO1xyXG4gICAgfVxyXG4gICAgc2NhbGVBbmRUcmFuc2xhdGUocywgeCwgeSkge1xyXG4gICAgICAgIGNvbnN0IHJhZGlhbnMgPSAoLXRoaXMudHIucm90YXRlICogTWF0aC5QSSkgLyAxODA7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguc2luKHJhZGlhbnMpICogcztcclxuICAgICAgICBjb25zdCBhID0gTWF0aC5jb3MocmFkaWFucykgKiBzO1xyXG5cclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5hID0gYTtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5iID0gLWM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYyA9IGM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZCA9IGE7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZSA9IHg7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZiA9IHk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TWF0cml4KHRoaXMubWFuaXB1bGF0aW9uTWF0cml4KTtcclxuICAgIH1cclxuICAgIHJvdGF0ZUFuZFRyYW5zbGF0ZShhbmdsZSwgeCwgeSkge1xyXG4gICAgICAgIGNvbnN0IHJhZGlhbnMgPSAoLWFuZ2xlICogTWF0aC5QSSkgLyAxODA7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguc2luKHJhZGlhbnMpICogdGhpcy50ci5zY2FsZTtcclxuICAgICAgICBjb25zdCBhID0gTWF0aC5jb3MocmFkaWFucykgKiB0aGlzLnRyLnNjYWxlO1xyXG5cclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5hID0gYTtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5iID0gLWM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYyA9IGM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZCA9IGE7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZSA9IHg7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZiA9IHk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TWF0cml4KHRoaXMubWFuaXB1bGF0aW9uTWF0cml4KTtcclxuICAgIH1cclxuICAgIHNjYWxlQW5kUm90YXRlQW5kVHJhbnNsYXRlKHMsIGFuZ2xlLCB4LCB5KSB7XHJcbiAgICAgICAgY29uc3QgciA9ICgtYW5nbGUgKiBNYXRoLlBJKSAvIDE4MDtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5zaW4ocikgKiBzO1xyXG4gICAgICAgIGNvbnN0IGEgPSBNYXRoLmNvcyhyKSAqIHM7XHJcblxyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmEgPSBhO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmIgPSAtYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5jID0gYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5kID0gYTtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5lID0geDtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5mID0geTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRNYXRyaXgodGhpcy5tYW5pcHVsYXRpb25NYXRyaXgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgT2JqO1xyXG4iLCJjbGFzcyBTbGlkZSB7fVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU2xpZGU7XHJcbiIsImltcG9ydCBzdGVwIGZyb20gJy4vZW5naW5lL2Rpc3BhdGNoJztcclxuaW1wb3J0IE9iaiBmcm9tICcuL2NsYXNzZXMvbWFpbic7XHJcbmltcG9ydCBTbGlkZSBmcm9tICcuL2NsYXNzZXMvc2xpZGUnO1xyXG5pbXBvcnQgeyBhZGRTbGlkZXMsIG5leHQgfSBmcm9tICcuL2NvbnRyb2wvcGxheWVyJztcclxuXHJcbi8vIHJvbGx1cCBzaGl0XHJcbigoKSA9PiBbc3RlcCwgT2JqLCBTbGlkZSwgYWRkU2xpZGVzLCBuZXh0XSkoKTtcclxuIl0sIm5hbWVzIjpbInBhdXNlVG9SZWxvYWQiLCJwbGF5VG9QYXVzZSIsInJlbG9hZFRvUGxheSIsInBhdXNlVG9QbGF5Il0sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLFFBQVEsR0FBRztJQUNiLEdBQUcsRUFBRSxRQUFRLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVDLEtBQUssRUFBRSxLQUFLO0lBQ1osTUFB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