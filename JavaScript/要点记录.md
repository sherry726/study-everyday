1、filter()方法不会改变原始数组

2、includes()方法：用来判断一个数组是否包含一个指定的值，如果是返回 true，否则false。
语法：includes（searchElement，fromIndex）
searchElement	必须。需要查找的元素值。
fromIndex	    可选。从该索引处开始查找 searchElement。如果为负值，则按升序从 array.length + fromIndex 的索引开始搜索。默认为 0。

3、indexOf()方法


4、parseFloat(string)：解析字符串并返回浮点数。
此函数确定指定字符串中的第一个字符是否为数字。如果是，它会解析字符串直到到达数字的末尾，并将数字作为数字而不是字符串返回。
注意：只返回字符串中的第一个数字！
注释：允许前导和尾随空格。
注释：如果第一个字符不能转换为数字，parseFloat() 返回 NaN。

5、Math.round()

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









