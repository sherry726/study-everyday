function Person(name, age, job) {
    //属性
    this.name = name;
    this.age = age;
    this.job = job;
    //方法
    if (typeof this.sayName != "function") {
        Person.prototype.sayName = function () {
            alert(this.name);
        };
        /**
         * 使用动态原型模式时，不能使用对象字面量重写原型。如果在已经创建了实例的情况下重写原型，
         * 那么就会切断现有实例与新原型之间的联系。
        */
        //不能写成以下这种
        // Person.prototype = {
        //     constructor:Person,
        //     sayName:function(){
        //         alert(this.name);
        //     }
        // };
    }
}
var friend = new Person("Nicholas", 29, "Software Engineer");
friend.sayName();