let b;    //b相当于全局作用域
if (true) {
    let a = 1;
    b = 2;
    console.log(a);   //1
}
console.log(b);   //2
console.log(a);   //报错：Uncaught ReferenceError: a is not defined


