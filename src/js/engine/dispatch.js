import calculate from './calculate';

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


export default step;
