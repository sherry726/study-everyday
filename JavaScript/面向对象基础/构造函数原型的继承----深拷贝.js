function deepCopy(obj) {
    let newObj = Array.isArray(obj)?[]:{};
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



function Dad(name,age) {
    this.name = name;
    this.age = age;
    this.money = "100000";
}
Dad.prototype.fn = function () {
    console.log("喜欢象棋");
}

function Son(name,age) {
    Dad.call(this,name,age);
    this.sex = "男";
}

Son.prototype = deepCopy(Dad.prototype);
Son.prototype.fn = function () {
    console.log("喜欢篮球");
}
let zhangsan  = new Son("张三",20);
zhangsan.fn();
let zhangyi  = new Dad("张一",50);
zhangyi.fn();