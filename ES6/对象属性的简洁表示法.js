let a = 0;
let b = 1;
let obj = {
    a,      // a: a
    b,  // b: b
    c(){
        console.log(123);
    }
};
obj.c();
console.log(obj);