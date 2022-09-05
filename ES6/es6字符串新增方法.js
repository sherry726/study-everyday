/*
1、String.startsWith(searchvalue,startIndex)
2、String.endsWith(searchvalue,length)   //length表示字符串长度
3、String.repeat(number)  //number表示重复次数
*/

let str = "123456789";
console.log(str.startsWith("56",4));
console.log(str.endsWith("67",7));

let str1 = "123";
console.log(str1.repeat(2));