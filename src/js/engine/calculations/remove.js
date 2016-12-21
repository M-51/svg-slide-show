import utils from './../../utils';

function calculateRemove(el) {
    const remove = el.remove;

    if (!utils.undef(remove)) {
        if (remove.when === 'end') {
            const removeFunc = () => false;
            const updateFunc = () => {
                el.object.obj.removeAttribute(remove.name);
                el.object.variables.delete(remove.name);
            };
            return [removeFunc, updateFunc];
        }
        el.object.obj.removeAttribute(remove.name);
        el.object.variables.delete(name);
    }
    return false;
}

export default calculateRemove;
