## 跨域方式

### jsonp

> 利用 script 标签 src 属性没有同源策略限制的特性来实现跨域
>
> 通过将前端方法作为参数传递给后端, 然后由服务器注入后返回, 实现服务器端向客户端的通信
>
> 只能使用 get 方法

jsonp简单版本的实现

```js
function jsonp(req) {
  let script = document.creteElement('script') // 创建script标签
  let url = req.url + '?callback=' + req.callback.name // 拼接参数
  script.url = url // 设置url属性
  document.getElementsByTagName('head')[0].appendChild(script) // 加入script标签
}
```

使用

```js
function hello(res){
    alert('hello ' + res.data);
}
jsonp({
    url : '',
    callback : hello 
})
```

- jsonp 只支持 get 请求
- jsonp 本质是一种代码注入, 并不安全

### CORS

浏览器拦截响应的原因就是服务器未设置一个头部, 所以需要服务端手动设置一个头部

```js
// 设置所有域名可访问
res.header('Access-Control-Allow-Origin', '*')
// 允许的头部
res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
// 支持的复杂请求
res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
```

当使用 cors 的时候, 请求分为`简单请求`和`复杂请求`

简单请求

> 同时满足**两个**条件
>
> 1. GET, POST, HEAD 方法之一
> 2. content-type为text/plain, multipart/form-data, application/x-www-form-urlencoded之一

复杂请求

> 非简单请求均为复杂请求, 需要有一个预检方法, 该方法为 option 方法, 询问服务器支持的方法

### websocket

websocket和http一样是基于TCP协议, 但是websocket只需要使用http建立链接, 之后就与http无关了, 所以可以使用websocket跨域



### nginx 反向代理

> 因为同源策略是针对浏览器的, 服务器并没有这一限制

