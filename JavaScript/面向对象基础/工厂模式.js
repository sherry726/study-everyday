// let zhangsan = {
//     name:"张三",
//     age:20,
//     hobby(){
//         console.log("喜欢篮球");
//     }
// }
// let lisi = {
//     name:"李四",
//     age:21,
//     hobby(){
//         console.log("喜欢足球");
//     }
// }

// 工厂模式 (这里的Person可以理解为是1个类)
function Person(name,age,hobby){
    let obj = {};   // 添加原料
    obj.name = name;    // 加工原料
    obj.age = age;  // 加工原料
    obj.hobby = function(){      // 加工原料
        console.log(hobby);
    }
    return obj;  //出厂
}

//调用Person所创建的对象，可以理解为Person类的实例对象
let zhangsan = Person("张三",20,"喜欢篮球");
let lisi  = Person("李四",21,"喜欢足球");
console.log(zhangsan);
console.log(lisi);


