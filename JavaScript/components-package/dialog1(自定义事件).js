import GameEvent from './GameEvent.js';
export default class Dialog extends GameEvent{
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
        this.addEvent('success',this.opts.success);
        this.addEleEvent();
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
                    this.trigger('success');
                    this.close();
                    break;
                default:
                    console.log('默认点击....');
                    break;
            }

        })

    }

    //关闭弹窗
    close(){
        this.divEles.style.display = 'none';
    }
    //d打开弹窗
    open() {
        this.divEles.style.display = 'block';
    }
}