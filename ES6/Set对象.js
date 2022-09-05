let arr = [1,2,3,4,1,3,5,2];
let data = new Set(arr);
console.log(data);  //Set(5) {1, 2, 3, 4, 5}
//去重
console.log([...data]);  //[1, 2, 3, 4, 5]




let arr1 = [1,2,3,4,1,3,5,2,"c"];
let data1 = new Set(arr1);
console.log(data1);
console.log(data1.add("a").add("b"));
console.log(data1.delete("b"));   //true
console.log(data1.has('g'));     //false
data1.clear();  
console.log(data1.size,data1);


/*
    Set.size 数据长度
    Set.clear()    使用clear()方法仅清除集合中的所有元素，而不删除集合。
    Set.add() 在末尾添加子项;返回set数据本身
    Set.delete() 删除子项;返回true|false 
    Set.has() 是否包含子项;返回true|false 
*/