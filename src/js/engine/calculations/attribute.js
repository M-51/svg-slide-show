import utils from './../../utils';

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

export default calculateAttributes;
