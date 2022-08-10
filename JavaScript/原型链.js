// 构造函数
function Foo(name) {
    this.name = name;
    this.age = 20;
    // this.test = "你好111"
}
//原型对象；
Foo.prototype.fn = function () {
    console.log("f");
}
// Foo.prototype.test = "hello";
// Object.prototype.test = "你好222";    //原型链最顶层为 Object 构造函数的 prototype 原型对象
let newFoo = new Foo("张三");
console.log(newFoo.test);   



// let obj  = new  Object();
// console.log(Object.prototype.__proto__);  //如果没有，则为null 