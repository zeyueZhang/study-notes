### 布局
- 盒模型的宽度如何计算？
  ```html
  <style>
    div {
      width: 100px;
      padding: 10px;
      border: 1px solid #ccc;
      margin: 10px;
    }
  </style>
  <div></div>
  ```
  offsetWidth = (内容宽度 + 内边距 + 边框)，无外边距
  offsetWidth = 100 + 20 + 2 = 122px
    
- margin 纵向重叠的问题
  + 相邻元素的margin-top和margin-bottom会发生重叠
  + 空白内容的标签也会重叠
    
- margin 负值的问题
  + margin-top和margin-left负值，元素向上、向左移动
  + margin-right负值，右侧元素左移，自身不受影响
  + margin-bottom负值，下方元素上移，自身不收影响

- BFC 理解和应用
  + Block format context:块级格式化上下文
  + 一块独立渲染区域，内部元素的渲染不会影响边界以外的元素
  + 形成 BFC 的条件
    - float 不是 none
    - position 是 absolute或fixed
    - overflow 不是 visible
    - display 是 flex inline-block等

- float 布局以及clearfix
  + 圣杯布局和双飞翼布局
  + clearfix
    给浮动的父元素添加clearfix
    ```css
    .clearfix:after {
      content: "";
      display: table;
      clear: both;
    }
    ```

- flex
  + 常用语法
    flex-direction
    justify-content
    align-items
    flex-wrap
    align-self
    

### 定位
- absolute 和 relative 分别依据什么定位
  + relative 依据自身定位
  + absolute 依据最近一层的定位元素定位

- 居中对齐有哪些实现方式
  + 水平居中
    1. inline元素：text-aline: center
    2. blck 元素： marging: auto
    3. absolute：left: 50% + margin-left 负值
  + 垂直居中
    1. inline: line-heigth 等于 height
    2. absolute: top: 50% + margin-top 负值
    3. absolute: transform(-50%, -50%)
    4. absolute: top,left,bottom,right = 0 + marging: auto


### 图文样式
- line-height 继承问题 
  + 写具体数值，如30px，则继承该值
  + 写比例，如2 / 1.5，则继承该比例
  + 写百分比，如200%，则继承计算出来的值

### 响应式
- rem 是什么（em、px）
长度单位
  + px，绝对长度单位
  + em，相对长度单位，相对于父元素
  + rem，相对长度单位，相对于根元素

- 如何实现响应式
  + media-query，根据不同的屏幕宽度设置根元素 font-size
  + rem，基于根元素的相对单位

  ```html
    <style>
      @media only screen and (max-width: 374px) {
        /* iphon 5 或者更小的尺寸 以 iphone5 的宽度（320px）比例设置*/
        html {
          font-size: 86px
        }
      }
      @media only screen and (min-width: 375px) and (max-width: 413px) {
        /* iphon 6/7/8 和 iphone x */ 
        html {
          font-size: 100px
        }
      }

      @media only screen and (min-width: 414x) {
        /* iphon 6p 或更大尺寸 以 414px 比例设置*/ 
        html {
          font-size: 110px
        }
      }
    </style>
  ```
- rem 的特性
“阶梯”性
  
- 网页视口尺寸
  + window.screen.height：屏幕高度
  + window.innerHeight：网页视口高度
  + document.body.clientHeight：body高度
- vw/vh
  + vh 网页视口高度的 1/100 ``` window.innerHeght = 100vh ```
  + vw 网页视口宽度的 1/100 ``` window.innerWidth = 100vw ```
  + vmax 取两者最大值；vmin 取两者最小值
