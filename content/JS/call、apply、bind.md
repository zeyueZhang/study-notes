## call

> 是使用一个指定的this值和参数来调用函数的方法

两点核心: 1. call改变了this指向, 2. 函数执行了

考虑实现的话:

改变this, 把函数当成指定this的方法不就行了嘛

所以

```js
foo.fn = fn
foo.fn()
delete foo.fn
```

第一个版本

```js
Function.prototype.myCall = function (context=window, ...rest) {
    context.fn = this
    context.fn(...rest)
    delete context.fn
}
```



最终版本, 增加返回值功能

```js
Function.prototype.myCall = function (context=window, ...rest) {
    context.fn = this
    let result = context.fn(...rest)
    delete context.fn
    return result
}
```



## apply

call都实现了, apply好说

直接撸

```js
Function.prototype.myCall = function (context=window, rest) { // 参数不需要展开
    context.fn = this
    let result = context.fn(...rest) // 传参时展开即可
    delete context.fn
    return result
}
```



## bind

特点

- 返回一个函数
- 函数可以传参

bind, **绑定可以传参, 执行还可以传参**

第一个版本: 基本实现传参, 返回函数

```js
Function.prototype.myBind = function (context, ...rest) {
    let self = this
    return function (...innerRest) {
        return self.apply(context, [...rest, ...innerRest])
    }
}
```

然后压轴的来了, bind 可以用作构造函数

```js
Function.prototype.myBind = function (context, ...args) {
    let F = function () {},
    	targetMethod = this,
    	result = function (...innerArgs) {
        	return targetMethod.apply(this instanceof result ? this : context, [...args, ...innerArgs])
    }
    F.prototype = this.prototype
    result.prototype = new F() // 有点类似改良的组合继承
    return result
}
```



