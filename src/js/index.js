import step from './engine/dispatch';
import Obj from './classes/main';
import Text from './classes/text';
import Slide from './classes/slide';
import { addSlides, next } from './control/player';

// rollup shit
(() => [step, Obj, Text, Slide, addSlides, next])();
