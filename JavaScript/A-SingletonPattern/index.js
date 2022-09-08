//直接定义的1个对象也算是单例



/*
export default class Person{
    constructor(name){
        this.name = name;
    }
}
*/



//这种方式存在的缺点
/*
export default class Person{
    static instance = null;
    constructor(name){
        this.name = name;
        if(!Person.instance){
            Person.instance = this;
        }
        return Person.instance;
    }
}
*/


//这样子导致参数无法传递
/*
class Person{
    constructor(name){
        this.name = name;
    }
 }
let instance = null;
if(!instance){
    instance = new Person();
}
export default instance;
*/



//利用函数封装之后再导出即可
class Person {
    constructor(name) {
        this.name = name;
    }
}
let instance = null;
export default function (...arg) {
    if (!instance) {
        instance = new Person(...arg);
    }
    return instance;
}
