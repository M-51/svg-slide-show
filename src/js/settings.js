const settings = {
    svg: document.getElementsByTagName('svg')[0],
    speed: 0.025,
    easing: t => t * t * (3 - (2 * t)),
};

export default settings;
