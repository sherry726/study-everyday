/*
1、Object.assign()  对象合并
2、Objec.is()  Object.is() 方法判断两个值是否为同一个值
*/


//Object.assign(target, source);
let obj = {
    a: 1,
    b: 2
};
let obj2 = {
    c: 3,
    d: 4
};
let f = null;
let obj3 = Object.assign({},obj,obj2,{f});
console.log(obj);
console.log(obj2);
console.log(obj3);



let nub = NaN;
let str = NaN;
console.log(Object.is(nub,str));  //true