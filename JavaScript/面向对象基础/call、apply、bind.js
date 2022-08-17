function foo(name,age) {
    console.log(this,"姓名是"+name+"年龄是"+age);
}
foo('wangqin',24);   //this指向window


let obj = {
    name:"张三"
}
/*
*call和apply的区别：传参不一样
*/
foo.call(obj,"张三",20);
foo.apply(obj,["张三",20]);
foo.bind(obj)("张三",20);



