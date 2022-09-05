let data = new Map([["leo",40],["zmouse",30],["reci",20]]);
data.set("刘伟",41);  
console.log(data);  // {'leo' => 40, 'zmouse' => 30, 'reci' => 20, '刘伟' => 41}
console.log(data.delete("leo"));  //true
data.delete("leo");
console.log(data);  //{'zmouse' => 30, 'reci' => 20, '刘伟' => 41}
console.log(data.get("zmouse"));  //30
console.log(data);
console.log(data.has("zmouse"));  //true
console.log(data.size);  //3

/*
Map.size    数据长度
Map.set()    添加子项; 返回map数据本身
Map.get()     获取子项的值
Map.delete()  删除子项; 返回true |false 
Map.has()   是否包含子项; 返回true |false 
*/