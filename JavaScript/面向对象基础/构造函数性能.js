function Person(name){
    this.name = name;
    this.age = 20;
    this.hobby = function(){
        console.log("喜欢篮球");
    }
}

let zhangsan = new Person("张三");
let lisi = new Person("李四");


//因为2个实例化对象，在内存中是2个不同的内存地址空间，这样子会导致内存大量的浪费消耗
console.log(zhangsan.hobby===lisi.hobby);    //false