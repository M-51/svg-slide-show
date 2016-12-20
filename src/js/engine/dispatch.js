import calculate from './calculate';

/* Split request to threads, and dispatch to "calculate" function */

function dispatch(...threads) {
    return new Promise((resolve, reject) => {
        if (threads.length === 0) {
            // throw error, if request is empty
            reject(Error('Add objects to "step" function'));
        } else {
            const arr = [];
            // send all threads to calculation
            for (let i = 0; i < threads.length; i += 1) {
                arr.push(calculate(threads[i]));
            }
            // after animation completed, resolve promise to launch next sequence
            Promise.all(arr).then(() => { resolve(); });
        }
    });
}

// rename element for easier access
const step = dispatch;

export default step;
