// import GameEvent from './GameEvent.js';
/*
在系统底层提供了类似自定义事件的类，就可以不用继承我们自己定义的自定义事件，可以直接继承EventTarget类；
EventTarget类是系统预定义的类。
*/
// export default class Dialog extends GameEvent{
export default class Dialog extends EventTarget{
    constructor(options) {
        super();
        //默认配置
        let defualtOptions = {
            width: "30%",
            height: "250px",
            title: "测试标题",
            content: "测试内容",
            dragable: true, //是否可拖拽
            maskable: true, //是否有遮罩
            isCancel: true, //是否有取消
            success(){},   //点击确定按钮的回调
            cancel(){}   //点击取消按钮的回调
        }
        //合并配置:即合并对象
        this.opts = Object.assign(defualtOptions, options)
        this.init();
    }
    init() {
        this.createElement();
        // this.addEvent('success',this.opts.success);
        this.addEventListener('success',this.opts.success);
        this.addEleEvent();
        if(!this.opts.maskable){
            this.divEles.querySelector('.k-wrapper').style.display = 'none';
        }
        if(this.opts.dragable){
            this.drag();
        }
    }
    createElement() {
        let divEles = document.createElement('div');
        divEles.innerHTML = `
            <div class="k-wrapper"></div>
            <div class="k-dialog" style="width:${this.opts.width};height:${this.opts.height}">
                <div class="k-header">
                    <span class="k-title">${this.opts.title}</span><span class="k-close">X</span>
                </div>
                <div class="k-body">
                    <span>${this.opts.content}</span>
                </div>
                <div class="k-footer">
                    ${this.opts.isCancel ? '<span class="k-cancel">取消</span>' : ''}
                    <span class="k-primary">确定</span>
                </div>
            </div>
        `;
        divEles.style.display = 'none';
        document.body.appendChild(divEles);
        this.divEles = divEles;

    }
    //绑定事件
    addEleEvent(){
        /*
        let closeEle = this.divEles.querySelector('.k-close');
        closeEle.addEventListener('click',()=>{
            console.log(this);
            this.close();
        })
        */

       /*
        let cancelEle = this.divEles.querySelector('.k-cancek');
        console.log(cancelEle);
        cancelEle.addEventListener('click',()=>{
            console.log(this);
            this.close();
        })
        //当cancelEle不存在时，上面这种方式会报错，可以使用以下这种方式
        cancelEle && (cancelEle.addEventListener('click',()=>{
            console.log(this);
            this.close();
        }))
        */

        //但最好使用事件委托的方式
        let kDialog = this.divEles.querySelector('.k-dialog');
        kDialog.addEventListener('click',e=>{
            let className = e.target.className;
            switch(className){
                case 'k-close':
                    this.close();
                    break;
                case 'k-cancel':
                    this.opts.cancel();
                    this.close();
                    break;
                case 'k-primary':
                    // this.opts.success();
                    // this.trigger('success');
                    //触发事件
                    // let obj = new CustomEvent('success');
                    // this.dispatchEvent(obj);
                    this.sure();
                    this.close();
                    break;
                default:
                    console.log('默认点击....');
                    break;
            }

        })

    }
    sure(value){
        //触发事件
        let obj = new CustomEvent('success',{detail:value});  //detail是系统预定义好的
        this.dispatchEvent(obj);
    }
    //关闭弹窗
    close(){
        this.divEles.style.display = 'none';
    }
    //d打开弹窗
    open() {
        this.divEles.style.display = 'block';
    }
    //弹窗拖拽
    drag(){
        let kDialog = this.divEles.querySelector('.k-dialog');
        kDialog.onmousedown = function(e){
            let x = e.clientX - this.offsetLeft;
            let y = e.clientY - this.offsetTop;
            // console.log(e.clientX,e.clientY);
            // console.log(this.offsetLeft,this.offsetTop);
            // console.log(x,y);
            kDialog.onmousemove = function (e) { 
                let xx = e.clientX;
                let yy = e.clientY;
                this.style.left = (xx - x) + 'px';
                this.style.top = (yy - y) + 'px';
            }
        }
        document.onmouseup = function () { 
            kDialog.onmousemove = "";
        }
    }
}


//通过继承扩展功能
export class InputDialog extends Dialog{
    constructor(options){
        super(options);
        this.createInput();
    }
    createInput(){
        let myInput = document.createElement('input');
        myInput.classList.add('input-inner');
        this.divEles.querySelector('.k-body').appendChild(myInput);
        this.myInput = myInput;
    }
    sure(){
        let value =  this.myInput.value;
        super.sure(value);
    }
}



class ShowDialog extends HTMLElement{
    constructor(){
        super();
        this.innerHTML = `<button>按钮</button>`;
        let dialog = new InputDialog({
            // title:this.title(),
            title:this.title,
            success(e){
                console.log('自定义组件的回调....',e.detail);
            }
        });
        this.onclick = function () { 
            dialog.open();
        }
    }
    // title(){
    //     return this.getAttribute('title') ?? '默认标题123'
    // }
    //获取值: getter
    get title(){
        return this.getAttribute('title') ?? '默认标题123'
    }
}
customElements.define("show-dialog",ShowDialog);