# 事件循环

- **event loop是一个执行模型，在不同的地方有不同的实现。浏览器和NodeJS基于不同的技术实现了各自的Event Loop。**

### 宏任务和微任务


- 宏任务，macrotask，也叫tasks。 一些异步任务的回调会依次进入macro task queue，等待后续被调用，这些异步任务包括：
  + setTimeout
  + setInterval
  + setImmediate (Node独有)
  + requestAnimationFrame (浏览器独有)
  + I/O
  + UI rendering (浏览器独有)
- 微任务，microtask，也叫jobs。 另一些异步任务的回调会依次进入micro task queue，等待后续被调用，这些异步任务包括：
  + process.nextTick (Node独有)
  + Promise
  + Object.observe
  + MutationObserver

### 浏览器的Event Loop

- 宏任务：DOM渲染后触发
- 微任务：DOM渲染前触发

- **首先执行同步代码，同步代码全部执行完毕，执行微任务（microkask），直到全部执行完毕后再执行宏任务（macrokask）**

1. 执行全局Script同步代码，这些同步代码有一些是同步语句，有一些是异步语句（比如setTimeout等）；
2. 全局Script代码执行完毕后，调用栈Stack会清空；
3. 从微任务microtask queue中取出位于队首的回调任务，放入调用栈Stack中执行，执行完后microtask queue长度减1；
4. 继续取出位于队首的任务，放入调用栈Stack中执行，以此类推，直到直到把microtask queue中的所有任务都执行完毕。注意，如果在执行microtask的过程中，又产生了microtask，那么会加入到队列1. 的末尾，也会在这个周期被调用执行；
5. microtask queue中的所有任务都执行完毕，此时microtask queue为空队列，调用栈Stack也为空；
6. 取出宏任务macrotask queue中位于队首的任务，放入Stack中执行；
7. 执行完毕后，调用栈Stack为空；
8. 重复第3-7个步骤；
9. 重复第3-7个步骤；
