// 工厂模式
function Person(name){
    let obj = {};
    obj.name = name;
    obj.age = 20;
    obj.fn = function(){
        console.log("fn..");
    }
}
let zhangsan  = Person("张三");
// console.log(zhangsan.constructor===Person);   //报错，不存在constructor


// 构造函数；
// function Person(){
//     this.name = name;
//     this.age = 20;
// }
// Person.prototype.fn = function(){
//     console.log("fn...");
// }
// let zhangsan  = new Person("张三");
// console.log( zhangsan.constructor===Person);

let str = "abc";
console.log(str.constructor === String);