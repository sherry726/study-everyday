// 继承；
function Dad(name,age) {
    this.name = name;
    this.age = age;
    this.money = "100000";
}
Dad.prototype.fn = function(){
    console.log("fn");
}

function Son(name,age) {
    Dad.call(this,name,age);
    this.sex = "男";
}

Son.prototype = Dad.prototype;   //涉及到传址问题
Son.prototype.fn = function(){
    console.log("重写的fn");
}



let zhangsan  = new Son("张三",20);
zhangsan.fn();   //重写的fn

let zhangyi  = new Dad("张一",20);
zhangyi.fn();   //重写的fn
