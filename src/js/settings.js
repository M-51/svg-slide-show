const settings = {
    svg: document.getElementsByTagName('svg')[0],   // svg element
    speed: 0.025,                                   // base animation speed
    easing: t => t * t * (3 - (2 * t)),             // easing function
    interfaceAnimations: true,                      // turn on/off interface animations
};

export default settings;
