import Player from './player.js';

// 游戏管理类；
// export default class Game{
//     constructor(){
//         this.player = null;
//     }
//     login(name){
//         this.player = new Player(name);
//     }
// }



//将以上改为单例模式
class Game{
    constructor(){
        this.player = null;
    }
    login(name){
        this.player = new Player(name);
        //触发myinit自定义事件
        console.log('?????',this.player);
        let heroes = this.player.heroes;
        heroes.forEach(hero => {
            hero.trigger('myinit');
        })
    }
}

let instance = null;
//工厂模式
export default function(...arg){
    if(!instance){
        instance = new Game(...arg);
    }
    return instance;
}


