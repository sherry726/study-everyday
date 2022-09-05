// 展开运算符
//==============数组展开================
let arr = [1,2,3,4,5];
let arr2 = ["a",...arr,"b","c"];
// 把 arr 中的数据放入 arr2 中，从 第 1 位开始排列
console.log(arr2);  // ["a",1,2,3,4,5,"b","c"]



// 剩余参数
let arr3 = [1,2,3,4,5];
let [g,...b] = arr3;
console.log(g,b); //1,[2,3,4,5]


//==============对象展开================
// 展开运算符
let obj = {
    a: 1,
    b: 2
};
let obj2 = {
    ...obj,
    c: 3,
    d: 4
};
console.log(obj2);  //{ a: 1, b: 2, c: 3,d: 4}
// 剩余参数
let {a,...d} = obj2;
console.log(a,d);  //1, {b: 2, c: 3,d: 4}