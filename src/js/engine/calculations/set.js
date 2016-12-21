import utils from './../../utils';

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

export default calculateSet;
