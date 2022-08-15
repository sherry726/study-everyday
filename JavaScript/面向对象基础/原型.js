function Person(name) {
    this.name = name;
    this.age = 20;
    // this.hobby = function(){
    //     console.log("喜欢篮球");
    // }
}


// 公共空间原型；
// Person.prototype.hobby = function () {
//     console.log("喜欢篮球");
// }



// Person.prototype.fn = function () {
//     console.log("fn");
// }


//切记不要像以下这样子操作，因为这样子会覆盖原型固有属性constructor
// Person.prototype = {
//     hobby: function () {
//         console.log("hobby");
//     }
// }


//可以这样子写
Person.prototype = {
    constructor:Person,   //手动加上constructor
    hobby:function(){
        console.log("hobby");
    }
}

let zhangsan = new Person("张三");
let lisi = new Person("李四");
console.log(zhangsan.hobby === lisi.hobby);  //true
// 原型的固有属性；
console.log(Person.prototype.constructor === Person);   //true
console.log(zhangsan.constructor === Person);  //true
console.log(zhangsan.__proto__ === Person.prototype);   //true
console.log(zhangsan.hobby === lisi.hobby);



// 可以使用constructor判断类型
let str = new String("abd");
// let str = "abc";
console.log(str.constructor === String);   //true