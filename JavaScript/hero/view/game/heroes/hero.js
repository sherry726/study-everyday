import GameEvent from '../GameEvent.js';

export default class Hero extends GameEvent{
    constructor(name,ico,skills,skins){
        super();
        this.name = name;
        this.ico = ico;
        this.skills = skills;
        this.skins = skins;
        //添加自定义事件:初始化时不执行
        this.addEvent('myinit',this.init);
    }
    init(){
        console.log('初始化英雄逻辑.....');
    }
}