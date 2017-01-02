import utils from './../../utils';

/* effects functions */

// fadeIn function
function fadeIn(o) {
    o.obj.removeAttribute('display');
    o.obj.setAttribute('opacity', 0);
    const func = (t) => {
        o.obj.setAttribute('opacity', t);
    };
    const update = () => {
        o.obj.setAttribute('opacity', 1);
        o.variables.set('opacity', 1);
        o.variables.delete('display', 1);
    };
    return [func, update];
}

// fadeOut function
function fadeOut(o) {
    o.obj.setAttribute('opacity', 1);
    o.obj.removeAttribute('display');
    const func = (t) => {
        o.obj.setAttribute('opacity', (1 - t));
    };
    const update = () => {
        o.obj.setAttribute('opacity', 0);
        o.obj.setAttribute('display', 'none');
        o.variables.set('opacity', 0);
        o.variables.set('display', 'none');
    };
    return [func, update];
}

/* effects dispatcher */

function calculateEffects(el) {
    const effects = el.effects;
    const table = [];
    const obj = el.object;

    function effectsFunc(t) {
        for (let i = 0; i < table.length; i += 1) {
            table[i][0](t);
        }
    }
    function updateFunc() {
        for (let i = 0; i < table.length; i += 1) {
            table[i][1]();
        }
    }

    // check for effects
    if (!utils.undef(effects)) {
        const items = Array.isArray(effects) ? effects : [effects];
        // for every effect
        for (let i = 0; i < items.length; i += 1) {
            const item = items[i];
            // check for fadeIn effect
            if (item.effect === 'fadeIn') {
                table.push(fadeIn(obj));
            // check for fadeOut effect
            } else if (item.effect === 'fadeOut') {
                table.push(fadeOut(obj));
            }
        }
        return [effectsFunc, updateFunc];
    }
    return false;
}

export default calculateEffects;
