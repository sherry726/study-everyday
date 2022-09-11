class Jq {
    constructor(arg,root) {
        //保存上一次操作的节点
        if(typeof root === 'undefined'){
            this['previousObj'] = document;
        }else{
            this['previousObj'] = root;
        }
        if (typeof arg === 'string') {
            let eles = document.querySelectorAll(arg);
            for (let i = 0; i < eles.length; i++) {
                this[i] = eles[i];
            }
            this.length = eles.length;
        } else if (typeof arg === 'function') {
            return document.addEventListener('DOMContentLoaded', arg)
        } else {
            if (typeof arg.length === 'undefined') {
                //1个节点
                this[0] = arg;
                this.length = 1;
            } else {
                //多个
                for (let i = 0; i < arg.length; i++) {
                    this[i] = arg[i];
                }
                this.length = arg.length;
            }
        }
    }
    click(fn) {
        for (let i = 0; i < this.length; i++) {
            this[i].addEventListener('click', fn);
        }
        return this;   //便于在调用完click之后，还是需要进行链式操作
    }
    eq(index) {
        // return this[index];   //这个返回的是某个具体的节点，不具备click等方法，故可以像下面这种方式进行调用
        return new Jq(this[index],this);//在调用eq()的时候，第二个参数就是上一次操作的节点
    }
    end(){
        //返回上一次保存的节点
        return this['previousObj'];
    }
    on(eventName, fn) {
        let eventNameArr = eventName.split(" ");
        for (let i = 0; i < this.length; i++) {
            for (let j = 0; j < eventNameArr.length; j++) {
                this[i].addEventListener(eventNameArr[j], fn);
            }
        }
    }
    css(...arg) {
        if (arg.length === 1) {
            if (typeof arg[0] === 'string') {
                //1个参数
                return this.getStyle(this[0], arg[0]);
            } else {
                //对象
                for (let i = 0; i < this.length; i++) {
                    //{width:'10px',height:'30px',background:'pink'}像这种对象使用for...in来循环
                    for (let j in arg[0]) {
                        this.setStyle(this[i], j, arg[0][j]);
                    }
                }
            }
        } else {
            //2个参数
            for (let i = 0; i < this.length; i++) {
                this.setStyle(this[i], arg[0], arg[1]);
            }
        }
       return this;
    }
    getStyle(ele, styleName) {
        if(styleName in $.cssHooks){
            $.cssHooks[styleName].get(ele);
        }
        return window.getComputedStyle(ele, null)[styleName];
    }
    setStyle(ele, styleName, styleValue) {
        if(styleName in $.cssHooks){
            $.cssHooks[styleName].set(ele,styleValue);
        }
        if(typeof styleValue === 'number' && !$.cssNumber[styleName]){
            styleValue = styleValue + 'px';
        }
        return ele.style[styleName] = styleValue;
    }
    animate(...arg){
        let timer;
        if(typeof arg[1] === 'number'){
            timer = arg[1] / 1000 + 's';
        }else{
            timer = "1s";
        }
      for(let i=0;i<this.length;i++){
        for(let j in arg[0]){
            this.setStyle(this[i],'transition','all ' + timer);
            this.setStyle(this[i],j,arg[0][j]);
            if(typeof arg[arg.length - 1] === 'function'){
                this[i].addEventListener('transitionend',arg[arg.length - 1]);
            }
        }
      }
    }
}





function $(arg) {
    // return {
    //     click(fn){
    //         fn();
    //     }
    // }
    //需要返回1个对象，可以通过创建1个类然后实例化对象
    return new Jq(arg);
}
$.cssNumber = {
    animationIterationCount: true,
    columnCount: true,
    fillOpacity: true,
    flexGrow: true,
    flexShrink: true,
    fontWeight: true,
    gridArea: true,
    gridColumn: true,
    gridColumnEnd: true,
    gridColumnStart: true,
    gridRow: true,
    gridRowEnd: true,
    gridRowStart: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    widows: true,
    zIndex: true,
}
$.cssHooks = {}