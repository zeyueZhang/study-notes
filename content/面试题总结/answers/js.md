### 变量类型和计算
- typof能判断哪些类型
  + 识别所有值类型
  + 识别函数
  + 判断是否是引用类型
  ```js
    typeof undefined // "undefined"
    typeof "abc" // "string""
    typeof 100 // "number""
    typeof true // "boolean""
    typeof Symbol('a') // "symbol"

    typeof funcion() {} // "function"

    typeof null // "object"
    typeof [] // "object"
    typeof {} // "object"

  ```
- 何时使用 === 何时使用 ==
== 隐式转换
判断obj.a == null

- 值类型和引用类型的区别

- 手写深拷贝
```js
const deepClone = (obj) => {
  if(!obj || typeof obj !== "object") return obj
  let result = obj instanceof Array ? [] : {}
  for (let key in obj) {
    if(obj.hasOwnProperty(key)) {
      result[key] = typeof obj[key] === "object" ? deepClone(obj[key]) : obj[key]
    }
  }
  return result
}
```