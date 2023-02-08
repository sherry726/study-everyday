## 作业

1. 参加直播课，学习时长需>=60%
2. 实现组件 PhotoItem 封装展示图片的逻辑
   1. 可通过 props 传入图片路径 imgSrc
   2. 可通过 props 传入图片名称 imgName

## template

```html
<div class="photoItem">
  <img src="img/Home.png" />
  <span> home </span>
</div>
```

PhotoItem

```js
Vue.component("PhotoItem", {});
```

## 总结

1. 思想
1. mvvm 的开发思想
   1. 数据和视图进行绑定
   1. 聚焦于数据逻辑
1. 组件化思想
   - 提高可读性
   - 可维护性
   - 单一职责
3. 学习方法
- 学习新知识的时候结合老知识 建立链接
