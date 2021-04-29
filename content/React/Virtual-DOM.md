# Virtual DOM

## 什么是 Virtual DOM
Virtual DOM 是一种编程概念。通过 JS对象 描述”真实的“DOM结构，且DOM结构发生改变前，JS对象先发生改变，根据改变后的JS对象再来同步”真实的“DOM，也就是协调。

## 为什么要用虚拟DOM对象
1. 方便diff
2. 为函数式UI编程打开了大门
3. 跨平台，比如 ReactNative,小程序