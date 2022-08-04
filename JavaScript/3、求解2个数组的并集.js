//计算2个数组的并集
/**
 * 计算数组a和数组b的并集：
 * 
 * filter()方法不会改变原始数组
 * 
 * includes()方法
 * 
 */
 let a = [1,2,3];
 let b = [1,2,3,4,5,6];
 
 //方式1
 let result = a.concat(b.filter(item => a.indexOf(item) == -1));
 console.log(result);
 
 
 //方式2
 let result1 = a.concat(b.filter(item => !a.includes(item)));
 console.log(result1);
 