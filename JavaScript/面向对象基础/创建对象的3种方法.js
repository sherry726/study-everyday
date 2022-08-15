//第1种方式：字面量的方式
let obj = {
    name:'wangqin',
    age:28,
    hobby(){
        return 'like'
    }
}
console.log(obj);
console.log(obj.hobby());




//第2种方式：通过构造函数创建对象
let obj1 = new Object();
obj1.name = 'wnagqin';
obj1.age = 23;
obj1.hobby = function(){
    return 'love'
}
console.log(obj1);
console.log(obj1.hobby());




//第3种方式：Object.create()    属性方法放在原型上；
let obj2 = Object.create({
    name:"张三",
    age:20,
    hobby(){
        console.log("喜欢篮球");
    }
})
console.log(obj2);   // {}    见图img1.png
// console.log(obj2.name);
// console.log(obj2['name']);
let str = "name";
console.log(obj2.str);
console.log(obj2[str]);

/**
 * PS1:使用.和[]调用对象的区别：涉及到变量的时候，需要使用[]；
 * PS2:属性名如果是变量，也需要使用[]，[]里面也可以就那些一些字符串操作
 * **/




//PS2
let str3 = 'name';
let obj3 = {
    [str3]:'wq',    
    age:20
}
console.log(obj3);
console.log(obj3['name']);
console.log(obj3.name);


