//计算2个数组的差集
/**
 * 计算数组a和数组b的差集：过滤出不存在数组a中的item
 * 
 * filter()方法不会改变原始数组
 * 
 * includes()方法
 * 
 */
let a = [1,2,3];
let b = [1,2,3,4,5,6];

//方式1
let result = b.filter(item => !a.includes(item));
console.log(result);


//方式2
let result1 = b.filter(item => a.indexOf(item) == -1);   //返回在数组a中找不到的item
console.log(result1);
