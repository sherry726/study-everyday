export default class GameEvnet {
    constructor() {
        this.handle = {};
    }
    // 添加事件
    addEvent(eventName, fn) {
        if (typeof this.handle[eventName] === 'undefined') {
            this.handle[eventName] = [];
        }
        this.handle[eventName].push(fn);
    }
    // 触发事件
    trigger(eventName) {
        if (typeof this.handle[eventName] === 'undefined') {
            return;
        }
        this.handle[eventName].forEach(fn => {
            fn();
        })
    }
   
    // 移除自定义事件
    removeEvent(eventName,fn){
        if(!eventName in this.handle){
            return ;
        }
        for(let i=0;i<this.handle[eventName].length;i++){
            if(this.handle[eventName][i]===fn){
                this.handle[eventName].splice(i,1);
                break;
            }
        }

    }
}
