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

class Text extends Obj {
    constructor(obj, transform = { translate: [0, 0], rotate: 0, scale: 1 }) {
        super(obj, transform);
        this.string = obj.textContent;
        this.checkIfString();
    }
    checkIfString() {
        if (this.string) {
            console.log(this.string);
        } else {
            throw new Error('Element is not text node, or element is empty');
        }
    }
}

class Slide {}

// rollup shit
(() => [step, Obj, Text, Slide, addSlides, next])();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIkY6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvc2V0dGluZ3MuanMiLCJGOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2VuZ2luZS9hbmltYXRlLmpzIiwiRjovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy9jb250cm9sL2J1dHRvbnMuanMiLCJGOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2NvbnRyb2wvcGxheWVyLmpzIiwiRjovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy91dGlscy5qcyIsIkY6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvZW5naW5lL2NhbGN1bGF0aW9ucy90cmFuc2Zvcm0uanMiLCJGOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2VuZ2luZS9jYWxjdWxhdGlvbnMvYXR0cmlidXRlLmpzIiwiRjovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy9lbmdpbmUvY2FsY3VsYXRpb25zL3JlbW92ZS5qcyIsIkY6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvZW5naW5lL2NhbGN1bGF0aW9ucy9zZXQuanMiLCJGOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2VuZ2luZS9jYWxjdWxhdGUuanMiLCJGOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2VuZ2luZS9kaXNwYXRjaC5qcyIsIkY6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvY2xhc3Nlcy9tYWluLmpzIiwiRjovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy9jbGFzc2VzL3RleHQuanMiLCJGOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2NsYXNzZXMvc2xpZGUuanMiLCJGOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHNldHRpbmdzID0ge1xyXG4gICAgc3ZnOiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc3ZnJylbMF0sICAgLy8gc3ZnIGVsZW1lbnRcclxuICAgIHNwZWVkOiAwLjAyNSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJhc2UgYW5pbWF0aW9uIHNwZWVkXHJcbiAgICBlYXNpbmc6IHQgPT4gdCAqIHQgKiAoMyAtICgyICogdCkpLCAgICAgICAgICAgICAvLyBlYXNpbmcgZnVuY3Rpb25cclxuICAgIGludGVyZmFjZUFuaW1hdGlvbnM6IHRydWUsICAgICAgICAgICAgICAgICAgICAgIC8vIHR1cm4gb24vb2ZmIGludGVyZmFjZSBhbmltYXRpb25zXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBzZXR0aW5ncztcclxuIiwiaW1wb3J0IHNldHRpbmdzIGZyb20gJy4uL3NldHRpbmdzJztcclxuXHJcbi8qIEFuaW1hdGUgcHJlZGVmaW5lZCBmdW5jdGlvbnMsIHRoZW4gdXBkYXRlIHZhcmlhYmxlcyAqL1xyXG5cclxuZnVuY3Rpb24gYW5pbWF0ZU9iamVjdChhcnIsIGVhc2UpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgYXJyW2ldWzBdKGVhc2UpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHVwZGF0ZU9iamVjdChhcnIpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgYXJyW2ldWzFdKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIG1haW4gYW5pbWF0aW9uIGZ1bmN0aW9uXHJcbmZ1bmN0aW9uIGFuaW1hdGUocywgZCwgYXJyKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICBsZXQgdCA9IDA7XHJcbiAgICAgICAgbGV0IGVhc2U7XHJcbiAgICAgICAgY29uc3Qgc3BlZWQgPSBzZXR0aW5ncy5zcGVlZCAqIHMgPiAwID8gc2V0dGluZ3Muc3BlZWQgKiBzIDogMC4wMjU7XHJcbiAgICAgICAgaWYgKHMgPT09IDApIHsgdCA9IDE7IH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcCgpIHtcclxuICAgICAgICAgICAgaWYgKHQgPCAxKSB7XHJcbiAgICAgICAgICAgICAgICB0ICs9IHNwZWVkO1xyXG4gICAgICAgICAgICAgICAgZWFzZSA9IHNldHRpbmdzLmVhc2luZyh0KTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZU9iamVjdChhcnJbaV0sIGVhc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqZWN0KGFycltpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoc3RlcCwgZCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgYW5pbWF0ZTtcclxuIiwiaW1wb3J0IHNldHRpbmdzIGZyb20gJy4uL3NldHRpbmdzJztcclxuXHJcbi8qXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUNSRUFURS1FTEVNRU5UUy1PRi1JTlRFUkZBQ0UtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuKi9cclxuXHJcbi8vIGRlY2xhcmUgdmFyaWFibGVzXHJcblxyXG5jb25zdCBpY29ucyA9IHtcclxuICAgIGdyb3VwOiBudWxsLFxyXG4gICAgcG9seWdvbjE6IG51bGwsXHJcbiAgICBwb2x5Z29uMjogbnVsbCxcclxuICAgIGFyYzE6IG51bGwsXHJcbiAgICBhcmMyOiBudWxsLFxyXG4gICAgcmVjdDogbnVsbCxcclxufTtcclxuXHJcbi8vIGNyZWF0ZSBpY29uc1xyXG5cclxuY29uc3QgeG1sbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xyXG5pY29ucy5ncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh4bWxucywgJ2cnKTtcclxuXHJcbmljb25zLmFyYzEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoeG1sbnMsICdwYXRoJyk7XHJcbmljb25zLmFyYzEuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCAnTTEwLDIwIEExMCwxMCAwIDAsMSAyMCwxMCcpO1xyXG5pY29ucy5ncm91cC5hcHBlbmRDaGlsZChpY29ucy5hcmMxKTtcclxuXHJcbmljb25zLmFyYzIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoeG1sbnMsICdwYXRoJyk7XHJcbmljb25zLmFyYzIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCAnTTMwLDIwIEExMCwxMCAwIDAsMSAyMCwzMCcpO1xyXG5pY29ucy5ncm91cC5hcHBlbmRDaGlsZChpY29ucy5hcmMyKTtcclxuXHJcbmljb25zLnBvbHlnb24xID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHhtbG5zLCAncG9seWdvbicpO1xyXG5pY29ucy5wb2x5Z29uMS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncG9pbnRzJywgJzEwLDEwIDEwLDMwIDIwLDI1IDIwLDE1Jyk7XHJcbmljb25zLmdyb3VwLmFwcGVuZENoaWxkKGljb25zLnBvbHlnb24xKTtcclxuXHJcbmljb25zLnBvbHlnb24yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHhtbG5zLCAncG9seWdvbicpO1xyXG5pY29ucy5wb2x5Z29uMi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncG9pbnRzJywgJzIwLDI1IDIwLDE1IDMwLDIwIDMwLDIwJyk7XHJcbmljb25zLmdyb3VwLmFwcGVuZENoaWxkKGljb25zLnBvbHlnb24yKTtcclxuXHJcbmljb25zLnJlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoeG1sbnMsICdyZWN0Jyk7XHJcbmljb25zLnJlY3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCAwKTtcclxuaWNvbnMucmVjdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIDApO1xyXG5pY29ucy5yZWN0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIDQwKTtcclxuaWNvbnMucmVjdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgNDApO1xyXG5pY29ucy5ncm91cC5hcHBlbmRDaGlsZChpY29ucy5yZWN0KTtcclxuXHJcbi8vIGFkZCBzdHlsZSB0byBpbnRlcmZhY2VcclxuXHJcbmNvbnN0IGNzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3R5bGUnKTtcclxuY3NzLnRleHRDb250ZW50ID0gJyNjb250cm9sID4gcmVjdCB7b3BhY2l0eTogMDsgY3Vyc29yOiBwb2ludGVyO30gI2NvbnRyb2wgPiBwYXRoIHtzdHJva2U6IzAwMDsgZmlsbDpub25lOyBzdHJva2Utd2lkdGg6IDJweDsgc3Ryb2tlLWRhc2hhcnJheTogMTZweDsgc3Ryb2tlLWRhc2hvZmZzZXQ6IDE2cHh9JztcclxuXHJcblxyXG5sZXQgZGVmcyA9IHNldHRpbmdzLnN2Zy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGVmcycpWzBdO1xyXG4vLyBjaGVjayBpZiBkZWZzIGVsZW1lbnQgaXMgYWxyZWFkeSBkZWNsYXJlZC4gSWYgbm90LCBhZGQgaXQgdG8gRE9NXHJcbmlmICghZGVmcykge1xyXG4gICAgZGVmcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RlZnMnKTtcclxuICAgIHNldHRpbmdzLnN2Zy5pbnNlcnRCZWZvcmUoZGVmcywgc2V0dGluZ3Muc3ZnLmZpcnN0Q2hpbGQpO1xyXG59XHJcbmRlZnMuYXBwZW5kQ2hpbGQoY3NzKTtcclxuXHJcbi8vIHNldCBpbnRlcmZhY2UgdG8gY29ycmVjdCBwb3NpdGlvblxyXG5jb25zdCB2aWV3Qm94ID0gc2V0dGluZ3Muc3ZnLnZpZXdCb3guYmFzZVZhbDtcclxuY29uc3QgbWF0cml4ID0gc2V0dGluZ3Muc3ZnLmNyZWF0ZVNWR01hdHJpeCgpO1xyXG5tYXRyaXguZSA9IHZpZXdCb3gueCArIDEwO1xyXG5tYXRyaXguZiA9IHZpZXdCb3gueSArICh2aWV3Qm94LmhlaWdodCAtIDUwKTtcclxuaWNvbnMuZ3JvdXAuaWQgPSAnY29udHJvbCc7XHJcbmljb25zLmdyb3VwLnRyYW5zZm9ybS5iYXNlVmFsLmluaXRpYWxpemUoc2V0dGluZ3Muc3ZnLmNyZWF0ZVNWR1RyYW5zZm9ybUZyb21NYXRyaXgobWF0cml4KSk7XHJcblxyXG5cclxuLy8gYWRkIGludGVyZmFjZSB0byBET01cclxuXHJcbnNldHRpbmdzLnN2Zy5hcHBlbmRDaGlsZChpY29ucy5ncm91cCk7XHJcblxyXG5cclxuLy8gYWRkIGV2ZW50IGxpc3RlbmVycyB0byBlbGVtZW50cyBvZiBpbnRlcmZhY2UsIGFuZCBzZXQgZXZlbnQgcHJvcGFnYXRpb25cclxuXHJcbmNvbnN0IGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbmV2ZW50LmluaXRFdmVudCgnYnV0dG9uLWNsaWNrJywgdHJ1ZSwgdHJ1ZSk7XHJcbmljb25zLnJlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7IHNldHRpbmdzLnN2Zy5kaXNwYXRjaEV2ZW50KGV2ZW50KTsgfSk7XHJcblxyXG5cclxuLypcclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUlOVEVSRkFDRS1BTklNQVRJT05TLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4qL1xyXG5cclxuLy8gYW5pbWF0aW9uIC0gcGxheSAtPiBwYXVzZVxyXG5cclxuZnVuY3Rpb24gYW5pbWF0ZVBsYXlUb1BhdXNlKCkge1xyXG4gICAgbGV0IHN0ZXBzID0gMTtcclxuXHJcbiAgICBpZiAoIXNldHRpbmdzLmludGVyZmFjZUFuaW1hdGlvbnMpIHtcclxuICAgICAgICBzdGVwcyA9IDEwO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFuaW1hdGUoKSB7XHJcbiAgICAgICAgaWYgKHN0ZXBzIDw9IDEwKSB7XHJcbiAgICAgICAgICAgIGljb25zLnBvbHlnb24xLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgYFxyXG4gICAgICAgICAgICAxMCwxMCBcclxuICAgICAgICAgICAgMTAsMzAgXHJcbiAgICAgICAgICAgICR7MjAgLSAoc3RlcHMgLyA1KSA+IDE4ID8gMjAgLSAoc3RlcHMgLyA1KSA6IDE4fSwkezI1ICsgKHN0ZXBzIC8gMikgPCAzMCA/IDI1ICsgKHN0ZXBzIC8gMikgOiAzMH0gXHJcbiAgICAgICAgICAgICR7MjAgLSAoc3RlcHMgLyA1KSA+IDE4ID8gMjAgLSAoc3RlcHMgLyA1KSA6IDE4fSwkezE1IC0gKHN0ZXBzIC8gMikgPiAxMCA/IDE1IC0gKHN0ZXBzIC8gMikgOiAxMH1cclxuICAgICAgICAgICAgYCk7XHJcbiAgICAgICAgICAgIGljb25zLnBvbHlnb24yLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgYFxyXG4gICAgICAgICAgICAkezIwICsgKHN0ZXBzIC8gNSkgPCAyMiA/IDIwICsgKHN0ZXBzIC8gNSkgOiAyMn0sJHsxNSAtIChzdGVwcyAvIDIpID4gMTAgPyAxNSAtIChzdGVwcyAvIDIpIDogMTB9IFxyXG4gICAgICAgICAgICAkezIwICsgKHN0ZXBzIC8gNSkgPCAyMiA/IDIwICsgKHN0ZXBzIC8gNSkgOiAyMn0sICR7MjUgKyAoc3RlcHMgLyAyKSA8IDMwID8gMjUgKyAoc3RlcHMgLyAyKSA6IDMwfSBcclxuICAgICAgICAgICAgMzAsJHsyMCArIHN0ZXBzIDwgMzAgPyAyMCArIHN0ZXBzIDogMzB9IFxyXG4gICAgICAgICAgICAzMCwkezIwIC0gc3RlcHMgPiAxMCA/IDIwIC0gc3RlcHMgOiAxMH1cclxuICAgICAgICAgICAgYCk7XHJcbiAgICAgICAgICAgIHN0ZXBzICs9IDE7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYW5pbWF0ZSgpO1xyXG59XHJcblxyXG4vLyBhbmltYXRpb24gLSBwYXVzZSAtPiBwbGF5XHJcblxyXG5mdW5jdGlvbiBhbmltYXRlUGF1c2VUb1BsYXkoKSB7XHJcbiAgICBsZXQgc3RlcHMgPSAxO1xyXG5cclxuICAgIGlmICghc2V0dGluZ3MuaW50ZXJmYWNlQW5pbWF0aW9ucykge1xyXG4gICAgICAgIHN0ZXBzID0gMTA7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYW5pbWF0ZSgpIHtcclxuICAgICAgICBpZiAoc3RlcHMgPD0gMTApIHtcclxuICAgICAgICAgICAgaWNvbnMucG9seWdvbjEuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBgXHJcbiAgICAgICAgICAgICAgICAxMCwxMCBcclxuICAgICAgICAgICAgICAgIDEwLDMwIFxyXG4gICAgICAgICAgICAgICAgJHsxOCArIChzdGVwcyAvIDUpIDwgMjAgPyAxOCArIChzdGVwcyAvIDUpIDogMjB9LCR7MzAgLSAoc3RlcHMgLyAyKSA+IDI1ID8gMzAgLSAoc3RlcHMgLyAyKSA6IDI1fSBcclxuICAgICAgICAgICAgICAgICR7MTggKyAoc3RlcHMgLyA1KSA8IDIwID8gMTggKyAoc3RlcHMgLyA1KSA6IDIwfSwkezEwICsgKHN0ZXBzIC8gMikgPCAxNSA/IDEwICsgKHN0ZXBzIC8gMikgOiAxNX1cclxuICAgICAgICAgICAgYCk7XHJcbiAgICAgICAgICAgIGljb25zLnBvbHlnb24yLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgYFxyXG4gICAgICAgICAgICAgICAgJHsyMiAtIChzdGVwcyAvIDUpID4gMjAgPyAyMiAtIChzdGVwcyAvIDUpIDogMjB9LCR7MTAgKyAoc3RlcHMgLyAyKSA8IDE1ID8gMTAgKyAoc3RlcHMgLyAyKSA6IDE1fSBcclxuICAgICAgICAgICAgICAgICR7MjIgLSAoc3RlcHMgLyA1KSA+IDIwID8gMjIgLSAoc3RlcHMgLyA1KSA6IDIwfSwkezMwIC0gKHN0ZXBzIC8gMikgPiAyNSA/IDMwIC0gKHN0ZXBzIC8gMikgOiAyNX0gXHJcbiAgICAgICAgICAgICAgICAzMCwkezMwIC0gKHN0ZXBzID4gMjApID8gMzAgLSBzdGVwcyA6IDIwfSBcclxuICAgICAgICAgICAgICAgIDMwLCR7MTAgKyAoc3RlcHMgPCAyMCkgPyAxMCArIHN0ZXBzIDogMjB9XHJcbiAgICAgICAgICAgIGApO1xyXG4gICAgICAgICAgICBzdGVwcyArPSAxO1xyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFuaW1hdGUoKTtcclxufVxyXG5cclxuLy8gYW5pbWF0aW9uIC0gcGF1c2UgLT4gcmVsb2FkXHJcblxyXG5mdW5jdGlvbiBhbmltYXRlUGF1c2VUb1JlbG9hZCgpIHtcclxuICAgIGxldCBzdGVwcyA9IDE7XHJcbiAgICBsZXQgb2Zmc2V0ID0gMTY7XHJcblxyXG4gICAgaWYgKCFzZXR0aW5ncy5pbnRlcmZhY2VBbmltYXRpb25zKSB7XHJcbiAgICAgICAgc3RlcHMgPSAxMDtcclxuICAgICAgICBvZmZzZXQgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFuaW1hdGVBcmMoKSB7XHJcbiAgICAgICAgaWYgKG9mZnNldCA+IDApIHtcclxuICAgICAgICAgICAgb2Zmc2V0IC09IDE7XHJcbiAgICAgICAgICAgIGljb25zLmFyYzEuc2V0QXR0cmlidXRlKCdzdHlsZScsIGBzdHJva2UtZGFzaG9mZnNldDoke29mZnNldH1weGApO1xyXG4gICAgICAgICAgICBpY29ucy5hcmMyLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBgc3Ryb2tlLWRhc2hvZmZzZXQ6JHtvZmZzZXR9cHhgKTtcclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlQXJjKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpY29ucy5hcmMxLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnc3Ryb2tlLWRhc2hvZmZzZXQ6MCcpO1xyXG4gICAgICAgICAgICBpY29ucy5hcmMyLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnc3Ryb2tlLWRhc2hvZmZzZXQ6MCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhbmltYXRlKCkge1xyXG4gICAgICAgIGlmIChzdGVwcyA8PSAxMCkge1xyXG4gICAgICAgICAgICBpY29ucy5wb2x5Z29uMS5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsIGBcclxuICAgICAgICAgICAgICAgICR7MTAgLSAoc3RlcHMgKiAwLjQpID4gNiA/IDEwIC0gKHN0ZXBzICogMC40KSA6IDZ9LCR7MTAgKyBzdGVwcyA8IDIwID8gMTAgKyBzdGVwcyA6IDIwfSBcclxuICAgICAgICAgICAgICAgIDEwLCR7MzAgLSAoc3RlcHMgKiAwLjQpID4gMjYgPyAzMCAtIChzdGVwcyAqIDAuNCkgOiAyNn0gXHJcbiAgICAgICAgICAgICAgICAkezE4IC0gKHN0ZXBzICogMC44KSA+IDEwID8gMTggLSAoc3RlcHMgKiAwLjgpIDogMTB9LCR7MzAgLSAoc3RlcHMgKiAwLjQpID4gMjYgPyAzMCAtIChzdGVwcyAqIDAuNCkgOiAyNn0gXHJcbiAgICAgICAgICAgICAgICAkezE4IC0gKHN0ZXBzICogMC40KSA+IDE0ID8gMTggLSAoc3RlcHMgKiAwLjQpIDogMTR9LCR7MTAgKyBzdGVwcyA8IDIwID8gMTAgKyBzdGVwcyA6IDIwfVxyXG4gICAgICAgICAgICBgKTtcclxuICAgICAgICAgICAgaWNvbnMucG9seWdvbjIuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBgXHJcbiAgICAgICAgICAgICAgICAkezIyICsgKHN0ZXBzICogMC44KSA8IDMwID8gMjIgKyAoc3RlcHMgKiAwLjgpIDogMzB9LCR7MTAgKyAoc3RlcHMgKiAwLjQpIDwgMTQgPyAxMCArIChzdGVwcyAqIDAuNCkgOiAxNH0gXHJcbiAgICAgICAgICAgICAgICAkezIyICsgKHN0ZXBzICogMC40KSA8IDI2ID8gMjIgKyAoc3RlcHMgKiAwLjQpIDogMjZ9LCR7MzAgLSBzdGVwcyA+IDIwID8gMzAgLSBzdGVwcyA6IDIwfSBcclxuICAgICAgICAgICAgICAgICAkezMwICsgKHN0ZXBzICogMC40KSA8IDM0ID8gMzAgKyAoc3RlcHMgKiAwLjQpIDogMzR9LCR7MzAgLSBzdGVwcyA+IDIwID8gMzAgLSBzdGVwcyA6IDIwfSBcclxuICAgICAgICAgICAgICAgIDMwLCR7MTAgKyAoc3RlcHMgKiAwLjQpIDwgMTQgPyAxMCArIChzdGVwcyAqIDAuNCkgOiAxNH1cclxuICAgICAgICAgICAgYCk7XHJcbiAgICAgICAgICAgIHN0ZXBzICs9IDE7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYW5pbWF0ZUFyYygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFuaW1hdGUoKTtcclxufVxyXG5cclxuLy8gYW5pbWF0aW9uIC0gcmVsb2FkIC0+IHBsYXlcclxuXHJcbmZ1bmN0aW9uIGFuaW1hdGVSZWxvYWRUb1BsYXkoKSB7XHJcbiAgICBsZXQgc3RlcHMgPSAxO1xyXG4gICAgbGV0IG9mZnNldCA9IDA7XHJcblxyXG4gICAgaWYgKCFzZXR0aW5ncy5pbnRlcmZhY2VBbmltYXRpb25zKSB7XHJcbiAgICAgICAgc3RlcHMgPSAxMDtcclxuICAgICAgICBvZmZzZXQgPSAxNjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhbmltYXRlKCkge1xyXG4gICAgICAgIGlmIChzdGVwcyA8PSAxMCkge1xyXG4gICAgICAgICAgICBpY29ucy5wb2x5Z29uMS5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsIGBcclxuICAgICAgICAgICAgICAgICR7NiArIChzdGVwcyAqIDAuNCkgPCAxMCA/IDYgKyAoc3RlcHMgKiAwLjQpIDogMTB9LCR7MjAgLSBzdGVwcyA+IDEwID8gMjAgLSBzdGVwcyA6IDEwfSBcclxuICAgICAgICAgICAgICAgIDEwLCR7MjYgKyAoc3RlcHMgKiAwLjQpIDwgMzAgPyAyNiArIChzdGVwcyAqIDAuNCkgOiAzMH0gXHJcbiAgICAgICAgICAgICAgICAkezEwICsgc3RlcHMgPCAyMCA/IDEwICsgc3RlcHMgOiAyMH0sJHsyNiAtIChzdGVwcyAqIDAuMSkgPiAyNSA/IDI2IC0gKHN0ZXBzICogMC4xKSA6IDI1fSBcclxuICAgICAgICAgICAgICAgICR7MTQgKyAoc3RlcHMgKiAwLjYpIDwgMjAgPyAxNCArIChzdGVwcyAqIDAuNikgOiAyMH0sJHsyMCAtIChzdGVwcyAqIDAuNSkgPiAxNSA/IDIwIC0gKHN0ZXBzICogMC41KSA6IDE1fVxyXG4gICAgICAgICAgICBgKTtcclxuICAgICAgICAgICAgaWNvbnMucG9seWdvbjIuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBgXHJcbiAgICAgICAgICAgICAgICAkezMwIC0gc3RlcHMgPiAyMCA/IDMwIC0gc3RlcHMgOiAyMH0sJHsxNCArIChzdGVwcyAqIDAuMSkgPCAxNSA/IDE0ICsgKHN0ZXBzICogMC4xKSA6IDE1fSBcclxuICAgICAgICAgICAgICAgICR7MjYgLSAoc3RlcHMgKiAwLjYpID4gMjAgPyAyNiAtIChzdGVwcyAqIDAuNikgOiAyMH0sJHsyMCArIChzdGVwcyAqIDAuNSkgPCAyNSA/IDIwICsgKHN0ZXBzICogMC41KSA6IDI1fSBcclxuICAgICAgICAgICAgICAgICR7MzQgLSAoc3RlcHMgKiAwLjQpID4gMzAgPyAzNCAtIChzdGVwcyAqIDAuNCkgOiAzMH0sMjAgXHJcbiAgICAgICAgICAgICAgICAzMCwkezE0ICsgKHN0ZXBzICogMC42KSA8IDIwID8gMTQgKyAoc3RlcHMgKiAwLjYpIDogMjB9XHJcbiAgICAgICAgICAgIGApO1xyXG4gICAgICAgICAgICBzdGVwcyArPSAxO1xyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhbmltYXRlQXJjKCkge1xyXG4gICAgICAgIGlmIChvZmZzZXQgPCAxNikge1xyXG4gICAgICAgICAgICBvZmZzZXQgKz0gMTtcclxuICAgICAgICAgICAgaWNvbnMuYXJjMS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYHN0cm9rZS1kYXNob2Zmc2V0OiR7b2Zmc2V0fXB4YCk7XHJcbiAgICAgICAgICAgIGljb25zLmFyYzIuc2V0QXR0cmlidXRlKCdzdHlsZScsIGBzdHJva2UtZGFzaG9mZnNldDoke29mZnNldH1gKTtcclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlQXJjKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpY29ucy5hcmMxLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcclxuICAgICAgICAgICAgaWNvbnMuYXJjMi5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XHJcbiAgICAgICAgICAgIGFuaW1hdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhbmltYXRlQXJjKCk7XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBhbmltYXRlUGxheVRvUGF1c2UgYXMgcGxheVRvUGF1c2UsXHJcbiAgICBhbmltYXRlUGF1c2VUb1BsYXkgYXMgcGF1c2VUb1BsYXksXHJcbiAgICBhbmltYXRlUGF1c2VUb1JlbG9hZCBhcyBwYXVzZVRvUmVsb2FkLFxyXG4gICAgYW5pbWF0ZVJlbG9hZFRvUGxheSBhcyByZWxvYWRUb1BsYXksXHJcbn07XHJcbiIsImltcG9ydCB7IHBsYXlUb1BhdXNlLCBwYXVzZVRvUGxheSwgcGF1c2VUb1JlbG9hZCwgcmVsb2FkVG9QbGF5IH0gZnJvbSAnLi9idXR0b25zJztcclxuXHJcbi8qIFBsYXllciBzdGFydHMsIHN0b3BzLCByZXN1bWVzIG9yIHJlbG9hZHMgc2xpZGUgc2hvdyAqL1xyXG5cclxuLy8gYXJyYXkgb2YgYWxsIHNsaWRlc1xyXG5jb25zdCBzbGlkZXMgPSBbXTtcclxuLy8gc2V0IG9mIGFsbCBlbGVtZW50cyB1c2VkIGluIGFuaW1hdGlvbnMuIE5lZWRlZCBmb3IgcmVzdGFydGluZywgc2V0dGluZyBlbGVtZW50cyB0byBzdGFydGluZyBwb3NpdGlvbnNcclxuY29uc3Qgb2JqZWN0TGlzdCA9IG5ldyBTZXQoKTtcclxubGV0IGN1cnJlbnRTbGlkZSA9IDA7XHJcbmxldCBzdGF0dXMgPSAnbm90IHN0YXJ0ZWQnO1xyXG5cclxuZnVuY3Rpb24gc3RhcnQoKSB7XHJcbiAgICBjdXJyZW50U2xpZGUgPSAwO1xyXG4gICAgc2xpZGVzW2N1cnJlbnRTbGlkZV0ucGxheSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXNldCgpIHtcclxuICAgIG9iamVjdExpc3QuZm9yRWFjaCgoZWwpID0+IHsgZWwucmVzZXQoKTsgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc3VtZSgpIHtcclxuICAgIGlmIChjdXJyZW50U2xpZGUgKyAxID49IHNsaWRlcy5sZW5ndGgpIHtcclxuICAgICAgICBzdGF0dXMgPSAnZmluaXNoZWQnO1xyXG4gICAgICAgIHBhdXNlVG9SZWxvYWQoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY3VycmVudFNsaWRlICs9IDE7XHJcbiAgICAgICAgc2xpZGVzW2N1cnJlbnRTbGlkZV0ucGxheSgpO1xyXG4gICAgICAgIHBsYXlUb1BhdXNlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbnRyb2xQbGF5ZXIoKSB7XHJcbiAgICBpZiAoc2xpZGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gc2xpZGVzIHRvIGFuaW1hdGUuIEFkZCBzbGlkZXMgdXNpbmcgXCJhZGRTbGlkZXNcIiBmdW5jdGlvbi4nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc3RhdHVzID09PSAnZmluaXNoZWQnKSB7XHJcbiAgICAgICAgc3RhdHVzID0gJ25vdCBzdGFydGVkJztcclxuICAgICAgICByZXNldCgpO1xyXG4gICAgICAgIHJlbG9hZFRvUGxheSgpO1xyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09ICdwbGF5aW5nJykge1xyXG4gICAgICAgIHN0YXR1cyA9ICdwYXVzZWQnO1xyXG4gICAgICAgIHBhdXNlVG9QbGF5KCk7XHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gJ3BhdXNlZCcpIHtcclxuICAgICAgICBzdGF0dXMgPSAncGxheWluZyc7XHJcbiAgICAgICAgcmVzdW1lKCk7XHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gJ25vdCBzdGFydGVkJykge1xyXG4gICAgICAgIHN0YXR1cyA9ICdwbGF5aW5nJztcclxuICAgICAgICBzdGFydCgpO1xyXG4gICAgICAgIHBsYXlUb1BhdXNlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5leHQoZGVsYXkpIHtcclxuICAgIGlmIChjdXJyZW50U2xpZGUgKyAxID49IHNsaWRlcy5sZW5ndGgpIHtcclxuICAgICAgICBzdGF0dXMgPSAnZmluaXNoZWQnO1xyXG4gICAgICAgIHBhdXNlVG9SZWxvYWQoKTtcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzICE9PSAncGF1c2VkJykge1xyXG4gICAgICAgIGN1cnJlbnRTbGlkZSArPSAxO1xyXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHsgc2xpZGVzW2N1cnJlbnRTbGlkZV0ucGxheSgpOyB9LCBkZWxheSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFNsaWRlcyguLi5zbGlkZSkge1xyXG4gICAgc2xpZGVzLnB1c2goLi4uc2xpZGUpO1xyXG59XHJcbmZ1bmN0aW9uIGFkZE9iamVjdHMob2JqZWN0KSB7XHJcbiAgICBvYmplY3RMaXN0LmFkZChvYmplY3QpO1xyXG59XHJcblxyXG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uLWNsaWNrJywgY29udHJvbFBsYXllciwgZmFsc2UpO1xyXG5cclxuZXhwb3J0IHsgYWRkU2xpZGVzLCBhZGRPYmplY3RzLCBuZXh0IH07XHJcblxyXG4iLCJjb25zdCB1dGlscyA9IHtcclxuICAgIHVuZGVmOiBpdGVtID0+ICh0eXBlb2YgaXRlbSA9PT0gJ3VuZGVmaW5lZCcpLCAgIC8vIGNoZWNrIGlmIGFyZ3VtZW50IGlzIHVuZGVmaW5lZFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgdXRpbHM7XHJcbiIsImltcG9ydCB1dGlscyBmcm9tICcuLy4uLy4uL3V0aWxzJztcclxuXHJcbi8qIERlZmluZSBtb3N0IGVmZmljaWVudCBmdW5jdGlvbiB1c2VkIHRvIGFuaW1hdGUgdHJhbnNmb3JtIHByb3BlcnR5LCB0aGVuIGFkZCBpdCB0byBhcnJheSBvZiBmdW5jdGlvbnMgZm9yIGFuaW1hdGlvbiAqL1xyXG5cclxuZnVuY3Rpb24gY2FsY3VsYXRlVHJhbnNmb3JtKGVsKSB7XHJcbiAgICBjb25zdCB0YXJnZXRUcmFuc2Zvcm0gPSBlbC50cmFuc2Zvcm07XHJcblxyXG4gICAgLy8gY2hlY2sgaWYgdHJhbnNmb3JtIGFuaW1hdGlvbiBpcyByZXF1ZXN0ZWRcclxuICAgIGlmICghdXRpbHMudW5kZWYodGFyZ2V0VHJhbnNmb3JtKSkge1xyXG4gICAgICAgIGxldCBhbmltYXRlRnVuYztcclxuICAgICAgICBsZXQgdXBkYXRlRnVuYztcclxuICAgICAgICBjb25zdCBvYmplY3QgPSBlbC5vYmplY3Q7XHJcbiAgICAgICAgY29uc3Qgc3RhcnRpbmdUcmFuc2Zvcm0gPSBlbC5vYmplY3QudHI7XHJcblxyXG4gICAgICAgIGNvbnN0IGRlbHRhU2NhbGUgPSB0YXJnZXRUcmFuc2Zvcm0uc2NhbGUgLSBzdGFydGluZ1RyYW5zZm9ybS5zY2FsZTtcclxuICAgICAgICBjb25zdCBkZWx0YVJvdGF0ZSA9IHRhcmdldFRyYW5zZm9ybS5yb3RhdGUgLSBzdGFydGluZ1RyYW5zZm9ybS5yb3RhdGU7XHJcbiAgICAgICAgbGV0IGRlbHRhMDtcclxuICAgICAgICBsZXQgZGVsdGExO1xyXG4gICAgICAgIGlmICghdXRpbHMudW5kZWYodGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZSkpIHtcclxuICAgICAgICAgICAgZGVsdGEwID0gKHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGVbMF0pIC0gc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlWzBdO1xyXG4gICAgICAgICAgICBkZWx0YTEgPSAodGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVsxXSkgLSBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGVbMV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiAtLS0tLS0tLSB0cmFuc2Zvcm1zIHdpdGhvdXQgdHJhbnNsYXRpb24gLS0tLS0tLS0gKi9cclxuICAgICAgICBpZiAodXRpbHMudW5kZWYodGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZSkpIHtcclxuICAgICAgICAgICAgaWYgKHV0aWxzLnVuZGVmKHRhcmdldFRyYW5zZm9ybS5yb3RhdGUpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBvbmx5IHNjYWxpbmdcclxuICAgICAgICAgICAgICAgIGFuaW1hdGVGdW5jID0gKHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3Quc2NhbGUoc3RhcnRpbmdUcmFuc2Zvcm0uc2NhbGUgKyAoZGVsdGFTY2FsZSAqIHQpKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVGdW5jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5zY2FsZSh0YXJnZXRUcmFuc2Zvcm0uc2NhbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnNjYWxlID0gdGFyZ2V0VHJhbnNmb3JtLnNjYWxlO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh1dGlscy51bmRlZih0YXJnZXRUcmFuc2Zvcm0uc2NhbGUpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBvbmx5IHJvdGF0aW9uXHJcbiAgICAgICAgICAgICAgICBhbmltYXRlRnVuYyA9ICh0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnJvdGF0ZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0ucm90YXRlICsgKGRlbHRhUm90YXRlICogdCkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUZ1bmMgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnJvdGF0ZSh0YXJnZXRUcmFuc2Zvcm0ucm90YXRlKTtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5yb3RhdGUgPSB0YXJnZXRUcmFuc2Zvcm0ucm90YXRlO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIHNjYWxpbmcgYW5kIHJvdGF0aW5nXHJcbiAgICAgICAgICAgICAgICBhbmltYXRlRnVuYyA9ICh0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnNjYWxlQW5kUm90YXRlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5zY2FsZSArIChkZWx0YVNjYWxlICogdCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnJvdGF0ZSArIChkZWx0YVJvdGF0ZSAqIHQpKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVGdW5jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5zY2FsZUFuZFJvdGF0ZSh0YXJnZXRUcmFuc2Zvcm0uc2NhbGUsIHRhcmdldFRyYW5zZm9ybS5yb3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnNjYWxlID0gdGFyZ2V0VHJhbnNmb3JtLnNjYWxlO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnJvdGF0ZSA9IHRhcmdldFRyYW5zZm9ybS5yb3RhdGU7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgLyogLS0tLS0tLS0gdHJhbnNmb3JtcyB3aXRoIHRyYW5zbGF0aW9uIC0tLS0tLS0tICovXHJcbiAgICAgICAgfSBlbHNlIGlmICh1dGlscy51bmRlZih0YXJnZXRUcmFuc2Zvcm0uc2NhbGUpICYmIHV0aWxzLnVuZGVmKHRhcmdldFRyYW5zZm9ybS5yb3RhdGUpKSB7XHJcbiAgICAgICAgICAgIC8vIG9ubHkgdHJhbnNsYXRpb25cclxuICAgICAgICAgICAgYW5pbWF0ZUZ1bmMgPSAodCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LnRyYW5zbGF0ZShcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGVbMF0gKyAoZGVsdGEwICogdCksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlWzFdICsgKGRlbHRhMSAqIHQpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdXBkYXRlRnVuYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdC50cmFuc2xhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVswXSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlWzFdKTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZSA9IHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIGlmICh1dGlscy51bmRlZih0YXJnZXRUcmFuc2Zvcm0ucm90YXRlKSkge1xyXG4gICAgICAgICAgICAvLyBzY2FsZSBhbmQgdHJhbnNsYXRpb25cclxuICAgICAgICAgICAgYW5pbWF0ZUZ1bmMgPSAodCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LnNjYWxlQW5kVHJhbnNsYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnNjYWxlICsgKGRlbHRhU2NhbGUgKiB0KSxcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGVbMF0gKyAoZGVsdGEwICogdCksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlWzFdICsgKGRlbHRhMSAqIHQpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdXBkYXRlRnVuYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdC5zY2FsZUFuZFRyYW5zbGF0ZShcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0uc2NhbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVswXSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlWzFdKTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnNjYWxlID0gdGFyZ2V0VHJhbnNmb3JtLnNjYWxlO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlID0gdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0YXJnZXRUcmFuc2Zvcm0uc2NhbGUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIC8vIHJvdGF0aW9uIGFuZCB0cmFuc2xhdGlvblxyXG4gICAgICAgICAgICBhbmltYXRlRnVuYyA9ICh0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3Qucm90YXRlQW5kVHJhbnNsYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnJvdGF0ZSArIChkZWx0YVJvdGF0ZSAqIHQpLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZVswXSArIChkZWx0YTAgKiB0KSxcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGVbMV0gKyAoZGVsdGExICogdCkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB1cGRhdGVGdW5jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LnJvdGF0ZUFuZFRyYW5zbGF0ZShcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0ucm90YXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGVbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVsxXSk7XHJcbiAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5yb3RhdGUgPSB0YXJnZXRUcmFuc2Zvcm0ucm90YXRlO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlID0gdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBzY2FsZSwgcm90YXRpb24gYW5kIHRyYW5zbGF0aW9uXHJcbiAgICAgICAgICAgIGFuaW1hdGVGdW5jID0gKHQpID0+IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdC5zY2FsZUFuZFJvdGF0ZUFuZFRyYW5zbGF0ZShcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5zY2FsZSArIChkZWx0YVNjYWxlICogdCksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0ucm90YXRlICsgKGRlbHRhUm90YXRlICogdCksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlWzBdICsgKGRlbHRhMCAqIHQpLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZVsxXSArIChkZWx0YTEgKiB0KSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHVwZGF0ZUZ1bmMgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3Quc2NhbGVBbmRSb3RhdGVBbmRUcmFuc2xhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnNjYWxlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRyYW5zZm9ybS5yb3RhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVswXSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlWzFdKTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnNjYWxlID0gdGFyZ2V0VHJhbnNmb3JtLnNjYWxlO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0ucm90YXRlID0gdGFyZ2V0VHJhbnNmb3JtLnJvdGF0ZTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZSA9IHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gW2FuaW1hdGVGdW5jLCB1cGRhdGVGdW5jXTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2FsY3VsYXRlVHJhbnNmb3JtO1xyXG4iLCJpbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi8uLi91dGlscyc7XHJcblxyXG4vKiBEZWZpbmUgZnVuY3Rpb24gdXNlZCB0byBhbmltYXRlIGF0dHJpYnV0ZXMsIHRoZW4gYWRkIGl0IHRvIGFycmF5IG9mIGZ1bmN0aW9ucyBmb3IgYW5pbWF0aW9uICovXHJcblxyXG5mdW5jdGlvbiBjYWxjdWxhdGVBdHRyaWJ1dGVzKGVsKSB7XHJcbiAgICBjb25zdCB0YWJsZSA9IFtdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFuaW1hdGVGdW5jKHQpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhYmxlLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGVsLm9iamVjdC5vYmouc2V0QXR0cmlidXRlKHRhYmxlW2ldWzBdLCB0YWJsZVtpXVsxXSArICgodGFibGVbaV1bMl0gLSB0YWJsZVtpXVsxXSkgKiB0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZUZ1bmMoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWJsZS5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBlbC5vYmplY3Qub2JqLnNldEF0dHJpYnV0ZSh0YWJsZVtpXVswXSwgdGFibGVbaV1bMl0pO1xyXG4gICAgICAgICAgICBlbC5vYmplY3QudmFyaWFibGVzLnNldCh0YWJsZVtpXVswXSwgdGFibGVbaV1bMl0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIGNoZWNrIGlmIGF0dHJpYnV0ZXMgYW5pbWF0aW9uIGlzIHJlcXVlc3RlZFxyXG4gICAgaWYgKCF1dGlscy51bmRlZihlbC5hdHRyaWJ1dGVzKSAmJiBlbC5hdHRyaWJ1dGVzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBBcnJheS5pc0FycmF5KGVsLmF0dHJpYnV0ZXMpID8gZWwuYXR0cmlidXRlcyA6IFtlbC5hdHRyaWJ1dGVzXTtcclxuICAgICAgICAvLyBmb3IgZXZlcnkgYXR0cmlidXRlXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIC8vIHByb3BlcnR5IG5hbWVcclxuICAgICAgICAgICAgY29uc3QgbmFtZSA9IGF0dHJpYnV0ZXNbaV0ubmFtZTtcclxuXHJcbiAgICAgICAgICAgIC8vIHN0YXJ0aW5nIHZhbHVlXHJcbiAgICAgICAgICAgIGNvbnN0IGZyb20gPSB1dGlscy51bmRlZihhdHRyaWJ1dGVzW2ldLmZyb20pID8gZWwub2JqZWN0LnZhcmlhYmxlcy5nZXQobmFtZSkgOiBhdHRyaWJ1dGVzW2ldLmZyb207XHJcblxyXG4gICAgICAgICAgICAvLyB0aHJvdyBlcnJvciBpZiBzdGFydGluZyB2YWx1ZSBpcyBub3QgZGVmaW5lZC4gTmVpdGhlciBpbiByZXF1ZXN0IG5vciBpbiBET00gZWxlbWVudFxyXG4gICAgICAgICAgICBpZiAodXRpbHMudW5kZWYoZnJvbSkpIHsgdGhyb3cgbmV3IEVycm9yKGBObyBcImZyb21cIiB2YWx1ZSwgZm9yICR7bmFtZX1gKTsgfVxyXG5cclxuICAgICAgICAgICAgLy8gdGFyZ2V0IHZhbHVlXHJcbiAgICAgICAgICAgIGNvbnN0IHRvID0gYXR0cmlidXRlc1tpXS50bztcclxuXHJcbiAgICAgICAgICAgIHRhYmxlLnB1c2goW25hbWUsIGZyb20sIHRvXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbYW5pbWF0ZUZ1bmMsIHVwZGF0ZUZ1bmNdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjYWxjdWxhdGVBdHRyaWJ1dGVzO1xyXG4iLCJpbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi8uLi91dGlscyc7XHJcblxyXG4vKiBmdW5jdGlvbiB0aGF0IHJlbW92ZXMgYXR0cmlidXRlcyAqL1xyXG5cclxuZnVuY3Rpb24gY2FsY3VsYXRlUmVtb3ZlKGVsKSB7XHJcbiAgICBjb25zdCByZW1vdmUgPSBlbC5yZW1vdmU7XHJcbiAgICBsZXQgcmVtb3ZlRnVuYztcclxuICAgIGxldCB1cGRhdGVGdW5jO1xyXG5cclxuICAgIC8vIGNoZWNrIGlmIHRoZXJlIGFyZSBhdHRyaWJ1dGVzIHRvIHJlbW92ZVxyXG4gICAgaWYgKCF1dGlscy51bmRlZihyZW1vdmUpKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBbXTsgLy8gYXJyYXkgb2YgYXR0cmlidXRlcyByZW1vdmVkIGF0IHN0YXJ0XHJcbiAgICAgICAgY29uc3QgZW5kID0gW107IC8vIGFycmF5IG9mIGF0dHJpYnV0ZXMgcmVtb3ZlZCBhdCBlbmRcclxuICAgICAgICBjb25zdCBpdGVtcyA9IEFycmF5LmlzQXJyYXkocmVtb3ZlKSA/IHJlbW92ZSA6IFtyZW1vdmVdO1xyXG5cclxuICAgICAgICAvLyBhZGQgYXR0cmlidXRlcyB0byBzdGFydC9lbmQgYXJyYXlcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtc1tpXS53aGVuID09PSAnZW5kJykge1xyXG4gICAgICAgICAgICAgICAgZW5kLnB1c2goaXRlbXNbaV0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc3RhcnQucHVzaChpdGVtc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gcmVtb3ZlIGF0dHJpYnV0ZXMgYXQgc3RhcnRcclxuICAgICAgICBpZiAoc3RhcnQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhcnQubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgICAgIGVsLm9iamVjdC5vYmoucmVtb3ZlQXR0cmlidXRlKHN0YXJ0W2ldLm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgZWwub2JqZWN0LnZhcmlhYmxlcy5kZWxldGUoc3RhcnRbaV0ubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZGVmaW5lIGFuZCByZXR1cm4gZnVuY3Rpb24gdG8gcmVtb3ZlIGF0dHJpYnV0ZXMgYXQgdGhlIGVuZFxyXG4gICAgICAgIGlmIChlbmQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJlbW92ZUZ1bmMgPSAoKSA9PiBmYWxzZTtcclxuICAgICAgICAgICAgdXBkYXRlRnVuYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW5kLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwub2JqZWN0Lm9iai5yZW1vdmVBdHRyaWJ1dGUoZW5kW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsLm9iamVjdC52YXJpYWJsZXMuZGVsZXRlKGVuZFtpXS5uYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIFtyZW1vdmVGdW5jLCB1cGRhdGVGdW5jXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNhbGN1bGF0ZVJlbW92ZTtcclxuIiwiaW1wb3J0IHV0aWxzIGZyb20gJy4vLi4vLi4vdXRpbHMnO1xyXG5cclxuLyogZnVuY3Rpb24gdGhhdCBzZXRzIGF0dHJpYnV0ZXMgKi9cclxuXHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZVNldChlbCkge1xyXG4gICAgY29uc3Qgc2V0ID0gZWwuc2V0O1xyXG4gICAgbGV0IHNldEZ1bmM7XHJcbiAgICBsZXQgdXBkYXRlRnVuYztcclxuXHJcbiAgICAvLyBjaGVjayBpZiB0aGVyZSBhcmUgYXR0cmlidXRlcyB0byBzZXRcclxuICAgIGlmICghdXRpbHMudW5kZWYoc2V0KSkge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gW107IC8vIGFycmF5IG9mIGF0dHJpYnV0ZXMgc2V0IGF0IHN0YXJ0XHJcbiAgICAgICAgY29uc3QgZW5kID0gW107IC8vIGFycmF5IG9mIGF0dHJpYnV0ZXMgc2V0IGF0IGVuZFxyXG4gICAgICAgIGNvbnN0IGl0ZW1zID0gQXJyYXkuaXNBcnJheShzZXQpID8gc2V0IDogW3NldF07XHJcblxyXG4gICAgICAgIC8vIGFkZCBhdHRyaWJ1dGVzIHRvIHN0YXJ0L2VuZCBhcnJheVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW1zW2ldLndoZW4gPT09ICdlbmQnKSB7XHJcbiAgICAgICAgICAgICAgICBlbmQucHVzaChpdGVtc1tpXSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzdGFydC5wdXNoKGl0ZW1zW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgYXR0cmlidXRlcyBhdCBzdGFydFxyXG4gICAgICAgIGlmIChzdGFydC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFydC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgZWwub2JqZWN0Lm9iai5zZXRBdHRyaWJ1dGUoc3RhcnRbaV0ubmFtZSwgc3RhcnRbaV0udmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgZWwub2JqZWN0LnZhcmlhYmxlcy5zZXQoc3RhcnRbaV0ubmFtZSwgc3RhcnRbaV0udmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGRlZmluZSBhbmQgcmV0dXJuIGZ1bmN0aW9uIHRvIHNldCBhdHRyaWJ1dGVzIGF0IHRoZSBlbmRcclxuICAgICAgICBpZiAoZW5kLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBzZXRGdW5jID0gKCkgPT4gZmFsc2U7XHJcbiAgICAgICAgICAgIHVwZGF0ZUZ1bmMgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVuZC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsLm9iamVjdC5vYmouc2V0QXR0cmlidXRlKGVuZFtpXS5uYW1lLCBlbmRbaV0udmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsLm9iamVjdC52YXJpYWJsZXMuc2V0KGVuZFtpXS5uYW1lLCBlbmRbaV0udmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gW3NldEZ1bmMsIHVwZGF0ZUZ1bmNdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2FsY3VsYXRlU2V0O1xyXG4iLCJpbXBvcnQgYW5pbWF0ZSBmcm9tICcuL2FuaW1hdGUnO1xyXG5pbXBvcnQgeyBhZGRPYmplY3RzIH0gZnJvbSAnLi4vY29udHJvbC9wbGF5ZXInO1xyXG5pbXBvcnQgY2FsY3VsYXRlVHJhbnNmb3JtIGZyb20gJy4vY2FsY3VsYXRpb25zL3RyYW5zZm9ybSc7XHJcbmltcG9ydCBjYWxjdWxhdGVBdHRyaWJ1dGVzIGZyb20gJy4vY2FsY3VsYXRpb25zL2F0dHJpYnV0ZSc7XHJcbmltcG9ydCBjYWxjdWxhdGVSZW1vdmUgZnJvbSAnLi9jYWxjdWxhdGlvbnMvcmVtb3ZlJztcclxuaW1wb3J0IGNhbGN1bGF0ZVNldCBmcm9tICcuL2NhbGN1bGF0aW9ucy9zZXQnO1xyXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMnO1xyXG5cclxuLyogU3BlY2lmeSBmdW5jdGlvbnMgdXNlZCB0byBhbmltYXRpb25zLCBhbmQgc2VuZCB0aGVtIHRvIGFuaW1hdGUgZnVuY3Rpb24gKi9cclxuXHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZShlbCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgLy8gZGVjbGFyZSBhcnJheSBvZiBhbmltYXRpb24gZnVuY3Rpb25zXHJcbiAgICAgICAgY29uc3QgYXJyID0gW107XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0cyA9IEFycmF5LmlzQXJyYXkoZWwub2JqZWN0cykgPyBlbC5vYmplY3RzIDogW2VsLm9iamVjdHNdO1xyXG4gICAgICAgIC8vIFNldCBmdW5jdGlvbiBmb3IgZXZlcnkgb2JqZWN0XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmplY3RzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RPYmplY3QgPSBvYmplY3RzW2ldO1xyXG5cclxuICAgICAgICAgICAgLy8gZGVmaW5lIHRyYW5zZm9ybSBhbmltYXRpb24gZnVuY3Rpb24sIGlmIHRyYW5zZm9ybSBhbmltYXRpb24gaXMgcmVxdWVzdGVkXHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGN1bGF0ZWRUcmFuc2Zvcm0gPSBjYWxjdWxhdGVUcmFuc2Zvcm0ocmVxdWVzdE9iamVjdCk7XHJcbiAgICAgICAgICAgIGlmIChjYWxjdWxhdGVkVHJhbnNmb3JtKSB7IGFyci5wdXNoKFtjYWxjdWxhdGVkVHJhbnNmb3JtXSk7IH1cclxuXHJcbiAgICAgICAgICAgIC8vIGRlZmluZSBhdHRyaWJ1dGUgYW5pbWF0aW9uIGZ1bmN0aW9uLCBpZiBhdHRyaWJ1dGUgYW5pbWF0aW9uIGlzIHJlcXVlc3RlZFxyXG4gICAgICAgICAgICBjb25zdCBjYWxjdWxhdGVkQXR0cmlidXRlcyA9IGNhbGN1bGF0ZUF0dHJpYnV0ZXMocmVxdWVzdE9iamVjdCk7XHJcbiAgICAgICAgICAgIGlmIChjYWxjdWxhdGVkQXR0cmlidXRlcykgeyBhcnIucHVzaChbY2FsY3VsYXRlZEF0dHJpYnV0ZXNdKTsgfVxyXG5cclxuICAgICAgICAgICAgLy8gZGVmaW5lIHJlbW92ZSBhdHRyaWJ1dGUgZnVuY3Rpb24sIGlmIGF0dHJpYnV0ZXMgbmVlZHMgdG8gYmUgcmVtb3ZlZFxyXG4gICAgICAgICAgICBjb25zdCBjYWxjdWxhdGVkUmVtb3ZlID0gY2FsY3VsYXRlUmVtb3ZlKHJlcXVlc3RPYmplY3QpO1xyXG4gICAgICAgICAgICBpZiAoY2FsY3VsYXRlZFJlbW92ZSkgeyBhcnIucHVzaChbY2FsY3VsYXRlZFJlbW92ZV0pOyB9XHJcblxyXG4gICAgICAgICAgICAvLyBkZWZpbmUgc2V0IGF0dHJpYnV0ZSBmdW5jdGlvbiwgaWYgYXR0cmlidXRlcyBuZWVkcyB0byBiZSBzZXRcclxuICAgICAgICAgICAgY29uc3QgY2FsY3VsYXRlZFNldCA9IGNhbGN1bGF0ZVNldChyZXF1ZXN0T2JqZWN0KTtcclxuICAgICAgICAgICAgaWYgKGNhbGN1bGF0ZWRTZXQpIHsgYXJyLnB1c2goW2NhbGN1bGF0ZWRTZXRdKTsgfVxyXG5cclxuICAgICAgICAgICAgLy8gYWRkIG9iamVjdHMgdG8gb2JqZWN0cyBzZXQgaW4gcGxheWVyLmpzLiBOZWVkZWQgZm9yIHJlc2V0aW5nXHJcbiAgICAgICAgICAgIGFkZE9iamVjdHMob2JqZWN0c1tpXS5vYmplY3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZW5kIGFycmF5IG9mIGZ1bmN0aW9ucyB0byBhbmltYXRlIGZ1bmN0aW9uXHJcbiAgICAgICAgYW5pbWF0ZShcclxuICAgICAgICAgICAgdXRpbHMudW5kZWYoZWwuc3BlZWQpID8gMSA6IGVsLnNwZWVkLFxyXG4gICAgICAgICAgICBlbC5kZWxheSB8fCAwLFxyXG4gICAgICAgICAgICBhcnIpXHJcbiAgICAgICAgLnRoZW4oKCkgPT4geyByZXNvbHZlKCk7IH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNhbGN1bGF0ZTtcclxuIiwiaW1wb3J0IGNhbGN1bGF0ZSBmcm9tICcuL2NhbGN1bGF0ZSc7XHJcblxyXG4vKiBTcGxpdCByZXF1ZXN0IHRvIHRocmVhZHMsIGFuZCBkaXNwYXRjaCB0byBcImNhbGN1bGF0ZVwiIGZ1bmN0aW9uICovXHJcblxyXG5mdW5jdGlvbiBkaXNwYXRjaCguLi50aHJlYWRzKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGlmICh0aHJlYWRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAvLyB0aHJvdyBlcnJvciwgaWYgcmVxdWVzdCBpcyBlbXB0eVxyXG4gICAgICAgICAgICByZWplY3QoRXJyb3IoJ0FkZCBvYmplY3RzIHRvIFwic3RlcFwiIGZ1bmN0aW9uJykpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFyciA9IFtdO1xyXG4gICAgICAgICAgICAvLyBzZW5kIGFsbCB0aHJlYWRzIHRvIGNhbGN1bGF0aW9uXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhyZWFkcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgYXJyLnB1c2goY2FsY3VsYXRlKHRocmVhZHNbaV0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBhZnRlciBhbmltYXRpb24gY29tcGxldGVkLCByZXNvbHZlIHByb21pc2UgdG8gbGF1bmNoIG5leHQgc2VxdWVuY2VcclxuICAgICAgICAgICAgUHJvbWlzZS5hbGwoYXJyKS50aGVuKCgpID0+IHsgcmVzb2x2ZSgpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuLy8gcmVuYW1lIGVsZW1lbnQgZm9yIGVhc2llciBhY2Nlc3NcclxuY29uc3Qgc3RlcCA9IGRpc3BhdGNoO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgc3RlcDtcclxuIiwiaW1wb3J0IHNldHRpbmdzIGZyb20gJy4uL3NldHRpbmdzJzsgLy8gaW1wb3J0IHNldHRpbmdzIGZvciBnZXR0aW5nIGFjY2VzcyB0byBTVkcgZWxlbWVudFxyXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMnOyAvLyBpbXBvcnQgdXRpbHMgZm9yIHV0aWxzLnVuZGVmXHJcblxyXG5jbGFzcyBPYmoge1xyXG4vKlxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUNPTlNUUlVDVE9SLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiovXHJcbiAgICBjb25zdHJ1Y3RvcihvYmosIHRyYW5zZm9ybSA9IHsgdHJhbnNsYXRlOiBbMCwgMF0sIHJvdGF0ZTogMCwgc2NhbGU6IDEgfSkge1xyXG4gICAgICAgIC8vIGFjY2VzcyB0byBET00gb2JqZWN0XHJcbiAgICAgICAgdGhpcy5vYmogPSBvYmo7XHJcbiAgICAgICAgLy8gY3JlYXRlIHplcm8gbWF0cml4XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXggPSBzZXR0aW5ncy5zdmcuY3JlYXRlU1ZHTWF0cml4KCk7XHJcbiAgICAgICAgLy8gc2V0IHN0YXJ0aW5nIHZhcmlhYmxlcywgYW5kIGRlY2xhcmUgdGhpcy5zdGFydGluZ1ZhcmlhYmxlcyBhbmQgdGhpcy52YXJpYWJsZXNcclxuICAgICAgICB0aGlzLnNldFN0YXJ0aW5nVmFyaWFibGVzKHRyYW5zZm9ybSk7XHJcbiAgICAgICAgLy8gc2V0IGluaXRpYWwgbWF0cml4XHJcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsTWF0cml4KCk7XHJcblxyXG4gICAgICAgIC8qIC0tLS0tLS0tIHNob3J0Y3V0cyAtLS0tLS0tLSAqL1xyXG5cclxuICAgICAgICAvLyB0byBtYXRyaXggaW50ZXJmYWNlIC0+IHRoaXMuU1ZHVHJhbnNmb3JtXHJcblxyXG4gICAgICAgIC8vIHRvIGN1cnJlbnQgdHJhbnNmb3JtXHJcbiAgICAgICAgdGhpcy50ciA9IHRoaXMudmFyaWFibGVzLmdldCgndHJhbnNmb3JtJyk7XHJcbiAgICB9XHJcblxyXG4vKlxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tSU5JVElBTElaSU5HIE1FVEhPRFMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiovXHJcblxyXG5cclxuICAgIHNldFN0YXJ0aW5nVmFyaWFibGVzKHRyYW5zZm9ybSkge1xyXG4gICAgICAgIGNvbnN0IG1hcCA9IG5ldyBNYXAoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub2JqLmF0dHJpYnV0ZXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub2JqLmF0dHJpYnV0ZXNbaV0uc3BlY2lmaWVkICYmIHRoaXMub2JqLmF0dHJpYnV0ZXNbaV0ubmFtZSAhPT0gJ3RyYW5zZm9ybScpIHtcclxuICAgICAgICAgICAgICAgIG1hcC5zZXQodGhpcy5vYmouYXR0cmlidXRlc1tpXS5uYW1lLCBwYXJzZUZsb2F0KHRoaXMub2JqLmF0dHJpYnV0ZXNbaV0udmFsdWUpIHx8IHRoaXMub2JqLmF0dHJpYnV0ZXNbaV0udmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RhcnRpbmdWYXJpYWJsZXMgPSBuZXcgTWFwKG1hcCk7XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMgPSBuZXcgTWFwKG1hcCk7XHJcblxyXG4gICAgICAgIC8vIHJlZmVyZW5jZSBzaGl0XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgW3RoaXMuc3RhcnRpbmdWYXJpYWJsZXMsIHRoaXMudmFyaWFibGVzXVtpXS5zZXQoJ3RyYW5zZm9ybScsIHtcclxuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZTogdXRpbHMudW5kZWYodHJhbnNmb3JtLnRyYW5zbGF0ZSkgPyBbMCwgMF0gOiB0cmFuc2Zvcm0udHJhbnNsYXRlLFxyXG4gICAgICAgICAgICAgICAgc2NhbGU6IHV0aWxzLnVuZGVmKHRyYW5zZm9ybS5zY2FsZSkgPyAxIDogdHJhbnNmb3JtLnNjYWxlLFxyXG4gICAgICAgICAgICAgICAgcm90YXRlOiB1dGlscy51bmRlZih0cmFuc2Zvcm0ucm90YXRlKSA/IDAgOiB0cmFuc2Zvcm0ucm90YXRlLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SW5pdGlhbE1hdHJpeCgpIHtcclxuICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSB0aGlzLnZhcmlhYmxlcy5nZXQoJ3RyYW5zZm9ybScpO1xyXG4gICAgICAgIHRoaXMub2JqLnRyYW5zZm9ybS5iYXNlVmFsLmluaXRpYWxpemUoc2V0dGluZ3Muc3ZnLmNyZWF0ZVNWR1RyYW5zZm9ybUZyb21NYXRyaXgodGhpcy5tYW5pcHVsYXRpb25NYXRyaXgpKTtcclxuICAgICAgICB0aGlzLlNWR1RyYW5zZm9ybSA9IHRoaXMub2JqLnRyYW5zZm9ybS5iYXNlVmFsLmdldEl0ZW0oMCk7XHJcbiAgICAgICAgdGhpcy5zY2FsZUFuZFJvdGF0ZUFuZFRyYW5zbGF0ZSh0cmFuc2Zvcm0uc2NhbGUsIHRyYW5zZm9ybS5yb3RhdGUsIHRyYW5zZm9ybS50cmFuc2xhdGVbMF0sIHRyYW5zZm9ybS50cmFuc2xhdGVbMV0pO1xyXG4gICAgfVxyXG5cclxuLypcclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLU9USEVSLU1FVEhPRFMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4qL1xyXG5cclxuICAgIHNldE1hdHJpeChtYXRyaXgpIHsgdGhpcy5TVkdUcmFuc2Zvcm0uc2V0TWF0cml4KG1hdHJpeCk7IH1cclxuXHJcbiAgICByZXNldCgpIHtcclxuICAgICAgICAvLyByZXNldCB2YXJpYWJsZXNcclxuICAgICAgICB0aGlzLnZhcmlhYmxlcyA9IG5ldyBNYXAodGhpcy5zdGFydGluZ1ZhcmlhYmxlcyk7XHJcbiAgICAgICAgLy8gcmVmZXJlbmNlIHNoaXRcclxuICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSB0aGlzLnN0YXJ0aW5nVmFyaWFibGVzLmdldCgndHJhbnNmb3JtJyk7XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMuc2V0KCd0cmFuc2Zvcm0nLCB7XHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZTogdHJhbnNmb3JtLnRyYW5zbGF0ZSxcclxuICAgICAgICAgICAgc2NhbGU6IHRyYW5zZm9ybS5zY2FsZSxcclxuICAgICAgICAgICAgcm90YXRlOiB0cmFuc2Zvcm0ucm90YXRlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudHIgPSB0aGlzLnZhcmlhYmxlcy5nZXQoJ3RyYW5zZm9ybScpO1xyXG5cclxuICAgICAgICBjb25zdCBvYmogPSB0aGlzLm9iajtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGFsbCBhdHRyaWJ1dGVzIGZyb20gZWxlbWVudCBET01cclxuICAgICAgICBmb3IgKGxldCBpID0gb2JqLmF0dHJpYnV0ZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpIC09IDEpIHtcclxuICAgICAgICAgICAgaWYgKG9iai5hdHRyaWJ1dGVzW2ldLm5hbWUgIT09ICd0cmFuc2Zvcm0nKSB7XHJcbiAgICAgICAgICAgICAgICBvYmoucmVtb3ZlQXR0cmlidXRlKG9iai5hdHRyaWJ1dGVzW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGFkZCBhbGwgc3RhcnRpbmcgYXR0cmlidXRlc1xyXG4gICAgICAgIGZ1bmN0aW9uIGFkZCh2YWx1ZSwga2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgIT09ICd0cmFuc2Zvcm0nKSB7XHJcbiAgICAgICAgICAgICAgICBvYmouc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudmFyaWFibGVzLmZvckVhY2goYWRkKTtcclxuXHJcblxyXG4gICAgICAgIC8vIHNldCBzdGFydGluZyB0cmFuc2Zvcm1cclxuICAgICAgICB0aGlzLnNldEluaXRpYWxNYXRyaXgoKTtcclxuICAgIH1cclxuXHJcbi8qXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUFOSU1BVElORy1NRVRIT0RTLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuKi9cclxuICAgIHRyYW5zbGF0ZSh4LCB5KSB7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZSA9IHg7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZiA9IHk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TWF0cml4KHRoaXMubWFuaXB1bGF0aW9uTWF0cml4KTtcclxuICAgIH1cclxuICAgIHJvdGF0ZShhbmdsZSkge1xyXG4gICAgICAgIGNvbnN0IHJhZGlhbnMgPSAoLWFuZ2xlICogTWF0aC5QSSkgLyAxODA7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguc2luKHJhZGlhbnMpICogdGhpcy50ci5zY2FsZTtcclxuICAgICAgICBjb25zdCBhID0gTWF0aC5jb3MocmFkaWFucykgKiB0aGlzLnRyLnNjYWxlO1xyXG5cclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5hID0gYTtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5iID0gLWM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYyA9IGM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZCA9IGE7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TWF0cml4KHRoaXMubWFuaXB1bGF0aW9uTWF0cml4KTtcclxuICAgIH1cclxuICAgIHNjYWxlKHMpIHtcclxuICAgICAgICBjb25zdCByYWRpYW5zID0gKC10aGlzLnRyLnJvdGF0ZSAqIE1hdGguUEkpIC8gMTgwO1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLnNpbihyYWRpYW5zKSAqIHM7XHJcbiAgICAgICAgY29uc3QgYSA9IE1hdGguY29zKHJhZGlhbnMpICogcztcclxuXHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYSA9IGE7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYiA9IC1jO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmMgPSBjO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmQgPSBhO1xyXG5cclxuICAgICAgICB0aGlzLnNldE1hdHJpeCh0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeCk7XHJcbiAgICB9XHJcbiAgICBzY2FsZUFuZFJvdGF0ZShzLCBhbmdsZSkge1xyXG4gICAgICAgIGNvbnN0IHJhZGlhbnMgPSAoLWFuZ2xlICogTWF0aC5QSSkgLyAxODA7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguc2luKHJhZGlhbnMpICogcztcclxuICAgICAgICBjb25zdCBhID0gTWF0aC5jb3MocmFkaWFucykgKiBzO1xyXG5cclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5hID0gYTtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5iID0gLWM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYyA9IGM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZCA9IGE7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TWF0cml4KHRoaXMubWFuaXB1bGF0aW9uTWF0cml4KTtcclxuICAgIH1cclxuICAgIHNjYWxlQW5kVHJhbnNsYXRlKHMsIHgsIHkpIHtcclxuICAgICAgICBjb25zdCByYWRpYW5zID0gKC10aGlzLnRyLnJvdGF0ZSAqIE1hdGguUEkpIC8gMTgwO1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLnNpbihyYWRpYW5zKSAqIHM7XHJcbiAgICAgICAgY29uc3QgYSA9IE1hdGguY29zKHJhZGlhbnMpICogcztcclxuXHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYSA9IGE7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYiA9IC1jO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmMgPSBjO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmQgPSBhO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmUgPSB4O1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmYgPSB5O1xyXG5cclxuICAgICAgICB0aGlzLnNldE1hdHJpeCh0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeCk7XHJcbiAgICB9XHJcbiAgICByb3RhdGVBbmRUcmFuc2xhdGUoYW5nbGUsIHgsIHkpIHtcclxuICAgICAgICBjb25zdCByYWRpYW5zID0gKC1hbmdsZSAqIE1hdGguUEkpIC8gMTgwO1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLnNpbihyYWRpYW5zKSAqIHRoaXMudHIuc2NhbGU7XHJcbiAgICAgICAgY29uc3QgYSA9IE1hdGguY29zKHJhZGlhbnMpICogdGhpcy50ci5zY2FsZTtcclxuXHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYSA9IGE7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYiA9IC1jO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmMgPSBjO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmQgPSBhO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmUgPSB4O1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmYgPSB5O1xyXG5cclxuICAgICAgICB0aGlzLnNldE1hdHJpeCh0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeCk7XHJcbiAgICB9XHJcbiAgICBzY2FsZUFuZFJvdGF0ZUFuZFRyYW5zbGF0ZShzLCBhbmdsZSwgeCwgeSkge1xyXG4gICAgICAgIGNvbnN0IHIgPSAoLWFuZ2xlICogTWF0aC5QSSkgLyAxODA7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguc2luKHIpICogcztcclxuICAgICAgICBjb25zdCBhID0gTWF0aC5jb3MocikgKiBzO1xyXG5cclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5hID0gYTtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5iID0gLWM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYyA9IGM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZCA9IGE7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZSA9IHg7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZiA9IHk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TWF0cml4KHRoaXMubWFuaXB1bGF0aW9uTWF0cml4KTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE9iajtcclxuIiwiaW1wb3J0IE9iaiBmcm9tICcuL21haW4nO1xyXG5cclxuY2xhc3MgVGV4dCBleHRlbmRzIE9iaiB7XHJcbiAgICBjb25zdHJ1Y3RvcihvYmosIHRyYW5zZm9ybSA9IHsgdHJhbnNsYXRlOiBbMCwgMF0sIHJvdGF0ZTogMCwgc2NhbGU6IDEgfSkge1xyXG4gICAgICAgIHN1cGVyKG9iaiwgdHJhbnNmb3JtKTtcclxuICAgICAgICB0aGlzLnN0cmluZyA9IG9iai50ZXh0Q29udGVudDtcclxuICAgICAgICB0aGlzLmNoZWNrSWZTdHJpbmcoKTtcclxuICAgIH1cclxuICAgIGNoZWNrSWZTdHJpbmcoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RyaW5nKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgaXMgbm90IHRleHQgbm9kZSwgb3IgZWxlbWVudCBpcyBlbXB0eScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVGV4dDtcclxuIiwiY2xhc3MgU2xpZGUge31cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNsaWRlO1xyXG4iLCJpbXBvcnQgc3RlcCBmcm9tICcuL2VuZ2luZS9kaXNwYXRjaCc7XHJcbmltcG9ydCBPYmogZnJvbSAnLi9jbGFzc2VzL21haW4nO1xyXG5pbXBvcnQgVGV4dCBmcm9tICcuL2NsYXNzZXMvdGV4dCc7XHJcbmltcG9ydCBTbGlkZSBmcm9tICcuL2NsYXNzZXMvc2xpZGUnO1xyXG5pbXBvcnQgeyBhZGRTbGlkZXMsIG5leHQgfSBmcm9tICcuL2NvbnRyb2wvcGxheWVyJztcclxuXHJcbi8vIHJvbGx1cCBzaGl0XHJcbigoKSA9PiBbc3RlcCwgT2JqLCBUZXh0LCBTbGlkZSwgYWRkU2xpZGVzLCBuZXh0XSkoKTtcclxuIl0sIm5hbWVzIjpbInBhdXNlVG9SZWxvYWQiLCJw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LENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2pHLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDakcsQ0FBQyxDQUFDLENBQUM7WUFDSCxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN2QyxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2pHLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7ZUFDL0YsRUFBRSxFQUFF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QUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ3ZELEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ3pHLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUM3RixDQUFDLENBQUMsQ0FBQztZQUNILEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNuQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUN6RyxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEtBQUssR0FBRyxFQUFFLENBQUM7aUJBQ3hGLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsS0FBSyxHQUFHLEVBQUUsQ0FBQzttQkFDdkYsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDM0QsQ0FBQyxDQUFDLENBQUM7WUFDSCxLQUFLLElBQUksQ0FBQyxDQUFDO1lBQ1gsTUFBTSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3pDLE1BQU07WUFDSCxVQUFVLEVBQUUsQ0FBQztTQUNoQjtLQUNKO0lBQ0QsT0FBTyxFQUFFLENBQUM7Q0FDYjs7OztBQUlELFNBQVMsbUJBQW1CLEdBQUc7SUFDM0IsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDOztJQUVmLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEVBQUU7UUFDL0IsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNYLE1BQU0sR0FBRyxFQUFFLENBQUM7S0FDZjs7SUFFRCxTQUFTLE9BQU8sR0FBRztRQUNmLElBQUksS0FBSyxJQUFJLEVBQUUsRUFBRTtZQUNiLEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNuQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEtBQUssR0FBRyxFQUFFLENBQUM7bUJBQ3BGLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUN2RCxFQUFFLEVBQUUsR0FBRyxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ3pGLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDN0csQ0FBQyxDQUFDLENBQUM7WUFDSCxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDbkMsRUFBRSxFQUFFLEdBQUcsS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUN6RixFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFH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QyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM1RjtLQUNKOztJQUVELFNBQVMsVUFBVSxHQUFHO1FBQ2xCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdEMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyRCxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3JEO0tBQ0o7O0lBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUMzRCxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDOztRQUVsRixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFOztZQUUzQyxNQUFNLElBQUksR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDOzs7WUFHaEMsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7OztZQUdsRyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7OztZQUczRSxNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDOztZQUU1QixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ2hDO1FBQ0QsT0FBTyxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztLQUNwQztJQUNELE9BQU8sS0FBSyxDQUFDO0NBQ2hCLEFBRUQsQUFBbUM7O0FDekNuQzs7QUFFQSxTQUFTLGVBQWUsQ0FBQyxFQUFFLEVBQUU7SUFDekIsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUN6QixJQUFJLFVBQVUsQ0FBQztJQUNmLElBQUksVUFBVSxDQUFDOzs7SUFHZixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUN0QixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDakIsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2YsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7O1FBR3hELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdEMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLEtBQUssRUFBRTtnQkFDekIsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN0QixNQUFNO2dCQUNILEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDeEI7U0FDSjs7UUFFRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDZCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN0QyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM3QyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzdDO1NBQ0o7O1FBRUQsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFO1lBQ1osVUFBVSxHQUFHLE1BQU0sS0FBSyxDQUFDO1lBQ3pCLFVBQVUsR0FBRyxNQUFNO2dCQUNmLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ3BDLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzNDLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQzNDO2FBQ0osQ0FBQztZQUNGLE9BQU8sQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7U0FDbkM7S0FDSjtJQUNELE9BQU8sS0FBSyxDQUFDO0NBQ2hCLEFBRUQsQUFBK0I7O0FDM0MvQjs7QUFFQSxTQUFTLFlBQVksQ0FBQyxFQUFFLEVBQUU7SUFDdEIsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQztJQUNuQixJQUFJLE9BQU8sQ0FBQztJQUNaLElBQUksVUFBVSxDQUFDOzs7SUFHZixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNuQixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDakIsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2YsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7O1FBRy9DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdEMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLEtBQUssRUFBRTtnQkFDekIsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN0QixNQUFNO2dCQUNILEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDeEI7U0FDSjs7UUFFRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDZCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN0QyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzFELEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUMxRDtTQUNKOztRQUVELElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRTtZQUNaLE9BQU8sR0FBRyxNQUFNLEtBQUssQ0FBQztZQUN0QixVQUFVLEdBQUcsTUFBTTtnQkFDZixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNwQyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3RELEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDdEQ7YUFDSixDQUFDO1lBQ0YsT0FBTyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztTQUNoQztLQUNKO0lBQ0QsT0FBTyxLQUFLLENBQUM7Q0FDaEIsQUFFRCxBQUE0Qjs7QUNyQzVCOztBQUVBLFNBQVMsU0FBUyxDQUFDLEVBQUUsRUFBRTtJQUNuQixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxLQUFLOztRQUU1QixNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDZixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztRQUV0RSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3hDLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O1lBR2pDLE1BQU0sbUJBQW1CLEdBQUcsa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDOUQsSUFBSSxtQkFBbUIsRUFBRSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsRUFBRTs7O1lBRzdELE1BQU0sb0JBQW9CLEdBQUcsbUJBQW1CLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDaEUsSUFBSSxvQkFBb0IsRUFBRSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsRUFBRTs7O1lBRy9ELE1BQU0sZ0JBQWdCLEdBQUcsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3hELElBQUksZ0JBQWdCLEVBQUUsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEVBQUU7OztZQUd2RCxNQUFNLGFBQWEsR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDbEQsSUFBSSxhQUFhLEVBQUUsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFOzs7WUFHakQsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNqQzs7UUFFRCxPQUFPO1lBQ0gsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLO1lBQ3BDLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQztZQUNiLEdBQUcsQ0FBQztTQUNQLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDL0IsQ0FBQyxDQUFDO0NBQ04sQUFFRCxBQUF5Qjs7QUM3Q3pCOztBQUVBLFNBQVMsUUFBUSxDQUFDLEdBQUcsT0FBTyxFQUFFO0lBQzFCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxLQUFLO1FBQ3BDLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7O1lBRXRCLE1BQU0sQ0FBQyxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxDQUFDO1NBQ25ELE1BQU07WUFDSCxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7O1lBRWYsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDeEMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNuQzs7WUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDL0M7S0FDSixDQUFDLENBQUM7Q0FDTjs7O0FBR0QsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLEFBRXRCLEFBQW9COztBQ3JCcEIsTUFBTSxHQUFHLENBQUM7Ozs7O0lBS04sV0FBVyxDQUFDLEdBQUcsRUFBRSxTQUFTLEdBQUcsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O1FBRXJFLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDOztRQUVmLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxDQUFDOztRQUV6RCxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7O1FBRXJDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDOzs7Ozs7O1FBT3hCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDN0M7Ozs7Ozs7O0lBUUQsb0JBQW9CLENBQUMsU0FBUyxFQUFFO1FBQzVCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7UUFDdEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3BELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxXQUFXLEVBQUU7Z0JBQ2pGLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNsSDtTQUNKO1FBQ0QsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7OztRQUc5QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDM0IsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUU7Z0JBQ3pELFNBQVMsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsU0FBUztnQkFDMUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSztnQkFDekQsTUFBTSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTTthQUMvRCxDQUFDLENBQUM7U0FDTjtLQUNKOztJQUVELGdCQUFnQixHQUFHO1FBQ2YsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7UUFDMUcsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQywwQkFBMEIsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDdEg7Ozs7Ozs7SUFPRCxTQUFTLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRTs7SUFFMUQsS0FBSyxHQUFHOztRQUVKLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7O1FBRWpELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFO1lBQzVCLFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUztZQUM5QixLQUFLLEVBQUUsU0FBUyxDQUFDLEtBQUs7WUFDdEIsTUFBTSxFQUFFLFNBQVMsQ0FBQyxNQUFNO1NBQzNCLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7O1FBRTFDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7OztRQUdyQixLQUFLLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDcEQsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxXQUFXLEVBQUU7Z0JBQ3hDLEdBQUcsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMvQztTQUNKOztRQUVELFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7WUFDckIsSUFBSSxHQUFHLEtBQUssV0FBVyxFQUFFO2dCQUNyQixHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUNoQztTQUNKO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Ozs7UUFJNUIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7S0FDM0I7Ozs7OztJQU1ELFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ1osSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7O1FBRTlCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7S0FDM0M7SUFDRCxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ1YsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDNUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQzs7UUFFNUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7UUFFOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztLQUMzQztJQUNELEtBQUssQ0FBQyxDQUFDLEVBQUU7UUFDTCxNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUNsRCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQzs7UUFFaEMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7UUFFOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztLQUMzQztJQUNELGNBQWMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFO1FBQ3JCLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUN6QyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQzs7UUFFaEMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7UUFFOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztLQUMzQztJQUNELGlCQUFpQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ3ZCLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ2xELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztRQUVoQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztRQUU5QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0tBQzNDO0lBQ0Qsa0JBQWtCLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDNUIsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDNUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQzs7UUFFNUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7UUFFOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztLQUMzQztJQUNELDBCQUEwQixDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUN2QyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDbkMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7O1FBRTFCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7O1FBRTlCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7S0FDM0M7Q0FDSixBQUdELEFBQW1COztBQzVMbkIsTUFBTSxJQUFJLFNBQVMsR0FBRyxDQUFDO0lBQ25CLFdBQVcsQ0FBQyxHQUFHLEVBQUUsU0FBUyxHQUFHLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3JFLEtBQUssQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDO1FBQzlCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztLQUN4QjtJQUNELGFBQWEsR0FBRztRQUNaLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzVCLE1BQU07WUFDSCxNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7U0FDcEU7S0FDSjtDQUNKLEFBRUQsQUFBb0I7O0FDakJwQixNQUFNLEtBQUssQ0FBQyxFQUFFLEFBRWQsQUFBcUI7O0FDSXJCO0FBQ0EsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMifQ==