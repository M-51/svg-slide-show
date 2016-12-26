const settings = {
    svg: document.getElementsByTagName('svg')[0],   // svg element
    speed: 0.025,                                   // base animation speed
    easing: t => t * t * (3 - (2 * t)),             // easing function
    interfaceAnimations: true,                      // turn on/off interface animations
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

    if (!settings.interfaceAnimations) {
        steps = 10;
    }

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

    if (!settings.interfaceAnimations) {
        steps = 10;
    }

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

    if (!settings.interfaceAnimations) {
        steps = 10;
        offset = 0;
    }

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

    if (!settings.interfaceAnimations) {
        steps = 10;
        offset = 16;
    }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIkY6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvc2V0dGluZ3MuanMiLCJGOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2VuZ2luZS9hbmltYXRlLmpzIiwiRjovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy9jb250cm9sL2J1dHRvbnMuanMiLCJGOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2NvbnRyb2wvcGxheWVyLmpzIiwiRjovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy91dGlscy5qcyIsIkY6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvZW5naW5lL2NhbGN1bGF0aW9ucy90cmFuc2Zvcm0uanMiLCJGOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2VuZ2luZS9jYWxjdWxhdGlvbnMvYXR0cmlidXRlLmpzIiwiRjovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy9lbmdpbmUvY2FsY3VsYXRpb25zL3JlbW92ZS5qcyIsIkY6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvZW5naW5lL2NhbGN1bGF0aW9ucy9zZXQuanMiLCJGOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2VuZ2luZS9jYWxjdWxhdGUuanMiLCJGOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2VuZ2luZS9kaXNwYXRjaC5qcyIsIkY6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvY2xhc3Nlcy9tYWluLmpzIiwiRjovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy9jbGFzc2VzL3NsaWRlLmpzIiwiRjovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBzZXR0aW5ncyA9IHtcclxuICAgIHN2ZzogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3N2ZycpWzBdLCAgIC8vIHN2ZyBlbGVtZW50XHJcbiAgICBzcGVlZDogMC4wMjUsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBiYXNlIGFuaW1hdGlvbiBzcGVlZFxyXG4gICAgZWFzaW5nOiB0ID0+IHQgKiB0ICogKDMgLSAoMiAqIHQpKSwgICAgICAgICAgICAgLy8gZWFzaW5nIGZ1bmN0aW9uXHJcbiAgICBpbnRlcmZhY2VBbmltYXRpb25zOiB0cnVlLCAgICAgICAgICAgICAgICAgICAgICAvLyB0dXJuIG9uL29mZiBpbnRlcmZhY2UgYW5pbWF0aW9uc1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgc2V0dGluZ3M7XHJcbiIsImltcG9ydCBzZXR0aW5ncyBmcm9tICcuLi9zZXR0aW5ncyc7XHJcblxyXG4vKiBBbmltYXRlIHByZWRlZmluZWQgZnVuY3Rpb25zLCB0aGVuIHVwZGF0ZSB2YXJpYWJsZXMgKi9cclxuXHJcbmZ1bmN0aW9uIGFuaW1hdGVPYmplY3QoYXJyLCBlYXNlKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGFycltpXVswXShlYXNlKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB1cGRhdGVPYmplY3QoYXJyKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGFycltpXVsxXSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBtYWluIGFuaW1hdGlvbiBmdW5jdGlvblxyXG5mdW5jdGlvbiBhbmltYXRlKHMsIGQsIGFycikge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgbGV0IHQgPSAwO1xyXG4gICAgICAgIGxldCBlYXNlO1xyXG4gICAgICAgIGNvbnN0IHNwZWVkID0gc2V0dGluZ3Muc3BlZWQgKiBzID4gMCA/IHNldHRpbmdzLnNwZWVkICogcyA6IDAuMDI1O1xyXG4gICAgICAgIGlmIChzID09PSAwKSB7IHQgPSAxOyB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0IDwgMSkge1xyXG4gICAgICAgICAgICAgICAgdCArPSBzcGVlZDtcclxuICAgICAgICAgICAgICAgIGVhc2UgPSBzZXR0aW5ncy5lYXNpbmcodCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGVPYmplY3QoYXJyW2ldLCBlYXNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9iamVjdChhcnJbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KHN0ZXAsIGQpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFuaW1hdGU7XHJcbiIsImltcG9ydCBzZXR0aW5ncyBmcm9tICcuLi9zZXR0aW5ncyc7XHJcblxyXG4vKlxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1DUkVBVEUtRUxFTUVOVFMtT0YtSU5URVJGQUNFLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiovXHJcblxyXG4vLyBkZWNsYXJlIHZhcmlhYmxlc1xyXG5cclxuY29uc3QgaWNvbnMgPSB7XHJcbiAgICBncm91cDogbnVsbCxcclxuICAgIHBvbHlnb24xOiBudWxsLFxyXG4gICAgcG9seWdvbjI6IG51bGwsXHJcbiAgICBhcmMxOiBudWxsLFxyXG4gICAgYXJjMjogbnVsbCxcclxuICAgIHJlY3Q6IG51bGwsXHJcbn07XHJcblxyXG4vLyBjcmVhdGUgaWNvbnNcclxuXHJcbmNvbnN0IHhtbG5zID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcclxuaWNvbnMuZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoeG1sbnMsICdnJyk7XHJcblxyXG5pY29ucy5hcmMxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHhtbG5zLCAncGF0aCcpO1xyXG5pY29ucy5hcmMxLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgJ00xMCwyMCBBMTAsMTAgMCAwLDEgMjAsMTAnKTtcclxuaWNvbnMuZ3JvdXAuYXBwZW5kQ2hpbGQoaWNvbnMuYXJjMSk7XHJcblxyXG5pY29ucy5hcmMyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHhtbG5zLCAncGF0aCcpO1xyXG5pY29ucy5hcmMyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgJ00zMCwyMCBBMTAsMTAgMCAwLDEgMjAsMzAnKTtcclxuaWNvbnMuZ3JvdXAuYXBwZW5kQ2hpbGQoaWNvbnMuYXJjMik7XHJcblxyXG5pY29ucy5wb2x5Z29uMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh4bWxucywgJ3BvbHlnb24nKTtcclxuaWNvbnMucG9seWdvbjEuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3BvaW50cycsICcxMCwxMCAxMCwzMCAyMCwyNSAyMCwxNScpO1xyXG5pY29ucy5ncm91cC5hcHBlbmRDaGlsZChpY29ucy5wb2x5Z29uMSk7XHJcblxyXG5pY29ucy5wb2x5Z29uMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh4bWxucywgJ3BvbHlnb24nKTtcclxuaWNvbnMucG9seWdvbjIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3BvaW50cycsICcyMCwyNSAyMCwxNSAzMCwyMCAzMCwyMCcpO1xyXG5pY29ucy5ncm91cC5hcHBlbmRDaGlsZChpY29ucy5wb2x5Z29uMik7XHJcblxyXG5pY29ucy5yZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHhtbG5zLCAncmVjdCcpO1xyXG5pY29ucy5yZWN0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgMCk7XHJcbmljb25zLnJlY3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCAwKTtcclxuaWNvbnMucmVjdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCA0MCk7XHJcbmljb25zLnJlY3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIDQwKTtcclxuaWNvbnMuZ3JvdXAuYXBwZW5kQ2hpbGQoaWNvbnMucmVjdCk7XHJcblxyXG4vLyBhZGQgc3R5bGUgdG8gaW50ZXJmYWNlXHJcblxyXG5jb25zdCBjc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N0eWxlJyk7XHJcbmNzcy50ZXh0Q29udGVudCA9ICcjY29udHJvbCA+IHJlY3Qge29wYWNpdHk6IDA7IGN1cnNvcjogcG9pbnRlcjt9ICNjb250cm9sID4gcGF0aCB7c3Ryb2tlOiMwMDA7IGZpbGw6bm9uZTsgc3Ryb2tlLXdpZHRoOiAycHg7IHN0cm9rZS1kYXNoYXJyYXk6IDE2cHg7IHN0cm9rZS1kYXNob2Zmc2V0OiAxNnB4fSc7XHJcblxyXG5cclxubGV0IGRlZnMgPSBzZXR0aW5ncy5zdmcuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RlZnMnKVswXTtcclxuLy8gY2hlY2sgaWYgZGVmcyBlbGVtZW50IGlzIGFscmVhZHkgZGVjbGFyZWQuIElmIG5vdCwgYWRkIGl0IHRvIERPTVxyXG5pZiAoIWRlZnMpIHtcclxuICAgIGRlZnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkZWZzJyk7XHJcbiAgICBzZXR0aW5ncy5zdmcuaW5zZXJ0QmVmb3JlKGRlZnMsIHNldHRpbmdzLnN2Zy5maXJzdENoaWxkKTtcclxufVxyXG5kZWZzLmFwcGVuZENoaWxkKGNzcyk7XHJcblxyXG4vLyBzZXQgaW50ZXJmYWNlIHRvIGNvcnJlY3QgcG9zaXRpb25cclxuY29uc3Qgdmlld0JveCA9IHNldHRpbmdzLnN2Zy52aWV3Qm94LmJhc2VWYWw7XHJcbmNvbnN0IG1hdHJpeCA9IHNldHRpbmdzLnN2Zy5jcmVhdGVTVkdNYXRyaXgoKTtcclxubWF0cml4LmUgPSB2aWV3Qm94LnggKyAxMDtcclxubWF0cml4LmYgPSB2aWV3Qm94LnkgKyAodmlld0JveC5oZWlnaHQgLSA1MCk7XHJcbmljb25zLmdyb3VwLmlkID0gJ2NvbnRyb2wnO1xyXG5pY29ucy5ncm91cC50cmFuc2Zvcm0uYmFzZVZhbC5pbml0aWFsaXplKHNldHRpbmdzLnN2Zy5jcmVhdGVTVkdUcmFuc2Zvcm1Gcm9tTWF0cml4KG1hdHJpeCkpO1xyXG5cclxuXHJcbi8vIGFkZCBpbnRlcmZhY2UgdG8gRE9NXHJcblxyXG5zZXR0aW5ncy5zdmcuYXBwZW5kQ2hpbGQoaWNvbnMuZ3JvdXApO1xyXG5cclxuXHJcbi8vIGFkZCBldmVudCBsaXN0ZW5lcnMgdG8gZWxlbWVudHMgb2YgaW50ZXJmYWNlLCBhbmQgc2V0IGV2ZW50IHByb3BhZ2F0aW9uXHJcblxyXG5jb25zdCBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG5ldmVudC5pbml0RXZlbnQoJ2J1dHRvbi1jbGljaycsIHRydWUsIHRydWUpO1xyXG5pY29ucy5yZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyBzZXR0aW5ncy5zdmcuZGlzcGF0Y2hFdmVudChldmVudCk7IH0pO1xyXG5cclxuXHJcbi8qXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1JTlRFUkZBQ0UtQU5JTUFUSU9OUy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuKi9cclxuXHJcbi8vIGFuaW1hdGlvbiAtIHBsYXkgLT4gcGF1c2VcclxuXHJcbmZ1bmN0aW9uIGFuaW1hdGVQbGF5VG9QYXVzZSgpIHtcclxuICAgIGxldCBzdGVwcyA9IDE7XHJcblxyXG4gICAgaWYgKCFzZXR0aW5ncy5pbnRlcmZhY2VBbmltYXRpb25zKSB7XHJcbiAgICAgICAgc3RlcHMgPSAxMDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhbmltYXRlKCkge1xyXG4gICAgICAgIGlmIChzdGVwcyA8PSAxMCkge1xyXG4gICAgICAgICAgICBpY29ucy5wb2x5Z29uMS5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsIGBcclxuICAgICAgICAgICAgMTAsMTAgXHJcbiAgICAgICAgICAgIDEwLDMwIFxyXG4gICAgICAgICAgICAkezIwIC0gKHN0ZXBzIC8gNSkgPiAxOCA/IDIwIC0gKHN0ZXBzIC8gNSkgOiAxOH0sJHsyNSArIChzdGVwcyAvIDIpIDwgMzAgPyAyNSArIChzdGVwcyAvIDIpIDogMzB9IFxyXG4gICAgICAgICAgICAkezIwIC0gKHN0ZXBzIC8gNSkgPiAxOCA/IDIwIC0gKHN0ZXBzIC8gNSkgOiAxOH0sJHsxNSAtIChzdGVwcyAvIDIpID4gMTAgPyAxNSAtIChzdGVwcyAvIDIpIDogMTB9XHJcbiAgICAgICAgICAgIGApO1xyXG4gICAgICAgICAgICBpY29ucy5wb2x5Z29uMi5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsIGBcclxuICAgICAgICAgICAgJHsyMCArIChzdGVwcyAvIDUpIDwgMjIgPyAyMCArIChzdGVwcyAvIDUpIDogMjJ9LCR7MTUgLSAoc3RlcHMgLyAyKSA+IDEwID8gMTUgLSAoc3RlcHMgLyAyKSA6IDEwfSBcclxuICAgICAgICAgICAgJHsyMCArIChzdGVwcyAvIDUpIDwgMjIgPyAyMCArIChzdGVwcyAvIDUpIDogMjJ9LCAkezI1ICsgKHN0ZXBzIC8gMikgPCAzMCA/IDI1ICsgKHN0ZXBzIC8gMikgOiAzMH0gXHJcbiAgICAgICAgICAgIDMwLCR7MjAgKyBzdGVwcyA8IDMwID8gMjAgKyBzdGVwcyA6IDMwfSBcclxuICAgICAgICAgICAgMzAsJHsyMCAtIHN0ZXBzID4gMTAgPyAyMCAtIHN0ZXBzIDogMTB9XHJcbiAgICAgICAgICAgIGApO1xyXG4gICAgICAgICAgICBzdGVwcyArPSAxO1xyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFuaW1hdGUoKTtcclxufVxyXG5cclxuLy8gYW5pbWF0aW9uIC0gcGF1c2UgLT4gcGxheVxyXG5cclxuZnVuY3Rpb24gYW5pbWF0ZVBhdXNlVG9QbGF5KCkge1xyXG4gICAgbGV0IHN0ZXBzID0gMTtcclxuXHJcbiAgICBpZiAoIXNldHRpbmdzLmludGVyZmFjZUFuaW1hdGlvbnMpIHtcclxuICAgICAgICBzdGVwcyA9IDEwO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFuaW1hdGUoKSB7XHJcbiAgICAgICAgaWYgKHN0ZXBzIDw9IDEwKSB7XHJcbiAgICAgICAgICAgIGljb25zLnBvbHlnb24xLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgYFxyXG4gICAgICAgICAgICAgICAgMTAsMTAgXHJcbiAgICAgICAgICAgICAgICAxMCwzMCBcclxuICAgICAgICAgICAgICAgICR7MTggKyAoc3RlcHMgLyA1KSA8IDIwID8gMTggKyAoc3RlcHMgLyA1KSA6IDIwfSwkezMwIC0gKHN0ZXBzIC8gMikgPiAyNSA/IDMwIC0gKHN0ZXBzIC8gMikgOiAyNX0gXHJcbiAgICAgICAgICAgICAgICAkezE4ICsgKHN0ZXBzIC8gNSkgPCAyMCA/IDE4ICsgKHN0ZXBzIC8gNSkgOiAyMH0sJHsxMCArIChzdGVwcyAvIDIpIDwgMTUgPyAxMCArIChzdGVwcyAvIDIpIDogMTV9XHJcbiAgICAgICAgICAgIGApO1xyXG4gICAgICAgICAgICBpY29ucy5wb2x5Z29uMi5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsIGBcclxuICAgICAgICAgICAgICAgICR7MjIgLSAoc3RlcHMgLyA1KSA+IDIwID8gMjIgLSAoc3RlcHMgLyA1KSA6IDIwfSwkezEwICsgKHN0ZXBzIC8gMikgPCAxNSA/IDEwICsgKHN0ZXBzIC8gMikgOiAxNX0gXHJcbiAgICAgICAgICAgICAgICAkezIyIC0gKHN0ZXBzIC8gNSkgPiAyMCA/IDIyIC0gKHN0ZXBzIC8gNSkgOiAyMH0sJHszMCAtIChzdGVwcyAvIDIpID4gMjUgPyAzMCAtIChzdGVwcyAvIDIpIDogMjV9IFxyXG4gICAgICAgICAgICAgICAgMzAsJHszMCAtIChzdGVwcyA+IDIwKSA/IDMwIC0gc3RlcHMgOiAyMH0gXHJcbiAgICAgICAgICAgICAgICAzMCwkezEwICsgKHN0ZXBzIDwgMjApID8gMTAgKyBzdGVwcyA6IDIwfVxyXG4gICAgICAgICAgICBgKTtcclxuICAgICAgICAgICAgc3RlcHMgKz0gMTtcclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhbmltYXRlKCk7XHJcbn1cclxuXHJcbi8vIGFuaW1hdGlvbiAtIHBhdXNlIC0+IHJlbG9hZFxyXG5cclxuZnVuY3Rpb24gYW5pbWF0ZVBhdXNlVG9SZWxvYWQoKSB7XHJcbiAgICBsZXQgc3RlcHMgPSAxO1xyXG4gICAgbGV0IG9mZnNldCA9IDE2O1xyXG5cclxuICAgIGlmICghc2V0dGluZ3MuaW50ZXJmYWNlQW5pbWF0aW9ucykge1xyXG4gICAgICAgIHN0ZXBzID0gMTA7XHJcbiAgICAgICAgb2Zmc2V0ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhbmltYXRlQXJjKCkge1xyXG4gICAgICAgIGlmIChvZmZzZXQgPiAwKSB7XHJcbiAgICAgICAgICAgIG9mZnNldCAtPSAxO1xyXG4gICAgICAgICAgICBpY29ucy5hcmMxLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBgc3Ryb2tlLWRhc2hvZmZzZXQ6JHtvZmZzZXR9cHhgKTtcclxuICAgICAgICAgICAgaWNvbnMuYXJjMi5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYHN0cm9rZS1kYXNob2Zmc2V0OiR7b2Zmc2V0fXB4YCk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZUFyYyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWNvbnMuYXJjMS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3N0cm9rZS1kYXNob2Zmc2V0OjAnKTtcclxuICAgICAgICAgICAgaWNvbnMuYXJjMi5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3N0cm9rZS1kYXNob2Zmc2V0OjAnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYW5pbWF0ZSgpIHtcclxuICAgICAgICBpZiAoc3RlcHMgPD0gMTApIHtcclxuICAgICAgICAgICAgaWNvbnMucG9seWdvbjEuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBgXHJcbiAgICAgICAgICAgICAgICAkezEwIC0gKHN0ZXBzICogMC40KSA+IDYgPyAxMCAtIChzdGVwcyAqIDAuNCkgOiA2fSwkezEwICsgc3RlcHMgPCAyMCA/IDEwICsgc3RlcHMgOiAyMH0gXHJcbiAgICAgICAgICAgICAgICAxMCwkezMwIC0gKHN0ZXBzICogMC40KSA+IDI2ID8gMzAgLSAoc3RlcHMgKiAwLjQpIDogMjZ9IFxyXG4gICAgICAgICAgICAgICAgJHsxOCAtIChzdGVwcyAqIDAuOCkgPiAxMCA/IDE4IC0gKHN0ZXBzICogMC44KSA6IDEwfSwkezMwIC0gKHN0ZXBzICogMC40KSA+IDI2ID8gMzAgLSAoc3RlcHMgKiAwLjQpIDogMjZ9IFxyXG4gICAgICAgICAgICAgICAgJHsxOCAtIChzdGVwcyAqIDAuNCkgPiAxNCA/IDE4IC0gKHN0ZXBzICogMC40KSA6IDE0fSwkezEwICsgc3RlcHMgPCAyMCA/IDEwICsgc3RlcHMgOiAyMH1cclxuICAgICAgICAgICAgYCk7XHJcbiAgICAgICAgICAgIGljb25zLnBvbHlnb24yLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgYFxyXG4gICAgICAgICAgICAgICAgJHsyMiArIChzdGVwcyAqIDAuOCkgPCAzMCA/IDIyICsgKHN0ZXBzICogMC44KSA6IDMwfSwkezEwICsgKHN0ZXBzICogMC40KSA8IDE0ID8gMTAgKyAoc3RlcHMgKiAwLjQpIDogMTR9IFxyXG4gICAgICAgICAgICAgICAgJHsyMiArIChzdGVwcyAqIDAuNCkgPCAyNiA/IDIyICsgKHN0ZXBzICogMC40KSA6IDI2fSwkezMwIC0gc3RlcHMgPiAyMCA/IDMwIC0gc3RlcHMgOiAyMH0gXHJcbiAgICAgICAgICAgICAgICAgJHszMCArIChzdGVwcyAqIDAuNCkgPCAzNCA/IDMwICsgKHN0ZXBzICogMC40KSA6IDM0fSwkezMwIC0gc3RlcHMgPiAyMCA/IDMwIC0gc3RlcHMgOiAyMH0gXHJcbiAgICAgICAgICAgICAgICAzMCwkezEwICsgKHN0ZXBzICogMC40KSA8IDE0ID8gMTAgKyAoc3RlcHMgKiAwLjQpIDogMTR9XHJcbiAgICAgICAgICAgIGApO1xyXG4gICAgICAgICAgICBzdGVwcyArPSAxO1xyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFuaW1hdGVBcmMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhbmltYXRlKCk7XHJcbn1cclxuXHJcbi8vIGFuaW1hdGlvbiAtIHJlbG9hZCAtPiBwbGF5XHJcblxyXG5mdW5jdGlvbiBhbmltYXRlUmVsb2FkVG9QbGF5KCkge1xyXG4gICAgbGV0IHN0ZXBzID0gMTtcclxuICAgIGxldCBvZmZzZXQgPSAwO1xyXG5cclxuICAgIGlmICghc2V0dGluZ3MuaW50ZXJmYWNlQW5pbWF0aW9ucykge1xyXG4gICAgICAgIHN0ZXBzID0gMTA7XHJcbiAgICAgICAgb2Zmc2V0ID0gMTY7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYW5pbWF0ZSgpIHtcclxuICAgICAgICBpZiAoc3RlcHMgPD0gMTApIHtcclxuICAgICAgICAgICAgaWNvbnMucG9seWdvbjEuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBgXHJcbiAgICAgICAgICAgICAgICAkezYgKyAoc3RlcHMgKiAwLjQpIDwgMTAgPyA2ICsgKHN0ZXBzICogMC40KSA6IDEwfSwkezIwIC0gc3RlcHMgPiAxMCA/IDIwIC0gc3RlcHMgOiAxMH0gXHJcbiAgICAgICAgICAgICAgICAxMCwkezI2ICsgKHN0ZXBzICogMC40KSA8IDMwID8gMjYgKyAoc3RlcHMgKiAwLjQpIDogMzB9IFxyXG4gICAgICAgICAgICAgICAgJHsxMCArIHN0ZXBzIDwgMjAgPyAxMCArIHN0ZXBzIDogMjB9LCR7MjYgLSAoc3RlcHMgKiAwLjEpID4gMjUgPyAyNiAtIChzdGVwcyAqIDAuMSkgOiAyNX0gXHJcbiAgICAgICAgICAgICAgICAkezE0ICsgKHN0ZXBzICogMC42KSA8IDIwID8gMTQgKyAoc3RlcHMgKiAwLjYpIDogMjB9LCR7MjAgLSAoc3RlcHMgKiAwLjUpID4gMTUgPyAyMCAtIChzdGVwcyAqIDAuNSkgOiAxNX1cclxuICAgICAgICAgICAgYCk7XHJcbiAgICAgICAgICAgIGljb25zLnBvbHlnb24yLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgYFxyXG4gICAgICAgICAgICAgICAgJHszMCAtIHN0ZXBzID4gMjAgPyAzMCAtIHN0ZXBzIDogMjB9LCR7MTQgKyAoc3RlcHMgKiAwLjEpIDwgMTUgPyAxNCArIChzdGVwcyAqIDAuMSkgOiAxNX0gXHJcbiAgICAgICAgICAgICAgICAkezI2IC0gKHN0ZXBzICogMC42KSA+IDIwID8gMjYgLSAoc3RlcHMgKiAwLjYpIDogMjB9LCR7MjAgKyAoc3RlcHMgKiAwLjUpIDwgMjUgPyAyMCArIChzdGVwcyAqIDAuNSkgOiAyNX0gXHJcbiAgICAgICAgICAgICAgICAkezM0IC0gKHN0ZXBzICogMC40KSA+IDMwID8gMzQgLSAoc3RlcHMgKiAwLjQpIDogMzB9LDIwIFxyXG4gICAgICAgICAgICAgICAgMzAsJHsxNCArIChzdGVwcyAqIDAuNikgPCAyMCA/IDE0ICsgKHN0ZXBzICogMC42KSA6IDIwfVxyXG4gICAgICAgICAgICBgKTtcclxuICAgICAgICAgICAgc3RlcHMgKz0gMTtcclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYW5pbWF0ZUFyYygpIHtcclxuICAgICAgICBpZiAob2Zmc2V0IDwgMTYpIHtcclxuICAgICAgICAgICAgb2Zmc2V0ICs9IDE7XHJcbiAgICAgICAgICAgIGljb25zLmFyYzEuc2V0QXR0cmlidXRlKCdzdHlsZScsIGBzdHJva2UtZGFzaG9mZnNldDoke29mZnNldH1weGApO1xyXG4gICAgICAgICAgICBpY29ucy5hcmMyLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBgc3Ryb2tlLWRhc2hvZmZzZXQ6JHtvZmZzZXR9YCk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZUFyYyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWNvbnMuYXJjMS5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XHJcbiAgICAgICAgICAgIGljb25zLmFyYzIucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xyXG4gICAgICAgICAgICBhbmltYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYW5pbWF0ZUFyYygpO1xyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgYW5pbWF0ZVBsYXlUb1BhdXNlIGFzIHBsYXlUb1BhdXNlLFxyXG4gICAgYW5pbWF0ZVBhdXNlVG9QbGF5IGFzIHBhdXNlVG9QbGF5LFxyXG4gICAgYW5pbWF0ZVBhdXNlVG9SZWxvYWQgYXMgcGF1c2VUb1JlbG9hZCxcclxuICAgIGFuaW1hdGVSZWxvYWRUb1BsYXkgYXMgcmVsb2FkVG9QbGF5LFxyXG59O1xyXG4iLCJpbXBvcnQgeyBwbGF5VG9QYXVzZSwgcGF1c2VUb1BsYXksIHBhdXNlVG9SZWxvYWQsIHJlbG9hZFRvUGxheSB9IGZyb20gJy4vYnV0dG9ucyc7XHJcblxyXG4vKiBQbGF5ZXIgc3RhcnRzLCBzdG9wcywgcmVzdW1lcyBvciByZWxvYWRzIHNsaWRlIHNob3cgKi9cclxuXHJcbi8vIGFycmF5IG9mIGFsbCBzbGlkZXNcclxuY29uc3Qgc2xpZGVzID0gW107XHJcbi8vIHNldCBvZiBhbGwgZWxlbWVudHMgdXNlZCBpbiBhbmltYXRpb25zLiBOZWVkZWQgZm9yIHJlc3RhcnRpbmcsIHNldHRpbmcgZWxlbWVudHMgdG8gc3RhcnRpbmcgcG9zaXRpb25zXHJcbmNvbnN0IG9iamVjdExpc3QgPSBuZXcgU2V0KCk7XHJcbmxldCBjdXJyZW50U2xpZGUgPSAwO1xyXG5sZXQgc3RhdHVzID0gJ25vdCBzdGFydGVkJztcclxuXHJcbmZ1bmN0aW9uIHN0YXJ0KCkge1xyXG4gICAgY3VycmVudFNsaWRlID0gMDtcclxuICAgIHNsaWRlc1tjdXJyZW50U2xpZGVdLnBsYXkoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVzZXQoKSB7XHJcbiAgICBvYmplY3RMaXN0LmZvckVhY2goKGVsKSA9PiB7IGVsLnJlc2V0KCk7IH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXN1bWUoKSB7XHJcbiAgICBpZiAoY3VycmVudFNsaWRlICsgMSA+PSBzbGlkZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgc3RhdHVzID0gJ2ZpbmlzaGVkJztcclxuICAgICAgICBwYXVzZVRvUmVsb2FkKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGN1cnJlbnRTbGlkZSArPSAxO1xyXG4gICAgICAgIHNsaWRlc1tjdXJyZW50U2xpZGVdLnBsYXkoKTtcclxuICAgICAgICBwbGF5VG9QYXVzZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjb250cm9sUGxheWVyKCkge1xyXG4gICAgaWYgKHNsaWRlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHNsaWRlcyB0byBhbmltYXRlLiBBZGQgc2xpZGVzIHVzaW5nIFwiYWRkU2xpZGVzXCIgZnVuY3Rpb24uJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN0YXR1cyA9PT0gJ2ZpbmlzaGVkJykge1xyXG4gICAgICAgIHN0YXR1cyA9ICdub3Qgc3RhcnRlZCc7XHJcbiAgICAgICAgcmVzZXQoKTtcclxuICAgICAgICByZWxvYWRUb1BsYXkoKTtcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSAncGxheWluZycpIHtcclxuICAgICAgICBzdGF0dXMgPSAncGF1c2VkJztcclxuICAgICAgICBwYXVzZVRvUGxheSgpO1xyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09ICdwYXVzZWQnKSB7XHJcbiAgICAgICAgc3RhdHVzID0gJ3BsYXlpbmcnO1xyXG4gICAgICAgIHJlc3VtZSgpO1xyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09ICdub3Qgc3RhcnRlZCcpIHtcclxuICAgICAgICBzdGF0dXMgPSAncGxheWluZyc7XHJcbiAgICAgICAgc3RhcnQoKTtcclxuICAgICAgICBwbGF5VG9QYXVzZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBuZXh0KGRlbGF5KSB7XHJcbiAgICBpZiAoY3VycmVudFNsaWRlICsgMSA+PSBzbGlkZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgc3RhdHVzID0gJ2ZpbmlzaGVkJztcclxuICAgICAgICBwYXVzZVRvUmVsb2FkKCk7XHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gJ3BhdXNlZCcpIHtcclxuICAgICAgICBjdXJyZW50U2xpZGUgKz0gMTtcclxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IHNsaWRlc1tjdXJyZW50U2xpZGVdLnBsYXkoKTsgfSwgZGVsYXkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRTbGlkZXMoLi4uc2xpZGUpIHtcclxuICAgIHNsaWRlcy5wdXNoKC4uLnNsaWRlKTtcclxufVxyXG5mdW5jdGlvbiBhZGRPYmplY3RzKG9iamVjdCkge1xyXG4gICAgb2JqZWN0TGlzdC5hZGQob2JqZWN0KTtcclxufVxyXG5cclxuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2J1dHRvbi1jbGljaycsIGNvbnRyb2xQbGF5ZXIsIGZhbHNlKTtcclxuXHJcbmV4cG9ydCB7IGFkZFNsaWRlcywgYWRkT2JqZWN0cywgbmV4dCB9O1xyXG5cclxuIiwiY29uc3QgdXRpbHMgPSB7XHJcbiAgICB1bmRlZjogaXRlbSA9PiAodHlwZW9mIGl0ZW0gPT09ICd1bmRlZmluZWQnKSwgICAvLyBjaGVjayBpZiBhcmd1bWVudCBpcyB1bmRlZmluZWRcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHV0aWxzO1xyXG4iLCJpbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi8uLi91dGlscyc7XHJcblxyXG4vKiBEZWZpbmUgbW9zdCBlZmZpY2llbnQgZnVuY3Rpb24gdXNlZCB0byBhbmltYXRlIHRyYW5zZm9ybSBwcm9wZXJ0eSwgdGhlbiBhZGQgaXQgdG8gYXJyYXkgb2YgZnVuY3Rpb25zIGZvciBhbmltYXRpb24gKi9cclxuXHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZVRyYW5zZm9ybShlbCkge1xyXG4gICAgY29uc3QgdGFyZ2V0VHJhbnNmb3JtID0gZWwudHJhbnNmb3JtO1xyXG5cclxuICAgIC8vIGNoZWNrIGlmIHRyYW5zZm9ybSBhbmltYXRpb24gaXMgcmVxdWVzdGVkXHJcbiAgICBpZiAoIXV0aWxzLnVuZGVmKHRhcmdldFRyYW5zZm9ybSkpIHtcclxuICAgICAgICBsZXQgYW5pbWF0ZUZ1bmM7XHJcbiAgICAgICAgbGV0IHVwZGF0ZUZ1bmM7XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0ID0gZWwub2JqZWN0O1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0aW5nVHJhbnNmb3JtID0gZWwub2JqZWN0LnRyO1xyXG5cclxuICAgICAgICBjb25zdCBkZWx0YVNjYWxlID0gdGFyZ2V0VHJhbnNmb3JtLnNjYWxlIC0gc3RhcnRpbmdUcmFuc2Zvcm0uc2NhbGU7XHJcbiAgICAgICAgY29uc3QgZGVsdGFSb3RhdGUgPSB0YXJnZXRUcmFuc2Zvcm0ucm90YXRlIC0gc3RhcnRpbmdUcmFuc2Zvcm0ucm90YXRlO1xyXG4gICAgICAgIGxldCBkZWx0YTA7XHJcbiAgICAgICAgbGV0IGRlbHRhMTtcclxuICAgICAgICBpZiAoIXV0aWxzLnVuZGVmKHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGUpKSB7XHJcbiAgICAgICAgICAgIGRlbHRhMCA9ICh0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlWzBdKSAtIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZVswXTtcclxuICAgICAgICAgICAgZGVsdGExID0gKHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGVbMV0pIC0gc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlWzFdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogLS0tLS0tLS0gdHJhbnNmb3JtcyB3aXRob3V0IHRyYW5zbGF0aW9uIC0tLS0tLS0tICovXHJcbiAgICAgICAgaWYgKHV0aWxzLnVuZGVmKHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGUpKSB7XHJcbiAgICAgICAgICAgIGlmICh1dGlscy51bmRlZih0YXJnZXRUcmFuc2Zvcm0ucm90YXRlKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gb25seSBzY2FsaW5nXHJcbiAgICAgICAgICAgICAgICBhbmltYXRlRnVuYyA9ICh0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnNjYWxlKHN0YXJ0aW5nVHJhbnNmb3JtLnNjYWxlICsgKGRlbHRhU2NhbGUgKiB0KSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlRnVuYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3Quc2NhbGUodGFyZ2V0VHJhbnNmb3JtLnNjYWxlKTtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5zY2FsZSA9IHRhcmdldFRyYW5zZm9ybS5zY2FsZTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodXRpbHMudW5kZWYodGFyZ2V0VHJhbnNmb3JtLnNjYWxlKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gb25seSByb3RhdGlvblxyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZUZ1bmMgPSAodCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5yb3RhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnJvdGF0ZSArIChkZWx0YVJvdGF0ZSAqIHQpKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVGdW5jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5yb3RhdGUodGFyZ2V0VHJhbnNmb3JtLnJvdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0ucm90YXRlID0gdGFyZ2V0VHJhbnNmb3JtLnJvdGF0ZTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBzY2FsaW5nIGFuZCByb3RhdGluZ1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZUZ1bmMgPSAodCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5zY2FsZUFuZFJvdGF0ZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0uc2NhbGUgKyAoZGVsdGFTY2FsZSAqIHQpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5yb3RhdGUgKyAoZGVsdGFSb3RhdGUgKiB0KSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlRnVuYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3Quc2NhbGVBbmRSb3RhdGUodGFyZ2V0VHJhbnNmb3JtLnNjYWxlLCB0YXJnZXRUcmFuc2Zvcm0ucm90YXRlKTtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5zY2FsZSA9IHRhcmdldFRyYW5zZm9ybS5zY2FsZTtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5yb3RhdGUgPSB0YXJnZXRUcmFuc2Zvcm0ucm90YXRlO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIC8qIC0tLS0tLS0tIHRyYW5zZm9ybXMgd2l0aCB0cmFuc2xhdGlvbiAtLS0tLS0tLSAqL1xyXG4gICAgICAgIH0gZWxzZSBpZiAodXRpbHMudW5kZWYodGFyZ2V0VHJhbnNmb3JtLnNjYWxlKSAmJiB1dGlscy51bmRlZih0YXJnZXRUcmFuc2Zvcm0ucm90YXRlKSkge1xyXG4gICAgICAgICAgICAvLyBvbmx5IHRyYW5zbGF0aW9uXHJcbiAgICAgICAgICAgIGFuaW1hdGVGdW5jID0gKHQpID0+IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdC50cmFuc2xhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlWzBdICsgKGRlbHRhMCAqIHQpLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZVsxXSArIChkZWx0YTEgKiB0KSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHVwZGF0ZUZ1bmMgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3QudHJhbnNsYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGVbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVsxXSk7XHJcbiAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGUgPSB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSBpZiAodXRpbHMudW5kZWYodGFyZ2V0VHJhbnNmb3JtLnJvdGF0ZSkpIHtcclxuICAgICAgICAgICAgLy8gc2NhbGUgYW5kIHRyYW5zbGF0aW9uXHJcbiAgICAgICAgICAgIGFuaW1hdGVGdW5jID0gKHQpID0+IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdC5zY2FsZUFuZFRyYW5zbGF0ZShcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5zY2FsZSArIChkZWx0YVNjYWxlICogdCksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlWzBdICsgKGRlbHRhMCAqIHQpLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZVsxXSArIChkZWx0YTEgKiB0KSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHVwZGF0ZUZ1bmMgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3Quc2NhbGVBbmRUcmFuc2xhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnNjYWxlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGVbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVsxXSk7XHJcbiAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5zY2FsZSA9IHRhcmdldFRyYW5zZm9ybS5zY2FsZTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZSA9IHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0VHJhbnNmb3JtLnNjYWxlID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAvLyByb3RhdGlvbiBhbmQgdHJhbnNsYXRpb25cclxuICAgICAgICAgICAgYW5pbWF0ZUZ1bmMgPSAodCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LnJvdGF0ZUFuZFRyYW5zbGF0ZShcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5yb3RhdGUgKyAoZGVsdGFSb3RhdGUgKiB0KSxcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGVbMF0gKyAoZGVsdGEwICogdCksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlWzFdICsgKGRlbHRhMSAqIHQpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdXBkYXRlRnVuYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdC5yb3RhdGVBbmRUcmFuc2xhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnJvdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGVbMV0pO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0ucm90YXRlID0gdGFyZ2V0VHJhbnNmb3JtLnJvdGF0ZTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZSA9IHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gc2NhbGUsIHJvdGF0aW9uIGFuZCB0cmFuc2xhdGlvblxyXG4gICAgICAgICAgICBhbmltYXRlRnVuYyA9ICh0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3Quc2NhbGVBbmRSb3RhdGVBbmRUcmFuc2xhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0uc2NhbGUgKyAoZGVsdGFTY2FsZSAqIHQpLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnJvdGF0ZSArIChkZWx0YVJvdGF0ZSAqIHQpLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZVswXSArIChkZWx0YTAgKiB0KSxcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGVbMV0gKyAoZGVsdGExICogdCkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB1cGRhdGVGdW5jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LnNjYWxlQW5kUm90YXRlQW5kVHJhbnNsYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRyYW5zZm9ybS5zY2FsZSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0ucm90YXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGVbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVsxXSk7XHJcbiAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5zY2FsZSA9IHRhcmdldFRyYW5zZm9ybS5zY2FsZTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnJvdGF0ZSA9IHRhcmdldFRyYW5zZm9ybS5yb3RhdGU7XHJcbiAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGUgPSB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFthbmltYXRlRnVuYywgdXBkYXRlRnVuY107XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNhbGN1bGF0ZVRyYW5zZm9ybTtcclxuIiwiaW1wb3J0IHV0aWxzIGZyb20gJy4vLi4vLi4vdXRpbHMnO1xyXG5cclxuLyogRGVmaW5lIGZ1bmN0aW9uIHVzZWQgdG8gYW5pbWF0ZSBhdHRyaWJ1dGVzLCB0aGVuIGFkZCBpdCB0byBhcnJheSBvZiBmdW5jdGlvbnMgZm9yIGFuaW1hdGlvbiAqL1xyXG5cclxuZnVuY3Rpb24gY2FsY3VsYXRlQXR0cmlidXRlcyhlbCkge1xyXG4gICAgY29uc3QgdGFibGUgPSBbXTtcclxuXHJcbiAgICBmdW5jdGlvbiBhbmltYXRlRnVuYyh0KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWJsZS5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBlbC5vYmplY3Qub2JqLnNldEF0dHJpYnV0ZSh0YWJsZVtpXVswXSwgdGFibGVbaV1bMV0gKyAoKHRhYmxlW2ldWzJdIC0gdGFibGVbaV1bMV0pICogdCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVGdW5jKCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFibGUubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgZWwub2JqZWN0Lm9iai5zZXRBdHRyaWJ1dGUodGFibGVbaV1bMF0sIHRhYmxlW2ldWzJdKTtcclxuICAgICAgICAgICAgZWwub2JqZWN0LnZhcmlhYmxlcy5zZXQodGFibGVbaV1bMF0sIHRhYmxlW2ldWzJdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBjaGVjayBpZiBhdHRyaWJ1dGVzIGFuaW1hdGlvbiBpcyByZXF1ZXN0ZWRcclxuICAgIGlmICghdXRpbHMudW5kZWYoZWwuYXR0cmlidXRlcykgJiYgZWwuYXR0cmlidXRlcy5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBjb25zdCBhdHRyaWJ1dGVzID0gQXJyYXkuaXNBcnJheShlbC5hdHRyaWJ1dGVzKSA/IGVsLmF0dHJpYnV0ZXMgOiBbZWwuYXR0cmlidXRlc107XHJcbiAgICAgICAgLy8gZm9yIGV2ZXJ5IGF0dHJpYnV0ZVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAvLyBwcm9wZXJ0eSBuYW1lXHJcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBhdHRyaWJ1dGVzW2ldLm5hbWU7XHJcblxyXG4gICAgICAgICAgICAvLyBzdGFydGluZyB2YWx1ZVxyXG4gICAgICAgICAgICBjb25zdCBmcm9tID0gdXRpbHMudW5kZWYoYXR0cmlidXRlc1tpXS5mcm9tKSA/IGVsLm9iamVjdC52YXJpYWJsZXMuZ2V0KG5hbWUpIDogYXR0cmlidXRlc1tpXS5mcm9tO1xyXG5cclxuICAgICAgICAgICAgLy8gdGhyb3cgZXJyb3IgaWYgc3RhcnRpbmcgdmFsdWUgaXMgbm90IGRlZmluZWQuIE5laXRoZXIgaW4gcmVxdWVzdCBub3IgaW4gRE9NIGVsZW1lbnRcclxuICAgICAgICAgICAgaWYgKHV0aWxzLnVuZGVmKGZyb20pKSB7IHRocm93IG5ldyBFcnJvcihgTm8gXCJmcm9tXCIgdmFsdWUsIGZvciAke25hbWV9YCk7IH1cclxuXHJcbiAgICAgICAgICAgIC8vIHRhcmdldCB2YWx1ZVxyXG4gICAgICAgICAgICBjb25zdCB0byA9IGF0dHJpYnV0ZXNbaV0udG87XHJcblxyXG4gICAgICAgICAgICB0YWJsZS5wdXNoKFtuYW1lLCBmcm9tLCB0b10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW2FuaW1hdGVGdW5jLCB1cGRhdGVGdW5jXTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2FsY3VsYXRlQXR0cmlidXRlcztcclxuIiwiaW1wb3J0IHV0aWxzIGZyb20gJy4vLi4vLi4vdXRpbHMnO1xyXG5cclxuLyogZnVuY3Rpb24gdGhhdCByZW1vdmVzIGF0dHJpYnV0ZXMgKi9cclxuXHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZVJlbW92ZShlbCkge1xyXG4gICAgY29uc3QgcmVtb3ZlID0gZWwucmVtb3ZlO1xyXG4gICAgbGV0IHJlbW92ZUZ1bmM7XHJcbiAgICBsZXQgdXBkYXRlRnVuYztcclxuXHJcbiAgICAvLyBjaGVjayBpZiB0aGVyZSBhcmUgYXR0cmlidXRlcyB0byByZW1vdmVcclxuICAgIGlmICghdXRpbHMudW5kZWYocmVtb3ZlKSkge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gW107IC8vIGFycmF5IG9mIGF0dHJpYnV0ZXMgcmVtb3ZlZCBhdCBzdGFydFxyXG4gICAgICAgIGNvbnN0IGVuZCA9IFtdOyAvLyBhcnJheSBvZiBhdHRyaWJ1dGVzIHJlbW92ZWQgYXQgZW5kXHJcbiAgICAgICAgY29uc3QgaXRlbXMgPSBBcnJheS5pc0FycmF5KHJlbW92ZSkgPyByZW1vdmUgOiBbcmVtb3ZlXTtcclxuXHJcbiAgICAgICAgLy8gYWRkIGF0dHJpYnV0ZXMgdG8gc3RhcnQvZW5kIGFycmF5XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBpZiAoaXRlbXNbaV0ud2hlbiA9PT0gJ2VuZCcpIHtcclxuICAgICAgICAgICAgICAgIGVuZC5wdXNoKGl0ZW1zW2ldKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0LnB1c2goaXRlbXNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHJlbW92ZSBhdHRyaWJ1dGVzIGF0IHN0YXJ0XHJcbiAgICAgICAgaWYgKHN0YXJ0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXJ0Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICBlbC5vYmplY3Qub2JqLnJlbW92ZUF0dHJpYnV0ZShzdGFydFtpXS5uYW1lKTtcclxuICAgICAgICAgICAgICAgIGVsLm9iamVjdC52YXJpYWJsZXMuZGVsZXRlKHN0YXJ0W2ldLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGRlZmluZSBhbmQgcmV0dXJuIGZ1bmN0aW9uIHRvIHJlbW92ZSBhdHRyaWJ1dGVzIGF0IHRoZSBlbmRcclxuICAgICAgICBpZiAoZW5kLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZW1vdmVGdW5jID0gKCkgPT4gZmFsc2U7XHJcbiAgICAgICAgICAgIHVwZGF0ZUZ1bmMgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVuZC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsLm9iamVjdC5vYmoucmVtb3ZlQXR0cmlidXRlKGVuZFtpXS5uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBlbC5vYmplY3QudmFyaWFibGVzLmRlbGV0ZShlbmRbaV0ubmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBbcmVtb3ZlRnVuYywgdXBkYXRlRnVuY107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjYWxjdWxhdGVSZW1vdmU7XHJcbiIsImltcG9ydCB1dGlscyBmcm9tICcuLy4uLy4uL3V0aWxzJztcclxuXHJcbi8qIGZ1bmN0aW9uIHRoYXQgc2V0cyBhdHRyaWJ1dGVzICovXHJcblxyXG5mdW5jdGlvbiBjYWxjdWxhdGVTZXQoZWwpIHtcclxuICAgIGNvbnN0IHNldCA9IGVsLnNldDtcclxuICAgIGxldCBzZXRGdW5jO1xyXG4gICAgbGV0IHVwZGF0ZUZ1bmM7XHJcblxyXG4gICAgLy8gY2hlY2sgaWYgdGhlcmUgYXJlIGF0dHJpYnV0ZXMgdG8gc2V0XHJcbiAgICBpZiAoIXV0aWxzLnVuZGVmKHNldCkpIHtcclxuICAgICAgICBjb25zdCBzdGFydCA9IFtdOyAvLyBhcnJheSBvZiBhdHRyaWJ1dGVzIHNldCBhdCBzdGFydFxyXG4gICAgICAgIGNvbnN0IGVuZCA9IFtdOyAvLyBhcnJheSBvZiBhdHRyaWJ1dGVzIHNldCBhdCBlbmRcclxuICAgICAgICBjb25zdCBpdGVtcyA9IEFycmF5LmlzQXJyYXkoc2V0KSA/IHNldCA6IFtzZXRdO1xyXG5cclxuICAgICAgICAvLyBhZGQgYXR0cmlidXRlcyB0byBzdGFydC9lbmQgYXJyYXlcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtc1tpXS53aGVuID09PSAnZW5kJykge1xyXG4gICAgICAgICAgICAgICAgZW5kLnB1c2goaXRlbXNbaV0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc3RhcnQucHVzaChpdGVtc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc2V0IGF0dHJpYnV0ZXMgYXQgc3RhcnRcclxuICAgICAgICBpZiAoc3RhcnQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhcnQubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgICAgIGVsLm9iamVjdC5vYmouc2V0QXR0cmlidXRlKHN0YXJ0W2ldLm5hbWUsIHN0YXJ0W2ldLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGVsLm9iamVjdC52YXJpYWJsZXMuc2V0KHN0YXJ0W2ldLm5hbWUsIHN0YXJ0W2ldLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBkZWZpbmUgYW5kIHJldHVybiBmdW5jdGlvbiB0byBzZXQgYXR0cmlidXRlcyBhdCB0aGUgZW5kXHJcbiAgICAgICAgaWYgKGVuZC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgc2V0RnVuYyA9ICgpID0+IGZhbHNlO1xyXG4gICAgICAgICAgICB1cGRhdGVGdW5jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbmQubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbC5vYmplY3Qub2JqLnNldEF0dHJpYnV0ZShlbmRbaV0ubmFtZSwgZW5kW2ldLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBlbC5vYmplY3QudmFyaWFibGVzLnNldChlbmRbaV0ubmFtZSwgZW5kW2ldLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIFtzZXRGdW5jLCB1cGRhdGVGdW5jXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNhbGN1bGF0ZVNldDtcclxuIiwiaW1wb3J0IGFuaW1hdGUgZnJvbSAnLi9hbmltYXRlJztcclxuaW1wb3J0IHsgYWRkT2JqZWN0cyB9IGZyb20gJy4uL2NvbnRyb2wvcGxheWVyJztcclxuaW1wb3J0IGNhbGN1bGF0ZVRyYW5zZm9ybSBmcm9tICcuL2NhbGN1bGF0aW9ucy90cmFuc2Zvcm0nO1xyXG5pbXBvcnQgY2FsY3VsYXRlQXR0cmlidXRlcyBmcm9tICcuL2NhbGN1bGF0aW9ucy9hdHRyaWJ1dGUnO1xyXG5pbXBvcnQgY2FsY3VsYXRlUmVtb3ZlIGZyb20gJy4vY2FsY3VsYXRpb25zL3JlbW92ZSc7XHJcbmltcG9ydCBjYWxjdWxhdGVTZXQgZnJvbSAnLi9jYWxjdWxhdGlvbnMvc2V0JztcclxuaW1wb3J0IHV0aWxzIGZyb20gJy4uL3V0aWxzJztcclxuXHJcbi8qIFNwZWNpZnkgZnVuY3Rpb25zIHVzZWQgdG8gYW5pbWF0aW9ucywgYW5kIHNlbmQgdGhlbSB0byBhbmltYXRlIGZ1bmN0aW9uICovXHJcblxyXG5mdW5jdGlvbiBjYWxjdWxhdGUoZWwpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgIC8vIGRlY2xhcmUgYXJyYXkgb2YgYW5pbWF0aW9uIGZ1bmN0aW9uc1xyXG4gICAgICAgIGNvbnN0IGFyciA9IFtdO1xyXG4gICAgICAgIGNvbnN0IG9iamVjdHMgPSBBcnJheS5pc0FycmF5KGVsLm9iamVjdHMpID8gZWwub2JqZWN0cyA6IFtlbC5vYmplY3RzXTtcclxuICAgICAgICAvLyBTZXQgZnVuY3Rpb24gZm9yIGV2ZXJ5IG9iamVjdFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb2JqZWN0cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0T2JqZWN0ID0gb2JqZWN0c1tpXTtcclxuXHJcbiAgICAgICAgICAgIC8vIGRlZmluZSB0cmFuc2Zvcm0gYW5pbWF0aW9uIGZ1bmN0aW9uLCBpZiB0cmFuc2Zvcm0gYW5pbWF0aW9uIGlzIHJlcXVlc3RlZFxyXG4gICAgICAgICAgICBjb25zdCBjYWxjdWxhdGVkVHJhbnNmb3JtID0gY2FsY3VsYXRlVHJhbnNmb3JtKHJlcXVlc3RPYmplY3QpO1xyXG4gICAgICAgICAgICBpZiAoY2FsY3VsYXRlZFRyYW5zZm9ybSkgeyBhcnIucHVzaChbY2FsY3VsYXRlZFRyYW5zZm9ybV0pOyB9XHJcblxyXG4gICAgICAgICAgICAvLyBkZWZpbmUgYXR0cmlidXRlIGFuaW1hdGlvbiBmdW5jdGlvbiwgaWYgYXR0cmlidXRlIGFuaW1hdGlvbiBpcyByZXF1ZXN0ZWRcclxuICAgICAgICAgICAgY29uc3QgY2FsY3VsYXRlZEF0dHJpYnV0ZXMgPSBjYWxjdWxhdGVBdHRyaWJ1dGVzKHJlcXVlc3RPYmplY3QpO1xyXG4gICAgICAgICAgICBpZiAoY2FsY3VsYXRlZEF0dHJpYnV0ZXMpIHsgYXJyLnB1c2goW2NhbGN1bGF0ZWRBdHRyaWJ1dGVzXSk7IH1cclxuXHJcbiAgICAgICAgICAgIC8vIGRlZmluZSByZW1vdmUgYXR0cmlidXRlIGZ1bmN0aW9uLCBpZiBhdHRyaWJ1dGVzIG5lZWRzIHRvIGJlIHJlbW92ZWRcclxuICAgICAgICAgICAgY29uc3QgY2FsY3VsYXRlZFJlbW92ZSA9IGNhbGN1bGF0ZVJlbW92ZShyZXF1ZXN0T2JqZWN0KTtcclxuICAgICAgICAgICAgaWYgKGNhbGN1bGF0ZWRSZW1vdmUpIHsgYXJyLnB1c2goW2NhbGN1bGF0ZWRSZW1vdmVdKTsgfVxyXG5cclxuICAgICAgICAgICAgLy8gZGVmaW5lIHNldCBhdHRyaWJ1dGUgZnVuY3Rpb24sIGlmIGF0dHJpYnV0ZXMgbmVlZHMgdG8gYmUgc2V0XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGN1bGF0ZWRTZXQgPSBjYWxjdWxhdGVTZXQocmVxdWVzdE9iamVjdCk7XHJcbiAgICAgICAgICAgIGlmIChjYWxjdWxhdGVkU2V0KSB7IGFyci5wdXNoKFtjYWxjdWxhdGVkU2V0XSk7IH1cclxuXHJcbiAgICAgICAgICAgIC8vIGFkZCBvYmplY3RzIHRvIG9iamVjdHMgc2V0IGluIHBsYXllci5qcy4gTmVlZGVkIGZvciByZXNldGluZ1xyXG4gICAgICAgICAgICBhZGRPYmplY3RzKG9iamVjdHNbaV0ub2JqZWN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc2VuZCBhcnJheSBvZiBmdW5jdGlvbnMgdG8gYW5pbWF0ZSBmdW5jdGlvblxyXG4gICAgICAgIGFuaW1hdGUoXHJcbiAgICAgICAgICAgIHV0aWxzLnVuZGVmKGVsLnNwZWVkKSA/IDEgOiBlbC5zcGVlZCxcclxuICAgICAgICAgICAgZWwuZGVsYXkgfHwgMCxcclxuICAgICAgICAgICAgYXJyKVxyXG4gICAgICAgIC50aGVuKCgpID0+IHsgcmVzb2x2ZSgpOyB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjYWxjdWxhdGU7XHJcbiIsImltcG9ydCBjYWxjdWxhdGUgZnJvbSAnLi9jYWxjdWxhdGUnO1xyXG5cclxuLyogU3BsaXQgcmVxdWVzdCB0byB0aHJlYWRzLCBhbmQgZGlzcGF0Y2ggdG8gXCJjYWxjdWxhdGVcIiBmdW5jdGlvbiAqL1xyXG5cclxuZnVuY3Rpb24gZGlzcGF0Y2goLi4udGhyZWFkcykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBpZiAodGhyZWFkcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgLy8gdGhyb3cgZXJyb3IsIGlmIHJlcXVlc3QgaXMgZW1wdHlcclxuICAgICAgICAgICAgcmVqZWN0KEVycm9yKCdBZGQgb2JqZWN0cyB0byBcInN0ZXBcIiBmdW5jdGlvbicpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBhcnIgPSBbXTtcclxuICAgICAgICAgICAgLy8gc2VuZCBhbGwgdGhyZWFkcyB0byBjYWxjdWxhdGlvblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRocmVhZHMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgICAgIGFyci5wdXNoKGNhbGN1bGF0ZSh0aHJlYWRzW2ldKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gYWZ0ZXIgYW5pbWF0aW9uIGNvbXBsZXRlZCwgcmVzb2x2ZSBwcm9taXNlIHRvIGxhdW5jaCBuZXh0IHNlcXVlbmNlXHJcbiAgICAgICAgICAgIFByb21pc2UuYWxsKGFycikudGhlbigoKSA9PiB7IHJlc29sdmUoKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8vIHJlbmFtZSBlbGVtZW50IGZvciBlYXNpZXIgYWNjZXNzXHJcbmNvbnN0IHN0ZXAgPSBkaXNwYXRjaDtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHN0ZXA7XHJcbiIsImltcG9ydCBzZXR0aW5ncyBmcm9tICcuLi9zZXR0aW5ncyc7IC8vIGltcG9ydCBzZXR0aW5ncyBmb3IgZ2V0dGluZyBhY2Nlc3MgdG8gU1ZHIGVsZW1lbnRcclxuaW1wb3J0IHV0aWxzIGZyb20gJy4uL3V0aWxzJzsgLy8gaW1wb3J0IHV0aWxzIGZvciB1dGlscy51bmRlZlxyXG5cclxuY2xhc3MgT2JqIHtcclxuLypcclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1DT05TVFJVQ1RPUi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4qL1xyXG4gICAgY29uc3RydWN0b3Iob2JqLCB0cmFuc2Zvcm0gPSB7IHRyYW5zbGF0ZTogWzAsIDBdLCByb3RhdGU6IDAsIHNjYWxlOiAxIH0pIHtcclxuICAgICAgICAvLyBhY2Nlc3MgdG8gRE9NIG9iamVjdFxyXG4gICAgICAgIHRoaXMub2JqID0gb2JqO1xyXG4gICAgICAgIC8vIGNyZWF0ZSB6ZXJvIG1hdHJpeFxyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4ID0gc2V0dGluZ3Muc3ZnLmNyZWF0ZVNWR01hdHJpeCgpO1xyXG4gICAgICAgIC8vIHNldCBzdGFydGluZyB2YXJpYWJsZXMsIGFuZCBkZWNsYXJlIHRoaXMuc3RhcnRpbmdWYXJpYWJsZXMgYW5kIHRoaXMudmFyaWFibGVzXHJcbiAgICAgICAgdGhpcy5zZXRTdGFydGluZ1ZhcmlhYmxlcyh0cmFuc2Zvcm0pO1xyXG4gICAgICAgIC8vIHNldCBpbml0aWFsIG1hdHJpeFxyXG4gICAgICAgIHRoaXMuc2V0SW5pdGlhbE1hdHJpeCgpO1xyXG5cclxuICAgICAgICAvKiAtLS0tLS0tLSBzaG9ydGN1dHMgLS0tLS0tLS0gKi9cclxuXHJcbiAgICAgICAgLy8gdG8gbWF0cml4IGludGVyZmFjZSAtPiB0aGlzLlNWR1RyYW5zZm9ybVxyXG5cclxuICAgICAgICAvLyB0byBjdXJyZW50IHRyYW5zZm9ybVxyXG4gICAgICAgIHRoaXMudHIgPSB0aGlzLnZhcmlhYmxlcy5nZXQoJ3RyYW5zZm9ybScpO1xyXG4gICAgfVxyXG5cclxuLypcclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUlOSVRJQUxJWklORyBNRVRIT0RTLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4qL1xyXG5cclxuXHJcbiAgICBzZXRTdGFydGluZ1ZhcmlhYmxlcyh0cmFuc2Zvcm0pIHtcclxuICAgICAgICBjb25zdCBtYXAgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9iai5hdHRyaWJ1dGVzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9iai5hdHRyaWJ1dGVzW2ldLnNwZWNpZmllZCAmJiB0aGlzLm9iai5hdHRyaWJ1dGVzW2ldLm5hbWUgIT09ICd0cmFuc2Zvcm0nKSB7XHJcbiAgICAgICAgICAgICAgICBtYXAuc2V0KHRoaXMub2JqLmF0dHJpYnV0ZXNbaV0ubmFtZSwgcGFyc2VGbG9hdCh0aGlzLm9iai5hdHRyaWJ1dGVzW2ldLnZhbHVlKSB8fCB0aGlzLm9iai5hdHRyaWJ1dGVzW2ldLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0YXJ0aW5nVmFyaWFibGVzID0gbmV3IE1hcChtYXApO1xyXG4gICAgICAgIHRoaXMudmFyaWFibGVzID0gbmV3IE1hcChtYXApO1xyXG5cclxuICAgICAgICAvLyByZWZlcmVuY2Ugc2hpdFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIFt0aGlzLnN0YXJ0aW5nVmFyaWFibGVzLCB0aGlzLnZhcmlhYmxlc11baV0uc2V0KCd0cmFuc2Zvcm0nLCB7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGU6IHV0aWxzLnVuZGVmKHRyYW5zZm9ybS50cmFuc2xhdGUpID8gWzAsIDBdIDogdHJhbnNmb3JtLnRyYW5zbGF0ZSxcclxuICAgICAgICAgICAgICAgIHNjYWxlOiB1dGlscy51bmRlZih0cmFuc2Zvcm0uc2NhbGUpID8gMSA6IHRyYW5zZm9ybS5zY2FsZSxcclxuICAgICAgICAgICAgICAgIHJvdGF0ZTogdXRpbHMudW5kZWYodHJhbnNmb3JtLnJvdGF0ZSkgPyAwIDogdHJhbnNmb3JtLnJvdGF0ZSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldEluaXRpYWxNYXRyaXgoKSB7XHJcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gdGhpcy52YXJpYWJsZXMuZ2V0KCd0cmFuc2Zvcm0nKTtcclxuICAgICAgICB0aGlzLm9iai50cmFuc2Zvcm0uYmFzZVZhbC5pbml0aWFsaXplKHNldHRpbmdzLnN2Zy5jcmVhdGVTVkdUcmFuc2Zvcm1Gcm9tTWF0cml4KHRoaXMubWFuaXB1bGF0aW9uTWF0cml4KSk7XHJcbiAgICAgICAgdGhpcy5TVkdUcmFuc2Zvcm0gPSB0aGlzLm9iai50cmFuc2Zvcm0uYmFzZVZhbC5nZXRJdGVtKDApO1xyXG4gICAgICAgIHRoaXMuc2NhbGVBbmRSb3RhdGVBbmRUcmFuc2xhdGUodHJhbnNmb3JtLnNjYWxlLCB0cmFuc2Zvcm0ucm90YXRlLCB0cmFuc2Zvcm0udHJhbnNsYXRlWzBdLCB0cmFuc2Zvcm0udHJhbnNsYXRlWzFdKTtcclxuICAgIH1cclxuXHJcbi8qXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1PVEhFUi1NRVRIT0RTLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuKi9cclxuXHJcbiAgICBzZXRNYXRyaXgobWF0cml4KSB7IHRoaXMuU1ZHVHJhbnNmb3JtLnNldE1hdHJpeChtYXRyaXgpOyB9XHJcblxyXG4gICAgcmVzZXQoKSB7XHJcbiAgICAgICAgLy8gcmVzZXQgdmFyaWFibGVzXHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMgPSBuZXcgTWFwKHRoaXMuc3RhcnRpbmdWYXJpYWJsZXMpO1xyXG4gICAgICAgIC8vIHJlZmVyZW5jZSBzaGl0XHJcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gdGhpcy5zdGFydGluZ1ZhcmlhYmxlcy5nZXQoJ3RyYW5zZm9ybScpO1xyXG4gICAgICAgIHRoaXMudmFyaWFibGVzLnNldCgndHJhbnNmb3JtJywge1xyXG4gICAgICAgICAgICB0cmFuc2xhdGU6IHRyYW5zZm9ybS50cmFuc2xhdGUsXHJcbiAgICAgICAgICAgIHNjYWxlOiB0cmFuc2Zvcm0uc2NhbGUsXHJcbiAgICAgICAgICAgIHJvdGF0ZTogdHJhbnNmb3JtLnJvdGF0ZSxcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnRyID0gdGhpcy52YXJpYWJsZXMuZ2V0KCd0cmFuc2Zvcm0nKTtcclxuXHJcbiAgICAgICAgY29uc3Qgb2JqID0gdGhpcy5vYmo7XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSBhbGwgYXR0cmlidXRlcyBmcm9tIGVsZW1lbnQgRE9NXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IG9iai5hdHRyaWJ1dGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaSAtPSAxKSB7XHJcbiAgICAgICAgICAgIGlmIChvYmouYXR0cmlidXRlc1tpXS5uYW1lICE9PSAndHJhbnNmb3JtJykge1xyXG4gICAgICAgICAgICAgICAgb2JqLnJlbW92ZUF0dHJpYnV0ZShvYmouYXR0cmlidXRlc1tpXS5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBhZGQgYWxsIHN0YXJ0aW5nIGF0dHJpYnV0ZXNcclxuICAgICAgICBmdW5jdGlvbiBhZGQodmFsdWUsIGtleSkge1xyXG4gICAgICAgICAgICBpZiAoa2V5ICE9PSAndHJhbnNmb3JtJykge1xyXG4gICAgICAgICAgICAgICAgb2JqLnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnZhcmlhYmxlcy5mb3JFYWNoKGFkZCk7XHJcblxyXG5cclxuICAgICAgICAvLyBzZXQgc3RhcnRpbmcgdHJhbnNmb3JtXHJcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsTWF0cml4KCk7XHJcbiAgICB9XHJcblxyXG4vKlxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1BTklNQVRJTkctTUVUSE9EUy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiovXHJcbiAgICB0cmFuc2xhdGUoeCwgeSkge1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmUgPSB4O1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmYgPSB5O1xyXG5cclxuICAgICAgICB0aGlzLnNldE1hdHJpeCh0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeCk7XHJcbiAgICB9XHJcbiAgICByb3RhdGUoYW5nbGUpIHtcclxuICAgICAgICBjb25zdCByYWRpYW5zID0gKC1hbmdsZSAqIE1hdGguUEkpIC8gMTgwO1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLnNpbihyYWRpYW5zKSAqIHRoaXMudHIuc2NhbGU7XHJcbiAgICAgICAgY29uc3QgYSA9IE1hdGguY29zKHJhZGlhbnMpICogdGhpcy50ci5zY2FsZTtcclxuXHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYSA9IGE7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYiA9IC1jO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmMgPSBjO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmQgPSBhO1xyXG5cclxuICAgICAgICB0aGlzLnNldE1hdHJpeCh0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeCk7XHJcbiAgICB9XHJcbiAgICBzY2FsZShzKSB7XHJcbiAgICAgICAgY29uc3QgcmFkaWFucyA9ICgtdGhpcy50ci5yb3RhdGUgKiBNYXRoLlBJKSAvIDE4MDtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5zaW4ocmFkaWFucykgKiBzO1xyXG4gICAgICAgIGNvbnN0IGEgPSBNYXRoLmNvcyhyYWRpYW5zKSAqIHM7XHJcblxyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmEgPSBhO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmIgPSAtYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5jID0gYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5kID0gYTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRNYXRyaXgodGhpcy5tYW5pcHVsYXRpb25NYXRyaXgpO1xyXG4gICAgfVxyXG4gICAgc2NhbGVBbmRSb3RhdGUocywgYW5nbGUpIHtcclxuICAgICAgICBjb25zdCByYWRpYW5zID0gKC1hbmdsZSAqIE1hdGguUEkpIC8gMTgwO1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLnNpbihyYWRpYW5zKSAqIHM7XHJcbiAgICAgICAgY29uc3QgYSA9IE1hdGguY29zKHJhZGlhbnMpICogcztcclxuXHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYSA9IGE7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYiA9IC1jO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmMgPSBjO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmQgPSBhO1xyXG5cclxuICAgICAgICB0aGlzLnNldE1hdHJpeCh0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeCk7XHJcbiAgICB9XHJcbiAgICBzY2FsZUFuZFRyYW5zbGF0ZShzLCB4LCB5KSB7XHJcbiAgICAgICAgY29uc3QgcmFkaWFucyA9ICgtdGhpcy50ci5yb3RhdGUgKiBNYXRoLlBJKSAvIDE4MDtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5zaW4ocmFkaWFucykgKiBzO1xyXG4gICAgICAgIGNvbnN0IGEgPSBNYXRoLmNvcyhyYWRpYW5zKSAqIHM7XHJcblxyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmEgPSBhO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmIgPSAtYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5jID0gYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5kID0gYTtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5lID0geDtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5mID0geTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRNYXRyaXgodGhpcy5tYW5pcHVsYXRpb25NYXRyaXgpO1xyXG4gICAgfVxyXG4gICAgcm90YXRlQW5kVHJhbnNsYXRlKGFuZ2xlLCB4LCB5KSB7XHJcbiAgICAgICAgY29uc3QgcmFkaWFucyA9ICgtYW5nbGUgKiBNYXRoLlBJKSAvIDE4MDtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5zaW4ocmFkaWFucykgKiB0aGlzLnRyLnNjYWxlO1xyXG4gICAgICAgIGNvbnN0IGEgPSBNYXRoLmNvcyhyYWRpYW5zKSAqIHRoaXMudHIuc2NhbGU7XHJcblxyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmEgPSBhO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmIgPSAtYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5jID0gYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5kID0gYTtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5lID0geDtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5mID0geTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRNYXRyaXgodGhpcy5tYW5pcHVsYXRpb25NYXRyaXgpO1xyXG4gICAgfVxyXG4gICAgc2NhbGVBbmRSb3RhdGVBbmRUcmFuc2xhdGUocywgYW5nbGUsIHgsIHkpIHtcclxuICAgICAgICBjb25zdCByID0gKC1hbmdsZSAqIE1hdGguUEkpIC8gMTgwO1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLnNpbihyKSAqIHM7XHJcbiAgICAgICAgY29uc3QgYSA9IE1hdGguY29zKHIpICogcztcclxuXHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYSA9IGE7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYiA9IC1jO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmMgPSBjO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmQgPSBhO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmUgPSB4O1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmYgPSB5O1xyXG5cclxuICAgICAgICB0aGlzLnNldE1hdHJpeCh0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBPYmo7XHJcbiIsImNsYXNzIFNsaWRlIHt9XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTbGlkZTtcclxuIiwiaW1wb3J0IHN0ZXAgZnJvbSAnLi9lbmdpbmUvZGlzcGF0Y2gnO1xyXG5pbXBvcnQgT2JqIGZyb20gJy4vY2xhc3Nlcy9tYWluJztcclxuaW1wb3J0IFNsaWRlIGZyb20gJy4vY2xhc3Nlcy9zbGlkZSc7XHJcbmltcG9ydCB7IGFkZFNsaWRlcywgbmV4dCB9IGZyb20gJy4vY29udHJvbC9wbGF5ZXInO1xyXG5cclxuLy8gcm9sbHVwIHNoaXRcclxuKCgpID0+IFtzdGVwLCBPYmosIFNsaWRlLCBhZGRTbGlkZXMsIG5leHRdKSgpO1xyXG4iXSwibmFtZXMiOlsicGF1c2VUb1JlbG9hZCIsInBsYXlUb1BhdXNlIiwicmVsb2FkVG9QbGF5IiwicGF1c2VUb1BsYXkiXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sUUFBUSxHQUFHO0lBQ2IsR0FBRyxFQUFFLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUMsS0FBSyxFQUFFLEtBQUs7SUFDWixNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDbEMsbUJBQW1CLEVBQUUsSUFBSTtDQUM1QixDQUFDLEFBRUYsQUFBd0I7O0FDTHhCOztBQUVBLFNBQVMsYUFBYSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUU7SUFDOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNwQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDbkI7Q0FDSjtBQUNELFNBQVMsWUFBWSxDQUFDLEdBQUcsRUFBRTtJQUN2QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FB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QUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUNqRyxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3JHLENBQUMsQ0FBQyxDQUFDO1lBQ0gsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ25DLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ2pHLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7bUJBQzlGLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLEdB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QVMsbUJBQW1CLENBQUMsRUFBRSxFQUFFO0lBQzdCLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQzs7SUFFakIsU0FBUyxXQUFXLENBQUMsQ0FBQyxFQUFFO1FBQ3BCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdEMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzVGO0tBQ0o7O0lBRUQsU0FBUyxVQUFVLEdBQUc7UUFDbEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN0QyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JELEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDckQ7S0FDSjs7SUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FB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