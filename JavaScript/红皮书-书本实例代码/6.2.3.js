function Person() {
}
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function () {
    console.log(this.name);
};
var person1 = new Person();
var person2 = new Person();

let des = Object.getOwnPropertyDescriptor(person1, 'name');
console.log(des);   //{configurable:true,enumerable:true,writable:true,value:Nicholas}


let des1 = Object.getOwnPropertyDescriptor(person2, 'name');
console.log(des1);   //undefined


let des3 = Object.getOwnPropertyDescriptor(Person.prototype, 'name');
//{value: 'Nicholas', writable: true, enumerable: true, configurable: true}
console.log(des3);