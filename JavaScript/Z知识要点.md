【学习要求】
1.基础语法

2.变量

3.数据类型

4.操作符

5.函数

6.作用域

7.引用类型
(1)Object类型
a、创建对象的3种方式
b、2种对象调用方式的区别
c、Object.create({})

8.构造函数  ✅

9.原型、原型链    ✅

10.继承 
(1)构造函数的继承----使用call/apply/bind实现
(2)构造函数原型的继承(分为简单原型继承、深拷贝原型继承、组合继承)  

11.函数表达式

12.闭包

13.this上下文

14.BOM

15.DOM操作

16.事件

17.DOM0\DOM2\DOM3

18.form

29.canvas常用API

20.HTML5

21.异常捕获

22.常见js错误

23.XML

24.JSON

25.原生ajax

26.fetch

27.sendbecan

28.js高级技巧：函数柯里化、高阶函数、节流、防抖、对象冻结、自定义事件、前端存储、新webAPI











【日常积累】
1、filter()方法不会改变原始数组

2、includes()方法：用来判断一个数组是否包含一个指定的值，如果是返回 true，否则false。
语法：includes（searchElement，fromIndex）
searchElement	必须。需要查找的元素值。
fromIndex	    可选。从该索引处开始查找 searchElement。如果为负值，则按升序从 array.length + fromIndex 的索引开始搜索。默认为0。

3、indexOf()方法


4、parseFloat(string)：解析字符串并返回浮点数。
此函数确定指定字符串中的第一个字符是否为数字。如果是，它会解析字符串直到到达数字的末尾，并将数字作为数字而不是字符串返回。
注意：只返回字符串中的第一个数字！
注释：允许前导和尾随空格。
注释：如果第一个字符不能转换为数字，parseFloat() 返回 NaN。

5、Math.round()  返回一个数字四舍五入后最接近的整数。
console.log(Math.round(12.4));  //12
console.log(Math.round(12.5));   //13

6、toString()

7、toFixed()
把 Number 四舍五入为指定小数位数的数字。
console.log(Number(12.8).toFixed(2));

8、Number()

9、数组归并方法：reduce()/reduceRight()

10、Javascript与ECMAScript的关系
ECMAScript是Javascript的规范和约定，而JavaScript实现了ECMAScript

11、let和var的差异
（1）let具有块级作用域(即存在临时性死区)；而var声明的变量只能是全局或者整个函数块的
（2）let不能重复申明变量
（3）let不具有变量提升功能


12、数据驱动、数据优先的思想


13、数组重排序方法：reverse()/sort()
sort()会影响原始数据,可以使用深拷贝JSON.parse(JSON.stringify(data))

14、filter()
不会影响原始数据

15、Nodelist和htmlcollection的区别
Nodelist可以直接使用forEach()

16、input的checkbox动态绑定checked
  <input type="checkbox" ${item.checked ? 'checked' :''} />

17、事件委托

18、命名参数、可选参数  

19、Object.prototype.hasOwnProperty()
hasOwnProperty() 方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性（也就是，是否有指定的键）。


20、注意ES5和ES6类的区别

21、ES5中传址导致的问题：深拷贝的实现


22、Object.defineProperty()
##Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。
##此方法接收三个参数：属性所在的对象、属性的名字和一个描述符对象。
##可以在访问器属性和数据属性间相互转化的属性其configurable特性值必须为true。

23、Object.defineProperties()
为对象定义多个属性，此方法接收二个参数

24、 Object.getOwnPropertyDescriptor()方法
可以取得给定属性的描述符。这个方法接收两个参数：属性所在的对象和要读取其描述符的属性名称

25、isPrototypeOf()
//判断person1的原型对象是否指向Person.prototype
alert(Person.prototype.isPrototypeOf(person1)); //true
alert(Person.prototype.isPrototypeOf(person2)); //true

26、Object.getPrototypeOf()：表示获取实例化对象的原型对象
console.log(Object.getPrototypeOf(person1));   //Person.prototype

27、hasOwnProperty()方法：检测一个属性是存在于实例中，还是存在于原型中,只在给定属性存在于对象实例中时，才会返回true。
console.log(person1.hasOwnProperty("name"));

28、 instanceof：检测对象类型   
console.log(obj1 instanceof Person);  //true
console.log(obj1 instanceof Object);  //true

29、typeof

30、constructor属性：最初是用来标识对象类型
alert(person1.constructor == Person); //true

31、Object.keys()
要取得对象上所有可枚举的实例属性，可以使用ECMAScript5的Object.keys()方法。这个方法接收一个对象作为参数，返回一个包含所有可枚举属性的字符串数组

32、 Object.getOwnPropertyNames()方法
如果你想要得到所有实例属性，无论它是否可枚举，都可以使用 Object.getOwnPropertyNames()方法

PS:Object.keys()和 Object.getOwnPropertyNames()方法都可以用来替代 for-in 循环



33、window.onload()与$(fucntion{})的区别？


34、DOMContentLoaded事件
















