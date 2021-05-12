## Promise

- 三种状态
pending resolved rejected
pending -> resolved 或 pending -> rejected

- then/catch链式调用
```js
  Promise.reolve().then(() => {
    console.log(1)
  }).catch(() => {
    console.log(2)
  }).then(() => {
    console.log(3)
  })
  // 1, 3

  Promise.reolve().then(() => {
    console.log(1)
    throw new Error("error")    
  }).catch(() => {
    console.log(2)
  }).then(() => {
    console.log(3)
  })
  // 1, 2, 3

  Promise.reolve().then(() => {
    console.log(1)
    throw new Error("error")    
  }).catch(() => {
    console.log(2)
  }).catch(() => {
    console.log(3)
  })
  // 1, 2
```

- 手撸

  + 简单版

    ```js
    class MyPromise {
      PENDING = 'pending'
      RESOLVED = 'resolved'
      REJECTED = 'rejected'
      constructor (fn) {
        this.state = this.PENDING
        this.value = null
        this.resolvedCallbacks = []
        this.rejectedCallbacks = []
        
        const resolve = v => {
          if (this.state === this.PENDING) {
            this.state = this.RESOLVED
            this.value = v
            this.resolvedCallbacks.map(fn => fn(this.value))
          }
        }
        
        const rejecte = e => {
          if (this.state === this.PENDING) {
            this.state = this.REJECTED
            this.value = e
            this.rejectedCallbacks.map(fn => fn(this.value))
          }
        }
        
        try {
          fn(resolve, rejecte)
        } catch (e) {
          rejected(e)
        }
      }

      then = (fullfilled, rejected) => {
        fullfilled = typeof fullfilled === 'function' ? fullfilled : v => v
        rejected = typeof rejected === 'function' ? rejected : e => { throw e }
        
        if (this.state === this.PENDING) {
          this.resolvedCallbacks.push(fullfilled)
          this.rejectedCallbacks.push(rejected)
        }
        
        if (this.state === this.RESOLVED) {
          fullfilled(this.value)
        }
        
        if (this.state === this.REJECTED) {
          rejected(this.value)
        }
      }
    }
    ```

  + Promise.all
    - 简单版
      ```js
      Promise.myAll = function (proArr) {
        let result = []
        
        for (let i = 0, len = proArr.length; i < len; i ++) {
          proArr[i].then(v => {
            result.push(v)
          }, e => {
            return Promise.reject(e)
          })
        }
        return Promise.resolve(result)
      }
      ```
    - 进阶
      ```js
        Promise.myAll = function(arr){
          return new Promise((resolve, reject) => {
            const result = [],
              len = arr.length
            let count = 0

            for(let i = 0; i< len; i++) {
              count ++
              arr[i].then(v => {
                result[i] = v
                if(count === len) {
                  return resolve(result);
                }
              }, e => {
                return reject(e)
              })
            }
          })
        }
      ```
  + race
    ```js
      Promise.myRace = function(promiseAry) {
        return new Promise((resolve, reject) => {
          for (let i = 0; i < promiseAry.length; i++) {
            promiseAry[i].then(resolve, reject)
          }
        })
      }
    ```

