const b;    //常量
b = 20;
console.log(b);


// 常量只能在声明时赋值，并且一旦赋值不能修改
const DATA = 123;



//const定义对象
const obj = {
    name:'lucy',
    age:18
}

obj = {
    name:"loe"   //不能重新赋值
}

obj.name = 'loe';   //这样修改时允许的
console.log(obj);

//如果不想被修改的话，就使用Object.freeze()
Object.freeze(obj);
obj.name  = 'loe';
console.log(obj);   //修改之后并不生效


