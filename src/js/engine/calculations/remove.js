import utils from './../../utils';

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

export default calculateRemove;
