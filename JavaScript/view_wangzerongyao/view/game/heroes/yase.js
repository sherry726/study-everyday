import S16610 from '../skills/s16610.js'
import S16620 from '../skills/s16620.js'
import S16630 from '../skills/s16630.js'

import Yase1 from '../skins/yase1.js';
import Yase2 from '../skins/yase2.js';

import Hero from './hero.js';
export default class Yase extends Hero{
    constructor(){
        super("亚瑟","./sources/heros/yase1.png",[new S16610,new S16620,new S16630],[new Yase1,new Yase2]);
        // this.name = "亚瑟";
        // this.ico = "./sources/heros/yase1.png";
        // this.skills = [new S16610,new S16620,new S16630];
        // this.skins = [new Yase1,new Yase2];
    }
}