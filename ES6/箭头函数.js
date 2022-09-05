function test(a,...c){
    console.log(arguments);  //Arguments(3) [1, 2, 3, callee: ƒ, Symbol(Symbol.iterator): ƒ]
    console.log(...arguments);  //1 2 3
    console.log([...arguments]);  //[1, 2, 3]
}
test(1,2,3);



//PS:箭头函数本身没有不定参
let fn = (a,...arg)=>{
    // console.log(arguments);  //Uncaught ReferenceError: arguments is not defined
    console.log(a,arg);  //1,[2,3,4]
};

fn(1,2,3,4);



//箭头函数this指向问题：箭头函数的this绑定了父级作用域的上下文
document.onclick = function(){
    let fn1 = (a,...arg)=>{
        console.log(a,arg);  //undefined []
        console.log(this);
        console.log(arguments);
    };
    fn1();
};



//参数默认值
// function fn2(nub=0,nub2=0){
//     console.log(nub+nub2);
// }
let fn2 = (nub=0,nub2=0)=>{
    console.log(nub+nub2);
}
fn2(2,2);


