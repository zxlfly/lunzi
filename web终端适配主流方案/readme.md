# [web终端适配主流方案](https://github.com/zxlfly/article/tree/main/05.css)
- Web设计1.0是“一维的”：设计元素大多是按顺序排列的
（按文档流的自然顺序排列）
- Web设计2.0是“二维的”：单元格中有放置元素的网格，
具有更多的自由性（x y轴）
- Web设计3.0是一个“新的维度”：它可以像平面设计工具
一样的自由地定位元素、重叠
## flex、grid
目前主流布局方式
## [shapes](https://www.w3.org/TR/css-shapes-1/)
CSS Shapes 描述了在 CSS 中使用的几何形状。
## masking&clipping
可以理解为ps的蒙层和裁剪

# UI 界面的缩放
## rem
通过postcss配置简化开发
```
"postcss-pxtorem":{
  rootValue:75,
  unitPrecision:5,
  propList:['*']
}
```
## vw
通过postcss配置简化开发
```
"postcss-px-to-viewport" : {
  //视窗的宽度，对应的是我们设计稿的宽度，一般是750viewportwidth: 750,
  //视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
  viewportHeight : 1334,
  //指定`px`转换为视窗单位值的小数位数(很多时候无法整除)
  unitPrecision: 3,
  //指定需要转换成的视窗单位，建议使用vw
  viewportUnit: 'vw ',
  //指定不转换为视窗单位的类，可以自定义，可以无限添加，建议定义一至两个通用的类名
  selectorBlackList:[ '.ignore' , '.hairlines ' ],
  //小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
  minPixelValue: 1,
  //允许在媒体查询中转换`px`
  mediaQuery: false
}
```
## 组件驱动方式（容器查询 container.html）
### 定义一个包含性上下文
在一个元素上显式使用 container 可以告诉浏览器以后要针对这个容器进行查询，以及具体如何查询该特定的容器。
```
.card__container {
  container-type: inline-size
}
```
上面的代码告诉浏览器，可以基于.card__container容器的内联轴（Inline Axis）方向尺寸变化进行查询。也就是说，当.card__container容器宽度大小变化到指定的某个值时，其后代元素的样式就可以进行调整。  
container-type 是 container 属性中的一个子属性，另外，还可以显式使用 container-name 来命名你的容器，即给一个包含性上下文指定一个具体的名称：
```
.card__container { 
  container-name: card 
}
```
上面两个属性可以简写
```
.card__container { 
  container-type: inline-size; 
  container-name: card; 
} 
/* 等同于 */ 
.card__container { 
  container: inline-size / card; 
}
```
### 定义一个容器查询
有了这个包含性上下文之后，就可以使用 CSS 的 @ 规则@container来对应用了包含性元素进行查询，即对容器进行查询。@container 规则的使用和 @media 以及 @supports相似：
```
@container containerName size(width > 45rem) {
  /* 应用了包含性上下文后代元素的 CSS */ 
}
@container size(width > 45rem) { 
  /* 应用了包含性上下文后代元素的 CSS */ 
}
@container style(--card: large) {
  /* CSS Style */
}

@container size(width > 30em) and style(--card: large) {
  /* CSS Style */
}
```
这两种方式都是正确的使用姿势，第一个示例中的 containerName 指的是 container-name 显式声明的包含性上下文的名称。如果在@container 中没有指定查询的容器名称，那么这个查询将是针对离样式变化最近的声明了包含性上下文的元素进行查询

# fn.html
通过css函数计算的方式

# css宽度
## max-content
内容有多宽，盒子就有多宽，不会顾及父级盒子有多宽，只满足自己的需求。
## min-content
装下单个最大内容的最小宽度
## fit-content
根据内容不同自动调整自身宽度，将给定大小为可用大小公式。min(maximum size, max(minimum size, argument))。不会超过上限
