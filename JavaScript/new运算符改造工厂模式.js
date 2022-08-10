// let str = "";
// let str = new String();
// 1.执行函数；2.自动创建一个空对象； 3.把空对象和this绑定 4.如果没有返还，隐式返还this；
function test(){
    console.log("test");
}
test();
new test();
new test;   //这种方式也可以调用


// 构造函数；1.首字母大写；2.this指向实例化对象；
function Person(name,age,hobby){
    this.name = name;
    this.age = age;
    this.hobby = function(){
        console.log(hobby);
    }
}

let zhangsan  = new Person("张三",20,"喜欢篮球");
let lisi  = new Person("李四",21,"喜欢足球");
console.log(zhangsan);
console.log(lisi);
zhangsan.hobby();


// 静态成员：静态属性、静态方法
Person.num = 0;   // 静态属性
Person.fn = function(){    // 静态方法
    console.log("fn");
}