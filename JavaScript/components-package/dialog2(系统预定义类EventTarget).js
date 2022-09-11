/*
在系统底层提供了类似自定义事件的类，就可以不用继承我们自己定义的自定义事件，可以直接继承EventTarget类；
EventTarget类是系统预定义的类。

继承EventTarget步
【绑定事件】 this.addEventListener('success',this.opts.success);
【触发事件】
(1)需要先拿到自定义事件的对象  let obj = new CustomEvent('success');
(2)再通过dispatchEvent()触发    this.dispatchEvent(obj)


*/
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
                    let obj = new CustomEvent('success');
                    this.dispatchEvent(obj);
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