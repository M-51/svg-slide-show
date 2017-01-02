const earth = new Obj(document.getElementById('earth'), { translate: [300, 300], scale: 1.5 });
const earthCircle = new Obj(document.querySelector('#earth circle'));
const sun = new Obj(document.getElementById('sun'), { translate: [-15000, 300], scale: 150 });
const sunRays = new Obj(document.getElementById('sun__rays'), { translate: [100, 300] });
const sunRaysLast = new Obj(document.getElementById('sun__rays--last'));
const text = new Obj(document.getElementById('text'));

const slide1 = new Slide();
slide1.play = () => {
    step(
        {
            objects: [
                {
                    object: earth,
                    transform: { translate: [500, 300], scale: 0.1 }
                },
                {
                    object: sun,
                    transform: { translate: [-1400, 300], scale: 15 }
                },
                {
                    object: earthCircle,
                    attributes: { name: 'fill-opacity', to: 1 }
                },
                {
                    object: text,
                    effects: { effect: 'fadeIn' }
                }
            ]
        })
    .then(() =>
        step({
            objects: {
                object: sunRays,
                transform: { translate: [600, 300] },
                attributes: { name: 'opacity', to: 1 }
            }
        }
    ))
    .then(() => next(1000));
};

const slide2 = new Slide();

slide2.play = () => {
    step(
        {
            speed: 0.75,
            objects: [
                {
                    object: earth,
                    transform: { translate: [300, 300], scale: 1.5 }
                },
                {
                    object: sun,
                    transform: { translate: [-15000, 300], scale: 150 }
                },
                {
                    object: earthCircle,
                    attributes: { name: 'fill-opacity', to: 0 }
                },
                {
                    object: sunRays,
                    transform: { translate: [300, 300] }
                },
                {
                    object: text,
                    effects: { effect: 'fadeOut' }
                }
            ]
        })
    .then(() =>
        step(
            {
                speed: 0.5,
                objects: [
                    {
                        object: earth,
                        transform: { rotate: -23 }
                    }
                ]
            }
        ))
    .then(() => next());
};

const slide3 = new Slide();

slide3.play = () => {
    step(
        {
            speed: 0.75,
            objects: [
                {
                    object: earth,
                    transform: { translate: [600, 300], scale: 4 }
                },
                {
                    object: sunRays,
                    transform: { translate: [600, 300], scale: 4 }
                },
                {
                    object: sunRaysLast,
                    attributes: [{ name: 'x2', to: -107 }, { name: 'stroke-dasharray', to: 0 }]
                }
            ]
        })
    .then(() =>
        step(
            {
                speed: 0.5,
                objects: [
                    {
                        object: sunRaysLast,
                        attributes: { name: 'x2', to: 0 },
                        remove: { name: 'marker-end', when: 'end' }
                    }
                ]
            }
        ))
    .then(() => next());
};

addSlides(slide1, slide2, slide3);
