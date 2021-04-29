## new

要实现 new 首先要明白 new 干了什么

1. 声明一个空对象
2. this指向这个对象
3. this 的 __proto\_\_  指向 构造函数的 prototype
4. 返回这个对象
5. 返回值如果是基础值忽略, 如果是引用值则会替换这个对象



```js
function createObject(fn, ...rest) {
    let obj = {}
    coustructor = fn
    obj.__proto__ = fn.prototype
    let result = constructor.apply(obj, rest)
    return typeof result === 'object' ? result : obj
}
```



