import animate from './animate';
import { addObjects } from '../control/player';
import calculateTransform from './calculations/transform';
import calculateAttributes from './calculations/attribute';
import calculateRemove from './calculations/remove';
import utils from '../utils';

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

export default calculate;
