import Player from './player.js';

// 游戏管理类；
export default class Game{
    constructor(){
        this.player = null;
    }
    login(name){
        this.player = new Player(name);
    }
}