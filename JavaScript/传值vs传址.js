//复杂数据类型传址;
// let DadProto = {
//     name:"张三",
//     age:20
// }

// let SonProto = DadProto;   //涉及传址问题；在内存中是同一个空间
// SonProto.name = "李四";
// console.log(SonProto);
// console.log(DadProto);



// 简单数据类型：传值；
// let a = 10;
// let b = a;
// b = 20;
// console.log(a);


// // 深拷贝
// let DadProto = {
//     name:"张三",
//     age:20,
// }

// let SonProto = JSON.parse(JSON.stringify( DadProto));
// SonProto.name = "李四";
// console.log(DadProto);      //{name: '张三', age: 20}
// console.log(SonProto);     //{name: '李四', age: 20}



// 深拷贝
// let DadProto = {
//     name:"张三",
//     age:20,
//     test:undefined,
//     fn:function(){
//         console.log('fn...');
//     }
// }

// let SonProto = JSON.parse(JSON.stringify( DadProto));
// SonProto.name = "李四";
// console.log(DadProto);      //{name: '张三', age: 20, test: undefined, fn: ƒ}
// console.log(SonProto);     //{name: '李四', age: 20}


let obj = {
    name:"张三",
    age:20,
    fn:function() {
        console.log("fn..");
    },
    test:undefined,
    arr:[],
}

let obj2 = deepCopy( obj);
obj2.name = "李四";
//{name: '李四', age: 20, test: undefined, arr: Array(0), fn: ƒ}
console.log(obj2);
//{name: '张三', age: 20, test: undefined, arr: Array(0), fn: ƒ}
console.log(obj);

function deepCopy(obj) {
    let newObj = Array.isArray(obj)?[]:{};
    /*
    *   for...in的特点：不仅会循环对象自身的属性和方法，同样会循环对象原型以及原型链上的属性和方法；
    *   但是深拷贝不需要原型和原型链上的属性和方法；
    */
    for(let key in obj){  
        if(obj.hasOwnProperty(key)){
            if(typeof obj[key] === "object"){
                newObj[key] = deepCopy(obj[key]) ;
            }else{
                newObj[key] = obj[key];
            }
        }
    }
    return newObj;
}

