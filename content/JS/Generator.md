# Generator
Generator 函数是 ES6 提供的一种异步编程解决方案。
- function关键字与函数名之间有一个 *；
- 函数体内部使用 yield 表达式，定义不同的内部状态;
- yield 表达式只能在 Generator 函数里使用，在其他地方会报错;

```javascript
function* generatorFunc() {
  yield 'hello'
  yield 'world'
  return 'ending'
}
const gf = generatorFunc()
console.log(gf.next())  // {value: "hello", done: false}
console.log(gf.next())  // {value: "world", done: false}
console.log(gf.next())  // {value: "ending", done: true}
console.log(gf.next())  // {value: undefined, done: true}
```