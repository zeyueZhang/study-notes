## for ... of

- for ... in(以及 forEach for)是常规的同步遍历
- for ... of 常用于异步遍历

```js
  function muti(num) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(num * num)
      }, 1000)
    })
  }
  const nums = [1, 2, 3]

  nums.forEach(async (i) => {
    const res = await muti(i)
    console.log(res)
  })
  
  !(async function() {
    console.time("b")
    for(let i of nums) {
      const res = await muti(i)
      console.log(res)
    }
    console.timeEnd("b")
  })()

```