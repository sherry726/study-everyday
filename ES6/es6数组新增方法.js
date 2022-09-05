/*
1、Array.from()
2、Array.isArray()
3、Array.of()
4、Array.find()
5、Array.findIndex()
6、Array.flat()
7、Array.flatMap()
8、Array.includes(searchElement,Index)
9、Array.fill(value[, start[, end]])
*/
(function () {
    let list = document.getElementById('list');
    let lists = list.getElementsByTagName('li');
    // lists = [...lists];   //...将类数组转换为数组
    lists = Array.from(lists);   //Array.from()将类数组转换为数组
    lists.forEach(item => {
        console.log(item);
    })
    console.log(lists);


    //在对象上使用Array.from()
    let datas = {
        0: "a",
        1: "b",
        2: "c",
        length: 3
    };
    datas = Array.from(datas);
    console.log(datas);
    //还可以指定1个函数作为参数
    datas = Array.from(datas, function (item, index) {
        console.log(item, index, this);
        return item.toUpperCase();
    }, document);  //绑定this指向
    console.log(datas);

    console.log(Array.isArray(lists));  //true


})();

let arr = Array.of(1, 2, 3, 4, 5, 5, 6);
console.log(arr);
let arr2 = Array.of(12, 23);
console.log(arr2);

let arr3 = [1, 2, 8, 6];
let val = arr3.find((item) => {
    return item >= 5;
});   //返回的是找到的那一项的值
console.log(val);  //8


let arr4 = [1, 2, 8, 6];
let index = arr4.findIndex((item) => {
    return item >= 5;
});  //返回的是找到的那一项的索引
console.log(index);  //2


let arr5 = [
    [1, 2],
    [3, 4],
    [[6, 7],[[8],[9, 10]]]
];
console.log(arr5.flat(Infinity));


let arr6 = [
    [1,2],
    [3,4],
    [6,8]
];
let arr7 = arr6.flatMap(item=>{
    // console.log(item);
    item = item.filter(item=>item>=2);
    return item;
});
console.log(arr7);  // [2, 3, 4, 6, 8]


let arr8 = ["a","b","c","d"];
console.log(arr8.includes("a",-1));  //false


/*
Array arr.fill(value[, start[, end]]); 用一个固定值填充一个数组中从起始索引到终止索引内的全部元素。不包括终止索引
参数：用来填充数组元素的值。
可选参数：
    start 
        起始索引，默认值为0。
    end 
        终止索引，默认值为 arr.length  
*/
let arr9 = ["a","b","c","d","e"];
arr9.fill("f",1,3);
console.log(arr9);  //['a', 'f', 'f', 'd', 'e']
