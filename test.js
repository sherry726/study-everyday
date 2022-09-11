//观察者模式：自定义事件


function fn1() {
    console.log('fn1');
}
function fn2() {
    console.log('fn2');
}

// fn1()
// fn2()


document.addEventListener('click', function () {
    fn1();
    fn2();
})

let handle = {};
//将事件保存起来，先不执行
function addEvent(eventName, fn) {
    if (typeof handle[eventName] === 'undefined') {
        handle[eventName] = [];
    }
    if (handle[eventName].indexOf(fn) !== -1) {
        return;
    } else {
        handle[eventName].push(fn);
    }
}

//触发事件
function trigger(eventName){
    if (typeof handle[eventName] === 'undefined') {
       return;
    }
    handle[eventName].forEach(fn => {
        fn();
    })
}

//移除自定义事件
function removeEvent(eventName,fn){
    if (typeof handle[eventName] === 'undefined') {
        return;
    }
    handle[eventName].forEach((fnItem,index) => {
        if(fnItem === fn){
            handle[eventName].splice(index,1);
        }
    })
}



addEvent('myEvent', fn1);
addEvent('myEvent', fn1);
addEvent('myEvent', fn2);
removeEvent('myEvent', fn1);
removeEvent('myEvent', fn2);
trigger('myEvent');
