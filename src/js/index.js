import step from './engine/dispatch';
import Obj from './classes/main';
import Slide from './classes/slide';
import { addSlides, next } from './control/player';

// rollup shit
(() => [step, Obj, Slide, addSlides, next])();
