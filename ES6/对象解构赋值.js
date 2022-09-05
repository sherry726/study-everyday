let obj = {
    a: 1,
    b: 2,
    c: 3
};
//PS: 变量名和属性名要一一对应
let {a,c} = obj;  //let {a:a,c:c} = obj;
console.log(a,c);

let {a:val1,c:val2} = obj;  
console.log(val1,val2);

let {d} = obj;
console.log(d);