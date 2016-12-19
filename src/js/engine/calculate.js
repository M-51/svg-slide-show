import animate from './animate';
import { addObjects } from '../control/player';
import calculateTransform from './calculations/transform';
import calculateAttributes from './calculations/attribute';

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

export default calculate;
