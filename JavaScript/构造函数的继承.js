// 继承
function Dad(name, age) {
    this.name = name;
    this.age = age;
    this.money = "100000";
}


function Son(name, age) {
    Dad.call(this,name,age);        //继承父类
    // Dad.apply(this,[name,age])
    // Dad.bind(this)(name, age);
    this.sex = "男";
}


let zhangsan = new Son("张三", 20);
console.log(zhangsan);
console.log(zhangsan.money);
console.log(zhangsan.sex);