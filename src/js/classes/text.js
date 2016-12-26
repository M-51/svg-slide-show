import Obj from './main';

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

export default Text;
