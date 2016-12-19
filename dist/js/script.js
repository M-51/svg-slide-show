const settings = {
    svg: document.getElementsByTagName('svg')[0],
    speed: 0.025,
    easing: t => t * t * (3 - (2 * t)),
};

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


function animate(s, d, arr) {
    return new Promise((resolve) => {
        let t = 0;
        let ease;
        const speed = settings.speed * s > 0 ? settings.speed * s : 0.025;

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

/*--------------------------------------------------------------------------
****************************************************************************

                        Create elements of interface

***************************************************************************
--------------------------------------------------------------------------*/

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

/*--------------------------------------------------------------------------
****************************************************************************

                        interface animations

***************************************************************************
--------------------------------------------------------------------------*/

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

const utils = {
    undef: item => (typeof item === 'undefined'),
};

function calculateTransform(el) {
    const targetTransform = el.transform;

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

    if (!utils.undef(attributes) && attributes.length !== 0) {
        for (let i = 0; i < attributes.length; i += 1) {
            const name = attributes[i].name;

            const from = utils.undef(attributes[i].from) ? el.object.variables.get(name) : attributes[i].from;
            if (utils.undef(from)) { throw new Error(`No "from" value, for ${name}`); }

            const to = attributes[i].to;

            table.push([name, from, to]);
        }
        return [animateFunc, updateFunc];
    }
    return false;
}

function calculate(el) {
    const arr = [];
    return new Promise((resolve) => {
        for (let i = 0; i < el.objects.length; i += 1) {
            const requestObject = el.objects[i];

            const calculatedTransform = calculateTransform(requestObject);
            if (calculatedTransform) { arr.push([calculatedTransform]); }

            const calculatedAttributes = calculateAttributes(requestObject);
            if (calculatedAttributes) { arr.push([calculatedAttributes]); }


            // add objects to objects array in player.js. Needed for reseting
            addObjects(el.objects[i].object);
        }
        animate(
            el.speed ? el.speed : 1,
            el.delay ? el.delay : 0,
            arr)
        .then(() => { resolve(); });
    });
}

function dispatch(...threads) {
    return new Promise((resolve, reject) => {
        if (threads.length === 0) {
            reject(Error('Add objects to "step" function'));
        } else if (threads.length === 1) {
            calculate(threads[0]).then(() => { resolve(); });
        } else {
            const arr = [];

            for (let i = 0; i < threads.length; i += 1) {
                arr.push(calculate(threads[i]));
            }
            Promise.all(arr).then(() => { resolve(); });
        }
    });
}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIkQ6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvc2V0dGluZ3MuanMiLCJEOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2VuZ2luZS9hbmltYXRlLmpzIiwiRDovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy9jb250cm9sL2J1dHRvbnMuanMiLCJEOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2NvbnRyb2wvcGxheWVyLmpzIiwiRDovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy91dGlscy5qcyIsIkQ6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvZW5naW5lL2NhbGN1bGF0aW9ucy90cmFuc2Zvcm0uanMiLCJEOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2VuZ2luZS9jYWxjdWxhdGlvbnMvYXR0cmlidXRlLmpzIiwiRDovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy9lbmdpbmUvY2FsY3VsYXRlLmpzIiwiRDovZGV2L3N2Zy1zbGlkZS1zaG93L3NyYy9qcy9lbmdpbmUvZGlzcGF0Y2guanMiLCJEOi9kZXYvc3ZnLXNsaWRlLXNob3cvc3JjL2pzL2NsYXNzZXMvbWFpbi5qcyIsIkQ6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvY2xhc3Nlcy9zbGlkZS5qcyIsIkQ6L2Rldi9zdmctc2xpZGUtc2hvdy9zcmMvanMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgc2V0dGluZ3MgPSB7XHJcbiAgICBzdmc6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzdmcnKVswXSxcclxuICAgIHNwZWVkOiAwLjAyNSxcclxuICAgIGVhc2luZzogdCA9PiB0ICogdCAqICgzIC0gKDIgKiB0KSksXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBzZXR0aW5ncztcclxuIiwiaW1wb3J0IHNldHRpbmdzIGZyb20gJy4uL3NldHRpbmdzJztcclxuXHJcbmZ1bmN0aW9uIGFuaW1hdGVPYmplY3QoYXJyLCBlYXNlKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGFycltpXVswXShlYXNlKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB1cGRhdGVPYmplY3QoYXJyKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGFycltpXVsxXSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gYW5pbWF0ZShzLCBkLCBhcnIpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgIGxldCB0ID0gMDtcclxuICAgICAgICBsZXQgZWFzZTtcclxuICAgICAgICBjb25zdCBzcGVlZCA9IHNldHRpbmdzLnNwZWVkICogcyA+IDAgPyBzZXR0aW5ncy5zcGVlZCAqIHMgOiAwLjAyNTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcCgpIHtcclxuICAgICAgICAgICAgaWYgKHQgPCAxKSB7XHJcbiAgICAgICAgICAgICAgICB0ICs9IHNwZWVkO1xyXG4gICAgICAgICAgICAgICAgZWFzZSA9IHNldHRpbmdzLmVhc2luZyh0KTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZU9iamVjdChhcnJbaV0sIGVhc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2JqZWN0KGFycltpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoc3RlcCwgZCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgYW5pbWF0ZTtcclxuIiwiaW1wb3J0IHNldHRpbmdzIGZyb20gJy4uL3NldHRpbmdzJztcclxuXHJcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgQ3JlYXRlIGVsZW1lbnRzIG9mIGludGVyZmFjZVxyXG5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcbi8vIGRlY2xhcmUgdmFyaWFibGVzXHJcblxyXG5jb25zdCBpY29ucyA9IHtcclxuICAgIGdyb3VwOiBudWxsLFxyXG4gICAgcG9seWdvbjE6IG51bGwsXHJcbiAgICBwb2x5Z29uMjogbnVsbCxcclxuICAgIGFyYzE6IG51bGwsXHJcbiAgICBhcmMyOiBudWxsLFxyXG4gICAgcmVjdDogbnVsbCxcclxufTtcclxuXHJcbi8vIGNyZWF0ZSBpY29uc1xyXG5cclxuY29uc3QgeG1sbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xyXG5pY29ucy5ncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh4bWxucywgJ2cnKTtcclxuXHJcbmljb25zLmFyYzEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoeG1sbnMsICdwYXRoJyk7XHJcbmljb25zLmFyYzEuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCAnTTEwLDIwIEExMCwxMCAwIDAsMSAyMCwxMCcpO1xyXG5pY29ucy5ncm91cC5hcHBlbmRDaGlsZChpY29ucy5hcmMxKTtcclxuXHJcbmljb25zLmFyYzIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoeG1sbnMsICdwYXRoJyk7XHJcbmljb25zLmFyYzIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCAnTTMwLDIwIEExMCwxMCAwIDAsMSAyMCwzMCcpO1xyXG5pY29ucy5ncm91cC5hcHBlbmRDaGlsZChpY29ucy5hcmMyKTtcclxuXHJcbmljb25zLnBvbHlnb24xID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHhtbG5zLCAncG9seWdvbicpO1xyXG5pY29ucy5wb2x5Z29uMS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncG9pbnRzJywgJzEwLDEwIDEwLDMwIDIwLDI1IDIwLDE1Jyk7XHJcbmljb25zLmdyb3VwLmFwcGVuZENoaWxkKGljb25zLnBvbHlnb24xKTtcclxuXHJcbmljb25zLnBvbHlnb24yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHhtbG5zLCAncG9seWdvbicpO1xyXG5pY29ucy5wb2x5Z29uMi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncG9pbnRzJywgJzIwLDI1IDIwLDE1IDMwLDIwIDMwLDIwJyk7XHJcbmljb25zLmdyb3VwLmFwcGVuZENoaWxkKGljb25zLnBvbHlnb24yKTtcclxuXHJcbmljb25zLnJlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoeG1sbnMsICdyZWN0Jyk7XHJcbmljb25zLnJlY3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCAwKTtcclxuaWNvbnMucmVjdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIDApO1xyXG5pY29ucy5yZWN0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIDQwKTtcclxuaWNvbnMucmVjdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgNDApO1xyXG5pY29ucy5ncm91cC5hcHBlbmRDaGlsZChpY29ucy5yZWN0KTtcclxuXHJcbi8vIGFkZCBzdHlsZSB0byBpbnRlcmZhY2VcclxuXHJcbmNvbnN0IGNzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3R5bGUnKTtcclxuY3NzLnRleHRDb250ZW50ID0gJyNjb250cm9sID4gcmVjdCB7b3BhY2l0eTogMDsgY3Vyc29yOiBwb2ludGVyO30gI2NvbnRyb2wgPiBwYXRoIHtzdHJva2U6IzAwMDsgZmlsbDpub25lOyBzdHJva2Utd2lkdGg6IDJweDsgc3Ryb2tlLWRhc2hhcnJheTogMTZweDsgc3Ryb2tlLWRhc2hvZmZzZXQ6IDE2cHh9JztcclxuXHJcblxyXG5sZXQgZGVmcyA9IHNldHRpbmdzLnN2Zy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGVmcycpWzBdO1xyXG5pZiAoIWRlZnMpIHtcclxuICAgIGRlZnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkZWZzJyk7XHJcbiAgICBzZXR0aW5ncy5zdmcuaW5zZXJ0QmVmb3JlKGRlZnMsIHNldHRpbmdzLnN2Zy5maXJzdENoaWxkKTtcclxufVxyXG5kZWZzLmFwcGVuZENoaWxkKGNzcyk7XHJcblxyXG4vLyBzZXQgaW50ZXJmYWNlIHRvIGNvcnJlY3QgcG9zaXRpb25cclxuY29uc3Qgdmlld0JveCA9IHNldHRpbmdzLnN2Zy52aWV3Qm94LmJhc2VWYWw7XHJcbmNvbnN0IG1hdHJpeCA9IHNldHRpbmdzLnN2Zy5jcmVhdGVTVkdNYXRyaXgoKTtcclxubWF0cml4LmUgPSB2aWV3Qm94LnggKyAxMDtcclxubWF0cml4LmYgPSB2aWV3Qm94LnkgKyAodmlld0JveC5oZWlnaHQgLSA1MCk7XHJcbmljb25zLmdyb3VwLmlkID0gJ2NvbnRyb2wnO1xyXG5pY29ucy5ncm91cC50cmFuc2Zvcm0uYmFzZVZhbC5pbml0aWFsaXplKHNldHRpbmdzLnN2Zy5jcmVhdGVTVkdUcmFuc2Zvcm1Gcm9tTWF0cml4KG1hdHJpeCkpO1xyXG5cclxuXHJcbi8vIGFkZCBpbnRlcmZhY2UgdG8gRE9NXHJcblxyXG5zZXR0aW5ncy5zdmcuYXBwZW5kQ2hpbGQoaWNvbnMuZ3JvdXApO1xyXG5cclxuXHJcbi8vIGFkZCBldmVudCBsaXN0ZW5lcnMgdG8gZWxlbWVudHMgb2YgaW50ZXJmYWNlLCBhbmQgc2V0IGV2ZW50IHByb3BhZ2F0aW9uXHJcblxyXG5jb25zdCBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG5ldmVudC5pbml0RXZlbnQoJ2J1dHRvbi1jbGljaycsIHRydWUsIHRydWUpO1xyXG5pY29ucy5yZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyBzZXR0aW5ncy5zdmcuZGlzcGF0Y2hFdmVudChldmVudCk7IH0pO1xyXG5cclxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlcmZhY2UgYW5pbWF0aW9uc1xyXG5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuXHJcbi8vIGFuaW1hdGlvbiAtIHBsYXkgLT4gcGF1c2VcclxuXHJcbmZ1bmN0aW9uIGFuaW1hdGVQbGF5VG9QYXVzZSgpIHtcclxuICAgIGxldCBzdGVwcyA9IDE7XHJcblxyXG4gICAgZnVuY3Rpb24gYW5pbWF0ZSgpIHtcclxuICAgICAgICBpZiAoc3RlcHMgPD0gMTApIHtcclxuICAgICAgICAgICAgaWNvbnMucG9seWdvbjEuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBgXHJcbiAgICAgICAgICAgIDEwLDEwIFxyXG4gICAgICAgICAgICAxMCwzMCBcclxuICAgICAgICAgICAgJHsyMCAtIChzdGVwcyAvIDUpID4gMTggPyAyMCAtIChzdGVwcyAvIDUpIDogMTh9LCR7MjUgKyAoc3RlcHMgLyAyKSA8IDMwID8gMjUgKyAoc3RlcHMgLyAyKSA6IDMwfSBcclxuICAgICAgICAgICAgJHsyMCAtIChzdGVwcyAvIDUpID4gMTggPyAyMCAtIChzdGVwcyAvIDUpIDogMTh9LCR7MTUgLSAoc3RlcHMgLyAyKSA+IDEwID8gMTUgLSAoc3RlcHMgLyAyKSA6IDEwfVxyXG4gICAgICAgICAgICBgKTtcclxuICAgICAgICAgICAgaWNvbnMucG9seWdvbjIuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBgXHJcbiAgICAgICAgICAgICR7MjAgKyAoc3RlcHMgLyA1KSA8IDIyID8gMjAgKyAoc3RlcHMgLyA1KSA6IDIyfSwkezE1IC0gKHN0ZXBzIC8gMikgPiAxMCA/IDE1IC0gKHN0ZXBzIC8gMikgOiAxMH0gXHJcbiAgICAgICAgICAgICR7MjAgKyAoc3RlcHMgLyA1KSA8IDIyID8gMjAgKyAoc3RlcHMgLyA1KSA6IDIyfSwgJHsyNSArIChzdGVwcyAvIDIpIDwgMzAgPyAyNSArIChzdGVwcyAvIDIpIDogMzB9IFxyXG4gICAgICAgICAgICAzMCwkezIwICsgc3RlcHMgPCAzMCA/IDIwICsgc3RlcHMgOiAzMH0gXHJcbiAgICAgICAgICAgIDMwLCR7MjAgLSBzdGVwcyA+IDEwID8gMjAgLSBzdGVwcyA6IDEwfVxyXG4gICAgICAgICAgICBgKTtcclxuICAgICAgICAgICAgc3RlcHMgKz0gMTtcclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhbmltYXRlKCk7XHJcbn1cclxuXHJcbi8vIGFuaW1hdGlvbiAtIHBhdXNlIC0+IHBsYXlcclxuXHJcbmZ1bmN0aW9uIGFuaW1hdGVQYXVzZVRvUGxheSgpIHtcclxuICAgIGxldCBzdGVwcyA9IDE7XHJcblxyXG4gICAgZnVuY3Rpb24gYW5pbWF0ZSgpIHtcclxuICAgICAgICBpZiAoc3RlcHMgPD0gMTApIHtcclxuICAgICAgICAgICAgaWNvbnMucG9seWdvbjEuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBgXHJcbiAgICAgICAgICAgICAgICAxMCwxMCBcclxuICAgICAgICAgICAgICAgIDEwLDMwIFxyXG4gICAgICAgICAgICAgICAgJHsxOCArIChzdGVwcyAvIDUpIDwgMjAgPyAxOCArIChzdGVwcyAvIDUpIDogMjB9LCR7MzAgLSAoc3RlcHMgLyAyKSA+IDI1ID8gMzAgLSAoc3RlcHMgLyAyKSA6IDI1fSBcclxuICAgICAgICAgICAgICAgICR7MTggKyAoc3RlcHMgLyA1KSA8IDIwID8gMTggKyAoc3RlcHMgLyA1KSA6IDIwfSwkezEwICsgKHN0ZXBzIC8gMikgPCAxNSA/IDEwICsgKHN0ZXBzIC8gMikgOiAxNX1cclxuICAgICAgICAgICAgYCk7XHJcbiAgICAgICAgICAgIGljb25zLnBvbHlnb24yLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgYFxyXG4gICAgICAgICAgICAgICAgJHsyMiAtIChzdGVwcyAvIDUpID4gMjAgPyAyMiAtIChzdGVwcyAvIDUpIDogMjB9LCR7MTAgKyAoc3RlcHMgLyAyKSA8IDE1ID8gMTAgKyAoc3RlcHMgLyAyKSA6IDE1fSBcclxuICAgICAgICAgICAgICAgICR7MjIgLSAoc3RlcHMgLyA1KSA+IDIwID8gMjIgLSAoc3RlcHMgLyA1KSA6IDIwfSwkezMwIC0gKHN0ZXBzIC8gMikgPiAyNSA/IDMwIC0gKHN0ZXBzIC8gMikgOiAyNX0gXHJcbiAgICAgICAgICAgICAgICAzMCwkezMwIC0gKHN0ZXBzID4gMjApID8gMzAgLSBzdGVwcyA6IDIwfSBcclxuICAgICAgICAgICAgICAgIDMwLCR7MTAgKyAoc3RlcHMgPCAyMCkgPyAxMCArIHN0ZXBzIDogMjB9XHJcbiAgICAgICAgICAgIGApO1xyXG4gICAgICAgICAgICBzdGVwcyArPSAxO1xyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFuaW1hdGUoKTtcclxufVxyXG5cclxuLy8gYW5pbWF0aW9uIC0gcGF1c2UgLT4gcmVsb2FkXHJcblxyXG5mdW5jdGlvbiBhbmltYXRlUGF1c2VUb1JlbG9hZCgpIHtcclxuICAgIGxldCBzdGVwcyA9IDE7XHJcbiAgICBsZXQgb2Zmc2V0ID0gMTY7XHJcblxyXG4gICAgZnVuY3Rpb24gYW5pbWF0ZUFyYygpIHtcclxuICAgICAgICBpZiAob2Zmc2V0ID4gMCkge1xyXG4gICAgICAgICAgICBvZmZzZXQgLT0gMTtcclxuICAgICAgICAgICAgaWNvbnMuYXJjMS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYHN0cm9rZS1kYXNob2Zmc2V0OiR7b2Zmc2V0fXB4YCk7XHJcbiAgICAgICAgICAgIGljb25zLmFyYzIuc2V0QXR0cmlidXRlKCdzdHlsZScsIGBzdHJva2UtZGFzaG9mZnNldDoke29mZnNldH1weGApO1xyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGVBcmMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGljb25zLmFyYzEuc2V0QXR0cmlidXRlKCdzdHlsZScsICdzdHJva2UtZGFzaG9mZnNldDowJyk7XHJcbiAgICAgICAgICAgIGljb25zLmFyYzIuc2V0QXR0cmlidXRlKCdzdHlsZScsICdzdHJva2UtZGFzaG9mZnNldDowJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFuaW1hdGUoKSB7XHJcbiAgICAgICAgaWYgKHN0ZXBzIDw9IDEwKSB7XHJcbiAgICAgICAgICAgIGljb25zLnBvbHlnb24xLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgYFxyXG4gICAgICAgICAgICAgICAgJHsxMCAtIChzdGVwcyAqIDAuNCkgPiA2ID8gMTAgLSAoc3RlcHMgKiAwLjQpIDogNn0sJHsxMCArIHN0ZXBzIDwgMjAgPyAxMCArIHN0ZXBzIDogMjB9IFxyXG4gICAgICAgICAgICAgICAgMTAsJHszMCAtIChzdGVwcyAqIDAuNCkgPiAyNiA/IDMwIC0gKHN0ZXBzICogMC40KSA6IDI2fSBcclxuICAgICAgICAgICAgICAgICR7MTggLSAoc3RlcHMgKiAwLjgpID4gMTAgPyAxOCAtIChzdGVwcyAqIDAuOCkgOiAxMH0sJHszMCAtIChzdGVwcyAqIDAuNCkgPiAyNiA/IDMwIC0gKHN0ZXBzICogMC40KSA6IDI2fSBcclxuICAgICAgICAgICAgICAgICR7MTggLSAoc3RlcHMgKiAwLjQpID4gMTQgPyAxOCAtIChzdGVwcyAqIDAuNCkgOiAxNH0sJHsxMCArIHN0ZXBzIDwgMjAgPyAxMCArIHN0ZXBzIDogMjB9XHJcbiAgICAgICAgICAgIGApO1xyXG4gICAgICAgICAgICBpY29ucy5wb2x5Z29uMi5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsIGBcclxuICAgICAgICAgICAgICAgICR7MjIgKyAoc3RlcHMgKiAwLjgpIDwgMzAgPyAyMiArIChzdGVwcyAqIDAuOCkgOiAzMH0sJHsxMCArIChzdGVwcyAqIDAuNCkgPCAxNCA/IDEwICsgKHN0ZXBzICogMC40KSA6IDE0fSBcclxuICAgICAgICAgICAgICAgICR7MjIgKyAoc3RlcHMgKiAwLjQpIDwgMjYgPyAyMiArIChzdGVwcyAqIDAuNCkgOiAyNn0sJHszMCAtIHN0ZXBzID4gMjAgPyAzMCAtIHN0ZXBzIDogMjB9IFxyXG4gICAgICAgICAgICAgICAgICR7MzAgKyAoc3RlcHMgKiAwLjQpIDwgMzQgPyAzMCArIChzdGVwcyAqIDAuNCkgOiAzNH0sJHszMCAtIHN0ZXBzID4gMjAgPyAzMCAtIHN0ZXBzIDogMjB9IFxyXG4gICAgICAgICAgICAgICAgMzAsJHsxMCArIChzdGVwcyAqIDAuNCkgPCAxNCA/IDEwICsgKHN0ZXBzICogMC40KSA6IDE0fVxyXG4gICAgICAgICAgICBgKTtcclxuICAgICAgICAgICAgc3RlcHMgKz0gMTtcclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhbmltYXRlQXJjKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYW5pbWF0ZSgpO1xyXG59XHJcblxyXG4vLyBhbmltYXRpb24gLSByZWxvYWQgLT4gcGxheVxyXG5cclxuZnVuY3Rpb24gYW5pbWF0ZVJlbG9hZFRvUGxheSgpIHtcclxuICAgIGxldCBzdGVwcyA9IDE7XHJcbiAgICBsZXQgb2Zmc2V0ID0gMDtcclxuXHJcbiAgICBmdW5jdGlvbiBhbmltYXRlKCkge1xyXG4gICAgICAgIGlmIChzdGVwcyA8PSAxMCkge1xyXG4gICAgICAgICAgICBpY29ucy5wb2x5Z29uMS5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsIGBcclxuICAgICAgICAgICAgICAgICR7NiArIChzdGVwcyAqIDAuNCkgPCAxMCA/IDYgKyAoc3RlcHMgKiAwLjQpIDogMTB9LCR7MjAgLSBzdGVwcyA+IDEwID8gMjAgLSBzdGVwcyA6IDEwfSBcclxuICAgICAgICAgICAgICAgIDEwLCR7MjYgKyAoc3RlcHMgKiAwLjQpIDwgMzAgPyAyNiArIChzdGVwcyAqIDAuNCkgOiAzMH0gXHJcbiAgICAgICAgICAgICAgICAkezEwICsgc3RlcHMgPCAyMCA/IDEwICsgc3RlcHMgOiAyMH0sJHsyNiAtIChzdGVwcyAqIDAuMSkgPiAyNSA/IDI2IC0gKHN0ZXBzICogMC4xKSA6IDI1fSBcclxuICAgICAgICAgICAgICAgICR7MTQgKyAoc3RlcHMgKiAwLjYpIDwgMjAgPyAxNCArIChzdGVwcyAqIDAuNikgOiAyMH0sJHsyMCAtIChzdGVwcyAqIDAuNSkgPiAxNSA/IDIwIC0gKHN0ZXBzICogMC41KSA6IDE1fVxyXG4gICAgICAgICAgICBgKTtcclxuICAgICAgICAgICAgaWNvbnMucG9seWdvbjIuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBgXHJcbiAgICAgICAgICAgICAgICAkezMwIC0gc3RlcHMgPiAyMCA/IDMwIC0gc3RlcHMgOiAyMH0sJHsxNCArIChzdGVwcyAqIDAuMSkgPCAxNSA/IDE0ICsgKHN0ZXBzICogMC4xKSA6IDE1fSBcclxuICAgICAgICAgICAgICAgICR7MjYgLSAoc3RlcHMgKiAwLjYpID4gMjAgPyAyNiAtIChzdGVwcyAqIDAuNikgOiAyMH0sJHsyMCArIChzdGVwcyAqIDAuNSkgPCAyNSA/IDIwICsgKHN0ZXBzICogMC41KSA6IDI1fSBcclxuICAgICAgICAgICAgICAgICR7MzQgLSAoc3RlcHMgKiAwLjQpID4gMzAgPyAzNCAtIChzdGVwcyAqIDAuNCkgOiAzMH0sMjAgXHJcbiAgICAgICAgICAgICAgICAzMCwkezE0ICsgKHN0ZXBzICogMC42KSA8IDIwID8gMTQgKyAoc3RlcHMgKiAwLjYpIDogMjB9XHJcbiAgICAgICAgICAgIGApO1xyXG4gICAgICAgICAgICBzdGVwcyArPSAxO1xyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhbmltYXRlQXJjKCkge1xyXG4gICAgICAgIGlmIChvZmZzZXQgPCAxNikge1xyXG4gICAgICAgICAgICBvZmZzZXQgKz0gMTtcclxuICAgICAgICAgICAgaWNvbnMuYXJjMS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYHN0cm9rZS1kYXNob2Zmc2V0OiR7b2Zmc2V0fXB4YCk7XHJcbiAgICAgICAgICAgIGljb25zLmFyYzIuc2V0QXR0cmlidXRlKCdzdHlsZScsIGBzdHJva2UtZGFzaG9mZnNldDoke29mZnNldH1gKTtcclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlQXJjKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpY29ucy5hcmMxLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcclxuICAgICAgICAgICAgaWNvbnMuYXJjMi5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XHJcbiAgICAgICAgICAgIGFuaW1hdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhbmltYXRlQXJjKCk7XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBhbmltYXRlUGxheVRvUGF1c2UgYXMgcGxheVRvUGF1c2UsXHJcbiAgICBhbmltYXRlUGF1c2VUb1BsYXkgYXMgcGF1c2VUb1BsYXksXHJcbiAgICBhbmltYXRlUGF1c2VUb1JlbG9hZCBhcyBwYXVzZVRvUmVsb2FkLFxyXG4gICAgYW5pbWF0ZVJlbG9hZFRvUGxheSBhcyByZWxvYWRUb1BsYXksXHJcbn07XHJcbiIsImltcG9ydCB7IHBsYXlUb1BhdXNlLCBwYXVzZVRvUGxheSwgcGF1c2VUb1JlbG9hZCwgcmVsb2FkVG9QbGF5IH0gZnJvbSAnLi9idXR0b25zJztcclxuXHJcbmNvbnN0IHNsaWRlcyA9IFtdO1xyXG5jb25zdCBvYmplY3RMaXN0ID0gW107XHJcbmxldCBjdXJyZW50U2xpZGUgPSAwO1xyXG5sZXQgc3RhdHVzID0gJ25vdCBzdGFydGVkJztcclxuXHJcbmZ1bmN0aW9uIHN0YXJ0KCkge1xyXG4gICAgY3VycmVudFNsaWRlID0gMDtcclxuICAgIHNsaWRlc1tjdXJyZW50U2xpZGVdLnBsYXkoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVzZXQoKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iamVjdExpc3QubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICBvYmplY3RMaXN0W2ldLnJlc2V0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc3VtZSgpIHtcclxuICAgIGlmIChjdXJyZW50U2xpZGUgKyAxID49IHNsaWRlcy5sZW5ndGgpIHtcclxuICAgICAgICBzdGF0dXMgPSAnZmluaXNoZWQnO1xyXG4gICAgICAgIHBhdXNlVG9SZWxvYWQoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY3VycmVudFNsaWRlICs9IDE7XHJcbiAgICAgICAgc2xpZGVzW2N1cnJlbnRTbGlkZV0ucGxheSgpO1xyXG4gICAgICAgIHBsYXlUb1BhdXNlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbnRyb2xQbGF5ZXIoKSB7XHJcbiAgICBpZiAoc2xpZGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gc2xpZGVzIHRvIGFuaW1hdGUuIEFkZCBzbGlkZXMgdXNpbmcgXCJhZGRTbGlkZXNcIiBmdW5jdGlvbi4nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc3RhdHVzID09PSAnZmluaXNoZWQnKSB7XHJcbiAgICAgICAgc3RhdHVzID0gJ25vdCBzdGFydGVkJztcclxuICAgICAgICByZXNldCgpO1xyXG4gICAgICAgIHJlbG9hZFRvUGxheSgpO1xyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09ICdwbGF5aW5nJykge1xyXG4gICAgICAgIHN0YXR1cyA9ICdwYXVzZWQnO1xyXG4gICAgICAgIHBhdXNlVG9QbGF5KCk7XHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gJ3BhdXNlZCcpIHtcclxuICAgICAgICBzdGF0dXMgPSAncGxheWluZyc7XHJcbiAgICAgICAgcmVzdW1lKCk7XHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gJ25vdCBzdGFydGVkJykge1xyXG4gICAgICAgIHN0YXR1cyA9ICdwbGF5aW5nJztcclxuICAgICAgICBzdGFydCgpO1xyXG4gICAgICAgIHBsYXlUb1BhdXNlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5leHQoKSB7XHJcbiAgICBpZiAoY3VycmVudFNsaWRlICsgMSA+PSBzbGlkZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgc3RhdHVzID0gJ2ZpbmlzaGVkJztcclxuICAgICAgICBwYXVzZVRvUmVsb2FkKCk7XHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyAhPT0gJ3BhdXNlZCcpIHtcclxuICAgICAgICBjdXJyZW50U2xpZGUgKz0gMTtcclxuICAgICAgICBzbGlkZXNbY3VycmVudFNsaWRlXS5wbGF5KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFNsaWRlcyguLi5zbGlkZSkge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZS5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIHNsaWRlcy5wdXNoKHNsaWRlW2ldKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBhZGRPYmplY3RzKG9iamVjdCkge1xyXG4gICAgaWYgKG9iamVjdExpc3QuaW5kZXhPZihvYmplY3QpID09PSAtMSkge1xyXG4gICAgICAgIG9iamVjdExpc3QucHVzaChvYmplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uLWNsaWNrJywgY29udHJvbFBsYXllciwgZmFsc2UpO1xyXG5cclxuZXhwb3J0IHsgYWRkU2xpZGVzLCBhZGRPYmplY3RzLCBuZXh0IH07XHJcblxyXG4iLCJjb25zdCB1dGlscyA9IHtcclxuICAgIHVuZGVmOiBpdGVtID0+ICh0eXBlb2YgaXRlbSA9PT0gJ3VuZGVmaW5lZCcpLFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgdXRpbHM7XHJcbiIsImltcG9ydCB1dGlscyBmcm9tICcuLy4uLy4uL3V0aWxzJztcclxuXHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZVRyYW5zZm9ybShlbCkge1xyXG4gICAgY29uc3QgdGFyZ2V0VHJhbnNmb3JtID0gZWwudHJhbnNmb3JtO1xyXG5cclxuICAgIGlmICghdXRpbHMudW5kZWYodGFyZ2V0VHJhbnNmb3JtKSkge1xyXG4gICAgICAgIGxldCBhbmltYXRlRnVuYztcclxuICAgICAgICBsZXQgdXBkYXRlRnVuYztcclxuICAgICAgICBjb25zdCBvYmplY3QgPSBlbC5vYmplY3Q7XHJcbiAgICAgICAgY29uc3Qgc3RhcnRpbmdUcmFuc2Zvcm0gPSBlbC5vYmplY3QudHI7XHJcblxyXG4gICAgICAgIGNvbnN0IGRlbHRhU2NhbGUgPSB0YXJnZXRUcmFuc2Zvcm0uc2NhbGUgLSBzdGFydGluZ1RyYW5zZm9ybS5zY2FsZTtcclxuICAgICAgICBjb25zdCBkZWx0YVJvdGF0ZSA9IHRhcmdldFRyYW5zZm9ybS5yb3RhdGUgLSBzdGFydGluZ1RyYW5zZm9ybS5yb3RhdGU7XHJcbiAgICAgICAgY29uc3QgZGVsdGEwID0gdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVswXSAtIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZVswXTtcclxuICAgICAgICBjb25zdCBkZWx0YTEgPSB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlWzFdIC0gc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlWzFdO1xyXG5cclxuICAgICAgICAvKiAtLS0tLS0tLSB0cmFuc2Zvcm1zIHdpdGhvdXQgdHJhbnNsYXRpb24gLS0tLS0tLS0gKi9cclxuICAgICAgICBpZiAodXRpbHMudW5kZWYodGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZSkpIHtcclxuICAgICAgICAgICAgaWYgKHV0aWxzLnVuZGVmKHRhcmdldFRyYW5zZm9ybS5yb3RhdGUpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBvbmx5IHNjYWxpbmdcclxuICAgICAgICAgICAgICAgIGFuaW1hdGVGdW5jID0gKHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3Quc2NhbGUoc3RhcnRpbmdUcmFuc2Zvcm0uc2NhbGUgKyAoZGVsdGFTY2FsZSAqIHQpKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVGdW5jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5zY2FsZSh0YXJnZXRUcmFuc2Zvcm0uc2NhbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnNjYWxlID0gdGFyZ2V0VHJhbnNmb3JtLnNjYWxlO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh1dGlscy51bmRlZih0YXJnZXRUcmFuc2Zvcm0uc2NhbGUpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBvbmx5IHJvdGF0aW9uXHJcbiAgICAgICAgICAgICAgICBhbmltYXRlRnVuYyA9ICh0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnJvdGF0ZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0ucm90YXRlICsgKGRlbHRhUm90YXRlICogdCkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUZ1bmMgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnJvdGF0ZSh0YXJnZXRUcmFuc2Zvcm0ucm90YXRlKTtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5yb3RhdGUgPSB0YXJnZXRUcmFuc2Zvcm0ucm90YXRlO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIHNjYWxpbmcgYW5kIHJvdGF0aW5nXHJcbiAgICAgICAgICAgICAgICBhbmltYXRlRnVuYyA9ICh0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnNjYWxlQW5kUm90YXRlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5zY2FsZSArIChkZWx0YVNjYWxlICogdCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnJvdGF0ZSArIChkZWx0YVJvdGF0ZSAqIHQpKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVGdW5jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5zY2FsZUFuZFJvdGF0ZSh0YXJnZXRUcmFuc2Zvcm0uc2NhbGUsIHRhcmdldFRyYW5zZm9ybS5yb3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnNjYWxlID0gdGFyZ2V0VHJhbnNmb3JtLnNjYWxlO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnJvdGF0ZSA9IHRhcmdldFRyYW5zZm9ybS5yb3RhdGU7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgLyogLS0tLS0tLS0gdHJhbnNmb3JtcyB3aXRoIHRyYW5zbGF0aW9uIC0tLS0tLS0tICovXHJcbiAgICAgICAgfSBlbHNlIGlmICh1dGlscy51bmRlZih0YXJnZXRUcmFuc2Zvcm0uc2NhbGUpICYmIHV0aWxzLnVuZGVmKHRhcmdldFRyYW5zZm9ybS5yb3RhdGUpKSB7XHJcbiAgICAgICAgICAgIC8vIG9ubHkgdHJhbnNsYXRpb25cclxuICAgICAgICAgICAgYW5pbWF0ZUZ1bmMgPSAodCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LnRyYW5zbGF0ZShcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGVbMF0gKyAoZGVsdGEwICogdCksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlWzFdICsgKGRlbHRhMSAqIHQpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdXBkYXRlRnVuYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdC50cmFuc2xhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVswXSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlWzFdKTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZSA9IHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIGlmICh1dGlscy51bmRlZih0YXJnZXRUcmFuc2Zvcm0ucm90YXRlKSkge1xyXG4gICAgICAgICAgICAvLyBzY2FsZSBhbmQgdHJhbnNsYXRpb25cclxuICAgICAgICAgICAgYW5pbWF0ZUZ1bmMgPSAodCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LnNjYWxlQW5kVHJhbnNsYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnNjYWxlICsgKGRlbHRhU2NhbGUgKiB0KSxcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGVbMF0gKyAoZGVsdGEwICogdCksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlWzFdICsgKGRlbHRhMSAqIHQpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdXBkYXRlRnVuYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdC5zY2FsZUFuZFRyYW5zbGF0ZShcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0uc2NhbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVswXSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlWzFdKTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnNjYWxlID0gdGFyZ2V0VHJhbnNmb3JtLnNjYWxlO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlID0gdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0YXJnZXRUcmFuc2Zvcm0uc2NhbGUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIC8vIHJvdGF0aW9uIGFuZCB0cmFuc2xhdGlvblxyXG4gICAgICAgICAgICBhbmltYXRlRnVuYyA9ICh0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3Qucm90YXRlQW5kVHJhbnNsYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnJvdGF0ZSArIChkZWx0YVJvdGF0ZSAqIHQpLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZVswXSArIChkZWx0YTAgKiB0KSxcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS50cmFuc2xhdGVbMV0gKyAoZGVsdGExICogdCkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB1cGRhdGVGdW5jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LnJvdGF0ZUFuZFRyYW5zbGF0ZShcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0ucm90YXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGVbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVsxXSk7XHJcbiAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5yb3RhdGUgPSB0YXJnZXRUcmFuc2Zvcm0ucm90YXRlO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlID0gdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBzY2FsZSwgcm90YXRpb24gYW5kIHRyYW5zbGF0aW9uXHJcbiAgICAgICAgICAgIGFuaW1hdGVGdW5jID0gKHQpID0+IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdC5zY2FsZUFuZFJvdGF0ZUFuZFRyYW5zbGF0ZShcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1RyYW5zZm9ybS5zY2FsZSArIChkZWx0YVNjYWxlICogdCksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0ucm90YXRlICsgKGRlbHRhUm90YXRlICogdCksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0udHJhbnNsYXRlWzBdICsgKGRlbHRhMCAqIHQpLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZVsxXSArIChkZWx0YTEgKiB0KSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHVwZGF0ZUZ1bmMgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3Quc2NhbGVBbmRSb3RhdGVBbmRUcmFuc2xhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnNjYWxlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRyYW5zZm9ybS5yb3RhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVswXSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlWzFdKTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnNjYWxlID0gdGFyZ2V0VHJhbnNmb3JtLnNjYWxlO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRpbmdUcmFuc2Zvcm0ucm90YXRlID0gdGFyZ2V0VHJhbnNmb3JtLnJvdGF0ZTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nVHJhbnNmb3JtLnRyYW5zbGF0ZSA9IHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gW2FuaW1hdGVGdW5jLCB1cGRhdGVGdW5jXTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2FsY3VsYXRlVHJhbnNmb3JtO1xyXG4iLCJpbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi8uLi91dGlscyc7XHJcblxyXG5mdW5jdGlvbiBjYWxjdWxhdGVBdHRyaWJ1dGVzKGVsKSB7XHJcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gZWwuYXR0cmlidXRlcztcclxuICAgIGNvbnN0IHRhYmxlID0gW107XHJcblxyXG4gICAgZnVuY3Rpb24gYW5pbWF0ZUZ1bmModCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFibGUubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgZWwub2JqZWN0Lm9iai5zZXRBdHRyaWJ1dGUodGFibGVbaV1bMF0sIHRhYmxlW2ldWzFdICsgKCh0YWJsZVtpXVsyXSAtIHRhYmxlW2ldWzFdKSAqIHQpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlRnVuYygpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhYmxlLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGVsLm9iamVjdC5vYmouc2V0QXR0cmlidXRlKHRhYmxlW2ldWzBdLCB0YWJsZVtpXVsyXSk7XHJcbiAgICAgICAgICAgIGVsLm9iamVjdC52YXJpYWJsZXMuc2V0KHRhYmxlW2ldWzBdLCB0YWJsZVtpXVsyXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghdXRpbHMudW5kZWYoYXR0cmlidXRlcykgJiYgYXR0cmlidXRlcy5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgY29uc3QgbmFtZSA9IGF0dHJpYnV0ZXNbaV0ubmFtZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGZyb20gPSB1dGlscy51bmRlZihhdHRyaWJ1dGVzW2ldLmZyb20pID8gZWwub2JqZWN0LnZhcmlhYmxlcy5nZXQobmFtZSkgOiBhdHRyaWJ1dGVzW2ldLmZyb207XHJcbiAgICAgICAgICAgIGlmICh1dGlscy51bmRlZihmcm9tKSkgeyB0aHJvdyBuZXcgRXJyb3IoYE5vIFwiZnJvbVwiIHZhbHVlLCBmb3IgJHtuYW1lfWApOyB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0byA9IGF0dHJpYnV0ZXNbaV0udG87XHJcblxyXG4gICAgICAgICAgICB0YWJsZS5wdXNoKFtuYW1lLCBmcm9tLCB0b10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW2FuaW1hdGVGdW5jLCB1cGRhdGVGdW5jXTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2FsY3VsYXRlQXR0cmlidXRlcztcclxuIiwiaW1wb3J0IGFuaW1hdGUgZnJvbSAnLi9hbmltYXRlJztcclxuaW1wb3J0IHsgYWRkT2JqZWN0cyB9IGZyb20gJy4uL2NvbnRyb2wvcGxheWVyJztcclxuaW1wb3J0IGNhbGN1bGF0ZVRyYW5zZm9ybSBmcm9tICcuL2NhbGN1bGF0aW9ucy90cmFuc2Zvcm0nO1xyXG5pbXBvcnQgY2FsY3VsYXRlQXR0cmlidXRlcyBmcm9tICcuL2NhbGN1bGF0aW9ucy9hdHRyaWJ1dGUnO1xyXG5cclxuZnVuY3Rpb24gY2FsY3VsYXRlKGVsKSB7XHJcbiAgICBjb25zdCBhcnIgPSBbXTtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWwub2JqZWN0cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0T2JqZWN0ID0gZWwub2JqZWN0c1tpXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGN1bGF0ZWRUcmFuc2Zvcm0gPSBjYWxjdWxhdGVUcmFuc2Zvcm0ocmVxdWVzdE9iamVjdCk7XHJcbiAgICAgICAgICAgIGlmIChjYWxjdWxhdGVkVHJhbnNmb3JtKSB7IGFyci5wdXNoKFtjYWxjdWxhdGVkVHJhbnNmb3JtXSk7IH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGN1bGF0ZWRBdHRyaWJ1dGVzID0gY2FsY3VsYXRlQXR0cmlidXRlcyhyZXF1ZXN0T2JqZWN0KTtcclxuICAgICAgICAgICAgaWYgKGNhbGN1bGF0ZWRBdHRyaWJ1dGVzKSB7IGFyci5wdXNoKFtjYWxjdWxhdGVkQXR0cmlidXRlc10pOyB9XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gYWRkIG9iamVjdHMgdG8gb2JqZWN0cyBhcnJheSBpbiBwbGF5ZXIuanMuIE5lZWRlZCBmb3IgcmVzZXRpbmdcclxuICAgICAgICAgICAgYWRkT2JqZWN0cyhlbC5vYmplY3RzW2ldLm9iamVjdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFuaW1hdGUoXHJcbiAgICAgICAgICAgIGVsLnNwZWVkID8gZWwuc3BlZWQgOiAxLFxyXG4gICAgICAgICAgICBlbC5kZWxheSA/IGVsLmRlbGF5IDogMCxcclxuICAgICAgICAgICAgYXJyKVxyXG4gICAgICAgIC50aGVuKCgpID0+IHsgcmVzb2x2ZSgpOyB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjYWxjdWxhdGU7XHJcbiIsImltcG9ydCBjYWxjdWxhdGUgZnJvbSAnLi9jYWxjdWxhdGUnO1xyXG5cclxuZnVuY3Rpb24gZGlzcGF0Y2goLi4udGhyZWFkcykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBpZiAodGhyZWFkcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmVqZWN0KEVycm9yKCdBZGQgb2JqZWN0cyB0byBcInN0ZXBcIiBmdW5jdGlvbicpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRocmVhZHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIGNhbGN1bGF0ZSh0aHJlYWRzWzBdKS50aGVuKCgpID0+IHsgcmVzb2x2ZSgpOyB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBhcnIgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhyZWFkcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgYXJyLnB1c2goY2FsY3VsYXRlKHRocmVhZHNbaV0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBQcm9taXNlLmFsbChhcnIpLnRoZW4oKCkgPT4geyByZXNvbHZlKCk7IH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbmNvbnN0IHN0ZXAgPSBkaXNwYXRjaDtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBzdGVwO1xyXG4iLCJpbXBvcnQgc2V0dGluZ3MgZnJvbSAnLi4vc2V0dGluZ3MnOyAvLyBpbXBvcnQgc2V0dGluZ3MgZm9yIGdldHRpbmcgYWNjZXNzIHRvIFNWRyBlbGVtZW50XHJcbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscyc7IC8vIGltcG9ydCB1dGlscyBmb3IgdXRpbHMudW5kZWZcclxuXHJcbmNsYXNzIE9iaiB7XHJcbi8qXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tQ09OU1RSVUNUT1ItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuKi9cclxuICAgIGNvbnN0cnVjdG9yKG9iaiwgdHJhbnNmb3JtID0geyB0cmFuc2xhdGU6IFswLCAwXSwgcm90YXRlOiAwLCBzY2FsZTogMSB9KSB7XHJcbiAgICAgICAgLy8gYWNjZXNzIHRvIERPTSBvYmplY3RcclxuICAgICAgICB0aGlzLm9iaiA9IG9iajtcclxuICAgICAgICAvLyBjcmVhdGUgemVybyBtYXRyaXhcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeCA9IHNldHRpbmdzLnN2Zy5jcmVhdGVTVkdNYXRyaXgoKTtcclxuICAgICAgICAvLyBzZXQgc3RhcnRpbmcgdmFyaWFibGVzLCBhbmQgZGVjbGFyZSB0aGlzLnN0YXJ0aW5nVmFyaWFibGVzIGFuZCB0aGlzLnZhcmlhYmxlc1xyXG4gICAgICAgIHRoaXMuc2V0U3RhcnRpbmdWYXJpYWJsZXModHJhbnNmb3JtKTtcclxuICAgICAgICAvLyBzZXQgaW5pdGlhbCBtYXRyaXhcclxuICAgICAgICB0aGlzLnNldEluaXRpYWxNYXRyaXgoKTtcclxuXHJcbiAgICAgICAgLyogLS0tLS0tLS0gc2hvcnRjdXRzIC0tLS0tLS0tICovXHJcblxyXG4gICAgICAgIC8vIHRvIG1hdHJpeCBpbnRlcmZhY2UgLT4gdGhpcy5TVkdUcmFuc2Zvcm1cclxuXHJcbiAgICAgICAgLy8gdG8gY3VycmVudCB0cmFuc2Zvcm1cclxuICAgICAgICB0aGlzLnRyID0gdGhpcy52YXJpYWJsZXMuZ2V0KCd0cmFuc2Zvcm0nKTtcclxuICAgIH1cclxuXHJcbi8qXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1JTklUSUFMSVpJTkcgTUVUSE9EUy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuKi9cclxuXHJcblxyXG4gICAgc2V0U3RhcnRpbmdWYXJpYWJsZXModHJhbnNmb3JtKSB7XHJcbiAgICAgICAgY29uc3QgbWFwID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5vYmouYXR0cmlidXRlcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vYmouYXR0cmlidXRlc1tpXS5zcGVjaWZpZWQgJiYgdGhpcy5vYmouYXR0cmlidXRlc1tpXS5uYW1lICE9PSAndHJhbnNmb3JtJykge1xyXG4gICAgICAgICAgICAgICAgbWFwLnNldCh0aGlzLm9iai5hdHRyaWJ1dGVzW2ldLm5hbWUsIHBhcnNlRmxvYXQodGhpcy5vYmouYXR0cmlidXRlc1tpXS52YWx1ZSkgfHwgdGhpcy5vYmouYXR0cmlidXRlc1tpXS52YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdGFydGluZ1ZhcmlhYmxlcyA9IG5ldyBNYXAobWFwKTtcclxuICAgICAgICB0aGlzLnZhcmlhYmxlcyA9IG5ldyBNYXAobWFwKTtcclxuXHJcbiAgICAgICAgLy8gcmVmZXJlbmNlIHNoaXRcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBbdGhpcy5zdGFydGluZ1ZhcmlhYmxlcywgdGhpcy52YXJpYWJsZXNdW2ldLnNldCgndHJhbnNmb3JtJywge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlOiB1dGlscy51bmRlZih0cmFuc2Zvcm0udHJhbnNsYXRlKSA/IFswLCAwXSA6IHRyYW5zZm9ybS50cmFuc2xhdGUsXHJcbiAgICAgICAgICAgICAgICBzY2FsZTogdXRpbHMudW5kZWYodHJhbnNmb3JtLnNjYWxlKSA/IDEgOiB0cmFuc2Zvcm0uc2NhbGUsXHJcbiAgICAgICAgICAgICAgICByb3RhdGU6IHV0aWxzLnVuZGVmKHRyYW5zZm9ybS5yb3RhdGUpID8gMCA6IHRyYW5zZm9ybS5yb3RhdGUsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRJbml0aWFsTWF0cml4KCkge1xyXG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IHRoaXMudmFyaWFibGVzLmdldCgndHJhbnNmb3JtJyk7XHJcbiAgICAgICAgdGhpcy5vYmoudHJhbnNmb3JtLmJhc2VWYWwuaW5pdGlhbGl6ZShzZXR0aW5ncy5zdmcuY3JlYXRlU1ZHVHJhbnNmb3JtRnJvbU1hdHJpeCh0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeCkpO1xyXG4gICAgICAgIHRoaXMuU1ZHVHJhbnNmb3JtID0gdGhpcy5vYmoudHJhbnNmb3JtLmJhc2VWYWwuZ2V0SXRlbSgwKTtcclxuICAgICAgICB0aGlzLnNjYWxlQW5kUm90YXRlQW5kVHJhbnNsYXRlKHRyYW5zZm9ybS5zY2FsZSwgdHJhbnNmb3JtLnJvdGF0ZSwgdHJhbnNmb3JtLnRyYW5zbGF0ZVswXSwgdHJhbnNmb3JtLnRyYW5zbGF0ZVsxXSk7XHJcbiAgICB9XHJcblxyXG4vKlxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tT1RIRVItTUVUSE9EUy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiovXHJcblxyXG4gICAgc2V0TWF0cml4KG1hdHJpeCkgeyB0aGlzLlNWR1RyYW5zZm9ybS5zZXRNYXRyaXgobWF0cml4KTsgfVxyXG5cclxuICAgIHJlc2V0KCkge1xyXG4gICAgICAgIC8vIHJlc2V0IHZhcmlhYmxlc1xyXG4gICAgICAgIHRoaXMudmFyaWFibGVzID0gbmV3IE1hcCh0aGlzLnN0YXJ0aW5nVmFyaWFibGVzKTtcclxuICAgICAgICAvLyByZWZlcmVuY2Ugc2hpdFxyXG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IHRoaXMuc3RhcnRpbmdWYXJpYWJsZXMuZ2V0KCd0cmFuc2Zvcm0nKTtcclxuICAgICAgICB0aGlzLnZhcmlhYmxlcy5zZXQoJ3RyYW5zZm9ybScsIHtcclxuICAgICAgICAgICAgdHJhbnNsYXRlOiB0cmFuc2Zvcm0udHJhbnNsYXRlLFxyXG4gICAgICAgICAgICBzY2FsZTogdHJhbnNmb3JtLnNjYWxlLFxyXG4gICAgICAgICAgICByb3RhdGU6IHRyYW5zZm9ybS5yb3RhdGUsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy50ciA9IHRoaXMudmFyaWFibGVzLmdldCgndHJhbnNmb3JtJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IG9iaiA9IHRoaXMub2JqO1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgYWxsIGF0dHJpYnV0ZXMgZnJvbSBlbGVtZW50IERPTVxyXG4gICAgICAgIGZvciAobGV0IGkgPSBvYmouYXR0cmlidXRlcy5sZW5ndGggLSAxOyBpID49IDA7IGkgLT0gMSkge1xyXG4gICAgICAgICAgICBpZiAob2JqLmF0dHJpYnV0ZXNbaV0ubmFtZSAhPT0gJ3RyYW5zZm9ybScpIHtcclxuICAgICAgICAgICAgICAgIG9iai5yZW1vdmVBdHRyaWJ1dGUob2JqLmF0dHJpYnV0ZXNbaV0ubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gYWRkIGFsbCBzdGFydGluZyBhdHRyaWJ1dGVzXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkKHZhbHVlLCBrZXkpIHtcclxuICAgICAgICAgICAgaWYgKGtleSAhPT0gJ3RyYW5zZm9ybScpIHtcclxuICAgICAgICAgICAgICAgIG9iai5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMuZm9yRWFjaChhZGQpO1xyXG5cclxuXHJcbiAgICAgICAgLy8gc2V0IHN0YXJ0aW5nIHRyYW5zZm9ybVxyXG4gICAgICAgIHRoaXMuc2V0SW5pdGlhbE1hdHJpeCgpO1xyXG4gICAgfVxyXG5cclxuXHJcbi8qXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUFOSU1BVElORy1NRVRIT0RTLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuKi9cclxuICAgIHRyYW5zbGF0ZSh4LCB5KSB7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZSA9IHg7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZiA9IHk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TWF0cml4KHRoaXMubWFuaXB1bGF0aW9uTWF0cml4KTtcclxuICAgIH1cclxuICAgIHJvdGF0ZShhbmdsZSkge1xyXG4gICAgICAgIGNvbnN0IHJhZGlhbnMgPSAoLWFuZ2xlICogTWF0aC5QSSkgLyAxODA7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguc2luKHJhZGlhbnMpICogdGhpcy50ci5zY2FsZTtcclxuICAgICAgICBjb25zdCBhID0gTWF0aC5jb3MocmFkaWFucykgKiB0aGlzLnRyLnNjYWxlO1xyXG5cclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5hID0gYTtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5iID0gLWM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYyA9IGM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZCA9IGE7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TWF0cml4KHRoaXMubWFuaXB1bGF0aW9uTWF0cml4KTtcclxuICAgIH1cclxuICAgIHNjYWxlKHMpIHtcclxuICAgICAgICBjb25zdCByYWRpYW5zID0gKHRoaXMudHIucm90YXRlICogTWF0aC5QSSkgLyAxODA7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguc2luKHJhZGlhbnMpICogcztcclxuICAgICAgICBjb25zdCBhID0gTWF0aC5jb3MocmFkaWFucykgKiBzO1xyXG5cclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5hID0gYTtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5iID0gLWM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYyA9IGM7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguZCA9IGE7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TWF0cml4KHRoaXMubWFuaXB1bGF0aW9uTWF0cml4KTtcclxuICAgIH1cclxuICAgIHNjYWxlQW5kUm90YXRlKHMsIGFuZ2xlKSB7XHJcbiAgICAgICAgY29uc3QgcmFkaWFucyA9ICgtYW5nbGUgKiBNYXRoLlBJKSAvIDE4MDtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5zaW4ocmFkaWFucykgKiBzO1xyXG4gICAgICAgIGNvbnN0IGEgPSBNYXRoLmNvcyhyYWRpYW5zKSAqIHM7XHJcblxyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmEgPSBhO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmIgPSAtYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5jID0gYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5kID0gYTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRNYXRyaXgodGhpcy5tYW5pcHVsYXRpb25NYXRyaXgpO1xyXG4gICAgfVxyXG4gICAgc2NhbGVBbmRUcmFuc2xhdGUocywgeCwgeSkge1xyXG4gICAgICAgIGNvbnN0IHJhZGlhbnMgPSAodGhpcy50ci5yb3RhdGUgKiBNYXRoLlBJKSAvIDE4MDtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5zaW4ocmFkaWFucykgKiBzO1xyXG4gICAgICAgIGNvbnN0IGEgPSBNYXRoLmNvcyhyYWRpYW5zKSAqIHM7XHJcblxyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmEgPSBhO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmIgPSAtYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5jID0gYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5kID0gYTtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5lID0geDtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5mID0geTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRNYXRyaXgodGhpcy5tYW5pcHVsYXRpb25NYXRyaXgpO1xyXG4gICAgfVxyXG4gICAgcm90YXRlQW5kVHJhbnNsYXRlKGFuZ2xlLCB4LCB5KSB7XHJcbiAgICAgICAgY29uc3QgcmFkaWFucyA9ICgtYW5nbGUgKiBNYXRoLlBJKSAvIDE4MDtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5zaW4ocmFkaWFucykgKiB0aGlzLnRyLnNjYWxlO1xyXG4gICAgICAgIGNvbnN0IGEgPSBNYXRoLmNvcyhyYWRpYW5zKSAqIHRoaXMudHIuc2NhbGU7XHJcblxyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmEgPSBhO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmIgPSAtYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5jID0gYztcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5kID0gYTtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5lID0geDtcclxuICAgICAgICB0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeC5mID0geTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRNYXRyaXgodGhpcy5tYW5pcHVsYXRpb25NYXRyaXgpO1xyXG4gICAgfVxyXG4gICAgc2NhbGVBbmRSb3RhdGVBbmRUcmFuc2xhdGUocywgYW5nbGUsIHgsIHkpIHtcclxuICAgICAgICBjb25zdCByID0gKC1hbmdsZSAqIE1hdGguUEkpIC8gMTgwO1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLnNpbihyKSAqIHM7XHJcbiAgICAgICAgY29uc3QgYSA9IE1hdGguY29zKHIpICogcztcclxuXHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYSA9IGE7XHJcbiAgICAgICAgdGhpcy5tYW5pcHVsYXRpb25NYXRyaXguYiA9IC1jO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmMgPSBjO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmQgPSBhO1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmUgPSB4O1xyXG4gICAgICAgIHRoaXMubWFuaXB1bGF0aW9uTWF0cml4LmYgPSB5O1xyXG5cclxuICAgICAgICB0aGlzLnNldE1hdHJpeCh0aGlzLm1hbmlwdWxhdGlvbk1hdHJpeCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBPYmo7XHJcbiIsImNsYXNzIFNsaWRlIHt9XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTbGlkZTtcclxuIiwiaW1wb3J0IHN0ZXAgZnJvbSAnLi9lbmdpbmUvZGlzcGF0Y2gnO1xyXG5pbXBvcnQgT2JqIGZyb20gJy4vY2xhc3Nlcy9tYWluJztcclxuaW1wb3J0IFNsaWRlIGZyb20gJy4vY2xhc3Nlcy9zbGlkZSc7XHJcbmltcG9ydCB7IGFkZFNsaWRlcywgbmV4dCB9IGZyb20gJy4vY29udHJvbC9wbGF5ZXInO1xyXG5cclxuLy8gcm9sbHVwIHNoaXRcclxuKCgpID0+IFtzdGVwLCBPYmosIFNsaWRlLCBhZGRTbGlkZXMsIG5leHRdKSgpO1xyXG4iXSwibmFtZXMiOlsicGF1c2VUb1JlbG9hZCIsInBsYXlUb1BhdXNlIiwicmVsb2FkVG9QbGF5IiwicGF1c2VUb1BsYXkiXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sUUFBUSxHQUFHO0lBQ2IsR0FBRyxFQUFFLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUMsS0FB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QyxDQUFDOztJQUVkLFNBQVMsT0FBTyxHQUFHO1FBQ2YsSUFBSSxLQUFLLElBQUksRUFBRSxFQUFFO1lBQ2IsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7OztnQkFHbkMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDakcsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNyRyxDQUFDLENBQUMsQ0FBQztZQUNILEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNuQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUNqRyxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxF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QUFPLEVBQUUsQ0FBQztDQUNiOzs7O0FBSUQsU0FBUyxtQkFBbUIsR0FBRztJQUMzQixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDZCxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7O0lBRWYsU0FBUyxPQUFPLEdBQUc7UUFDZixJQUFJLEtBQUssSUFBSSxFQUFFLEVBQUU7WUFDYixLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDbkMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxLQUFLLEdBQUcsRUFBRSxDQUFDO21CQUNwRixFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDdkQsRUFBRSxFQUFFLEdBQUcsS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUN6RixFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxD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