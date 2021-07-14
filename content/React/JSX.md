# JSX

## 什么是JSX
语法糖
React 使用 JSX 来替代常规的JS
JSX 是一个看起来很像XML的JS语法扩展

## 为什么需要JSX
- 开发效率：使用JSX编写模板简单快速
- 执行效率：JSX编译为JS代码后进行了优化
- 类型安全：在编译过程中就能发现错误

## 原理
通过babel-loader进行预编译，借助React.createElement函数将JSX预编译

## 与Vue的异同
- react中的虚拟dom + jsx的设计一开始就有，vue则是演进过程中才出现的
- JSX本来就是JS扩展，转移过程简单；vue把template编译为render函数的过程需要复杂的编译器转换字符串-ast-js函数字符串

JSX预处理前：
```js
function Hello(props) {
  return(
    <div class="app">Hello { props.name }</div>
  )
}
```

JSX预处理后：
```js
function Hello(props) {
  return React.createElement(
    "div",
    { "class": "app" },
    "Hello",
    props.name
  )
}
```