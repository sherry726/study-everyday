/*
【可选参数】
为什么要使用可选参数？因为在方法参数过多，调用显得麻烦，
在方法调用时不必传递所有参数，可选参数，又称为"默认参数"

语法：queryStudnet(参数1,...参数n,可选参数1,...,可选参数n)()
*/

function queryStudnet(stuName, className = "计科1班", age = 20) {
    console.log('姓名：' + stuName + '，班级：' + className + '，年龄：' + age);
}
queryStudnet('Lucy');     //全部使用默认参数
queryStudnet('Lucy', '软件1班');   //使用1个默认参数
queryStudnet('Lucy', '软件1班', 12);   //不使用默认参数




/*
【命名参数】
为什么要使用命名参数？因为使用命名参数可忽略参数的顺序，在调用时候非常方便，
尤其是参数多的情况，调用时用参数名称和参数值同时出现的方法，同时提高代码的可读性

语法：queryMethods(参数名1:参数值1,参数名n:参数值n)()
*/


function queryMethods(names, age, className) {
    console.log('姓名：' + names + '，班级：' + className + '，年龄：' + age);
}
queryMethods(age=20, names = "wangqin",className="网络2班",)