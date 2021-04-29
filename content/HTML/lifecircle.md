## DOMContentLoaded

> 在 html 加载完成时候触发, 不包括外在资源

可以使用 `addEventListener` 来监听

```js
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dom Content Loaded')
})
```

对于外部源如如图片这时候不能获取

> 对于 script 的 defer 或者 async, defer 刚好在该事件之前执行, 而 async 只是异步下载, 同步执行, 总的来说这俩都在该生命周期之前完成

> CSS 则不会影响, 但是内联会影响

这个生命周期内会试图填写已记住的表单

## load

> 整个页面加载完成, 包括外部资源

可以使用 window.onload

```js
window.onload = () => {
	console.log('loaded')
}
```



## onbeforeunload

> 可以使用这个函数阻止用户离开页面

chrome 里面并不会展示, 火狐直接忽略了 ???

## onunload

> 关闭页面的时候触发, 但是无法阻止, 阻止需要使用 onbeforeunload

一般没什么用

## readyState

> 在 DOMContentLoaded 后执行, 监听文档加载状态

```js
document.addEventListener('readystatechange', () => {
    console.log(document.readyState)
})
```

有三个值, loading, interactive, complete

其中 interactive 和 DOMContentLoaded 同时触发, 但顺序在其之前

complete 和 window.onload 也是同时触发, 顺序也在其之前