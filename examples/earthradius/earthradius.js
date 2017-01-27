const earth = new Obj(document.getElementById('earth'), { translate: [300, 300], scale: 1.5 });
const earthCircle = new Obj(document.querySelector('#earth circle'));
const sun = new Obj(document.getElementById('sun'), { translate: [-15000, 300], scale: 150 });
const sunRays = new Obj(document.getElementById('sun__rays'), { translate: [100, 300] });
const sunRaysLast = new Obj(document.getElementById('sun__rays--last'));
const text1 = new Obj(document.getElementById('text1'), { translate: [625, 100] });
const text2 = new Obj(document.getElementById('text2'), { translate: [625, 200] });
const text3 = new Obj(document.getElementById('text3'), { translate: [625, 250] });
const text4 = new Obj(document.getElementById('text4'), { translate: [625, 100] });
const text5 = new Obj(document.getElementById('text5'), { translate: [625, 175] });

const slide1 = new Slide();
slide1.play = () => {
    step({
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
                object: text2,
                effects: { effect: 'fadeIn' }
            }
        ]
    })
    .then(() =>
        step({
            delay: 3000,
            objects: [
                {
                    object: sunRays,
                    transform: { translate: [600, 300] },
                    attributes: { name: 'opacity', to: 1 }
                },
                {
                    object: text3,
                    effects: { effect: 'fadeIn' }
                }
            ]
        }
    ))
    .then(() =>
        step({
            delay: 4000,
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
                    object: text1,
                    effects: { effect: 'fadeOut' }
                },
                {
                    object: text2,
                    effects: { effect: 'fadeOut' }
                },
                {
                    object: text3,
                    effects: { effect: 'fadeOut' }
                }
            ]
        }
    ))
    .then(() => next(1000));
};

const slide2 = new Slide();

slide2.play = () => {
    step({
        speed: 0.5,
        objects: [
            {
                object: earth,
                transform: { rotate: -23 }
            },
            {
                object: text4,
                effects: { effect: 'fadeIn' }
            }
        ]
    })
    .then(() => next(3000));
};

const slide3 = new Slide();

slide3.play = () => {
    step(
        {
            speed: 0.75,
            objects: [
                {
                    object: earth,
                    transform: { translate: [500, 300], scale: 4 }
                },
                {
                    object: sunRays,
                    transform: { translate: [770, 300], scale: 4 }
                }
            ]
        })
    .then(() => next());
};

const slide4 = new Slide();

slide4.play = () => {
    step(
        {
            speed: 0.75,
            objects: [
                {
                    object: sunRaysLast,
                    attributes: [{ name: 'x2', to: -168 }, { name: 'stroke-dasharray', to: 0 }],
                    remove: { name: 'marker-end', when: 'start' }
                },
                {
                    object: text5,
                    effects: { effect: 'fadeIn' }
                }
            ]
        })
    .then(() => next());
};

addSlides(slide1, slide2, slide3, slide4);
