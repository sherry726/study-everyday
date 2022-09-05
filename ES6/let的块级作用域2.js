//let定义的i为块级作用域
// for(let i = 0; i < 5; i++ ){
//    setTimeout(function(){
//        console.log(i);   
//    },100);
// }


//let定义的i为全局作用域，打印的是最终i的值
// let i;
// for(i = 0; i < 5; i++ ){
//    setTimeout(function(){
//        console.log(i);
//    },100);
// }


//使用闭包：使其具有独立的作用域
for (var i = 0; i < 5; i++) {
    (function (j) {
        setTimeout(function () {
            console.log(j);
        }, 100);
    })(i);
}