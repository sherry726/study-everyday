/**
 * 数据属性作用： 修改属性默认的特性；可以会新建出数据属性
 * 访问器的作用： 访问和设置数据属性的属性值，不会创建出新属性
 * 
 * **/


let obj = {
    name:'hah',
    height:'178cm',
    _age:10
}

Object.defineProperty(obj,'name3',{
    value:'lala',
    enumerable:true,
    configurable:false,
    write:true,
})

//导致错误：上面将configurable设置为false之后，下面再修改同一个属性name时，都会导致抛出错误
// Object.defineProperty(obj,'name',{
//     value:'lala',
//     enumerable:true,
//     configurable:true,   
//     write:true,
// })
console.log(obj);




//=============================================

let obj1 = {
    name:'ajs',
    _year:2020
}

Object.defineProperty(obj1,'years',{
    // value:'2024',     //会报错，不能同时定义数据属性value和访问器属性
    // writable:true,
    enumerable:true,
    configurable:true,
    set:function(newVal){
        console.log(newVal);
        this.name = newVal + this.name;
        this._year = newVal;
    },
    get:function(){
        return this._year;
    }
})

obj1.years = 2024;
console.log(obj1);