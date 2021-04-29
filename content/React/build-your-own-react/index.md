# 实现自己的react
[最终完整代码](./index.js)
## 一、CreateElement
探索前端的边界
talk is cheap, show me the code

1. 回顾**react**的jsx语法
  ```javascript
    const element = <h1 title="123">Hello</h1>
    const container = document.getElementById("root")
    ReactDOM.render(element, container)
    // 转换
    const element = React.createElement(
      "h1",
      { title: "foo" },
      "Hello"
    )
    =>
    const element = {
      type: "h1",
      props: {
        title: "foo",
        children: "Hello",
      },
    }
  ```
2. 实现简单的**render**
  ```javascript
    function render(element, container) {
      // 创建一个节点
      const node = document.createElement(element.type)
      node["title"] = element.props.title

      // 创建子节点
      const text = document.createTextNode("")
      text["nodeValue"] = element.props.children

      node.appendChild(text)
      container.appendChild(node)
    }
  ```
3. 实现**createElement**
  ```javascript
  // 例子
  const element = (
    <div id="foo">
      <a>bar</a>
      <b />
    </div>
  )
  const element = React.createElement(
    "div",
    { id: "foo" },
    React.createElement("a", null, "bar"),
    React.createElement("b"),
  )
  // 实现
  function createElement(type, props, ...children) {
    return {
      type,
      props: {
        ...props,
        children,
      },
    }
  }
  ```

## 二、Simple Render
1. 补充**render**实现

这里**render**后页面渲染成object object，发现children的子项类型可能为字符串、对象，需要进一步对children的子项处理，所以对子项类型为字符串或数字单独处理
```javascript
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}
```

这里定义了一个常量**TEXT_ELEMENT**作为特殊类型，仅针对字符串、数字类型做处理
然后改造**createElement**函数
```javascript
function createElement(type, props, ...children) {
  console.log(children)
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        console.log(child)
        return (
          typeof child === "object" 
        ?
        child
        :
        createTextElement(child)
        )
      })
    }
  }
}
```
同时需要改造**render**函数，使其支持渲染含有子节点的情况
```javascript
function render(element, container) {
  // 判断节点的类型，根据类型创建节点
  const node = element.type === TEXT_ELEMENT ? document.createTextNode("") : document.createElement(element.type)

  // 是否有children，子节点
  const isProperty = key => key !== "children"

  // 查找key为children的项,将props同步给当前node
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      node[name] = element.props[name]
    })
  
  // 递归处理子节点的渲染
  element.props.children.forEach(child => {
    render(child, node)
  })

  container.appendChild(node)
}
```

2. 当前**render**实现的问题
由于递归**render**，一旦开始，就不会停止，直到渲染完成，所以需要切割工作流为多个小单元。

## 三、时间切片（单元分割）
1. 创建工作循环函数，进行单元分割

[什么是requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)

通过```requestIdleCallback```来做一个循环，浏览器将在主线程空闲时运行回调。但是 **React** 不使用```requestIdleCallback```，而是使用 ***scheduler package***。

```javascript
let nextUnitOfWork = null
function workLoop(deadline) {
  let shouldYield = false
  // 根据是否有下一个单元且是否需要退出来进行渲染下一个工作单元
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)
```

## 四、Fibers
1. 理解fiber结构
  ![Fiber Tree](https://pomb.us/static/19c304dcb3824b14722691ded539ecdb/ac667/fiber4.png)
    1. 当执行完一个 ***fiber*** 工作单元后，检测是否含有 ***child fiber***，如果有将 ***child fiber***作为下一个工作单元执行。
    2. 如果没有 ***child fiber***则检测是否有 ***sibling fiber***，如果有则将 ***sibling fiber***作为下一个工作单元。
    3. 如果 ***child fiber***和 ***sibling fiber*** 都没有，则检测 ***parent sibling***。
    4. 如果 ***parent sibling*** 也不存在，往上检测，直到找到一个 ***sibling fiber***或者到达 ***root fiber*** ，则停止，意味着这次 **render** 完成。

以上，用代码来实现。

抽离**render**函数中的代码，创建新的**createDom**函数
在**render**函数中，给 ***root fiber*** 创建**nextUnitWork**
```javascript
/**
 * 单元分割，将原有render内的功能移动到该函数。
 * 创建dom，处理dom的props属性，返回dom
 * @param {Object} fiber fiber对象
 */
function createDom(fiber) {
  const dom = fiber.type == TEXT_ELEMENT ? document.createTextNode("") : document.createElement(fiber.type)

  const isProperty = key => key !== "children"
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = fiber.props[name]
    })

  return dom
}

// 设置fiber树
function render(element, container) {​
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    }
  }
}
```

2. 实现```performUnitOfWork```函数
    1. 创建新的节点，并添加进父级dom
      ```javascript
        // 创建一个新的节点，并把它添加进父级的DOM
        if(!fiber.dom) {
          fiber.dom = createDom(fiber)
        }
        if(fiber.parent) {
          fiber.parent.dom.appendChild(fiber.dom)
        }
      ```
    2. 给每一个子节点创建一个新的 ***fiber***,并将新的 ***fiber*** 添加到 ***fiber tree***
      ```javascript
        const elements = fiber.props.children
        let index = 0
        let prevSibling = null

        while(index < elements.length) {
          const element = elements[index]

          const newFiber = {
            type: element.type,
            props: element.props,
            parent: fiber,
            dom: null
          }

          if (index === 0) {
            fiber.child = newFiber
          } else {
            prevSibling.sibling = newFiber
          }
      ​
          prevSibling = newFiber
          index++
        }
      ```
    3. 根据 ***fiber*** 结构规则查找下一个工作单元。
      ```javascript
        if(fiber.child) {
          return fiber.child
        }
        let nextFiber = fiber
        while(nextFiber) {
          if(nextFiber.sibling) {
            return nextFiber.sibling
          }
          nextFiber = nextFiber.parent
        }
      ```

```javascript
  // 返回下一个工作单元
  function performUnitOfWork(fiber) {
    // TODO
    // add the element to the DOM
    // create the fibers for the element’s children
    // select the next unit of work


    // 创建一个新的节点，并把它添加进父级的DOM
    if(!fiber.dom) {
      fiber.dom = createDom(fiber)
    }
    if(fiber.parent) {
      fiber.parent.dom.appendChild(fiber.dom)
    }
  
    // 给每一个子节点创建一个新的fiber
    const elements = fiber.props.children
    let index = 0,
      prevSibling = null
  
    while (index < elements.length) {
      const element = elements[index]
  
      const newFiber = {
        type: element.type,
        props: element.props,
        parent: fiber,
        dom: null
      }
    
      // 将创建的newFiber添加进fiber tree中，是作为child添加还是sibling添加取决于它是否是第一个子项
      // 如果是第一个元素，就给该元素赋值为fiber.child
      // 其余的元素都是第一个元素的sibling
      // 通过指针引用的方式，将sibling全部挂载到fiber.child上
      if(index === 0) {
        fiber.child = newFiber
      }else {
        prevSibling.sibling = newFiber
      }
  
      prevSibling = newFiber
      index++
    }
    
    // 如果存在孩子节点，直接返回
    if(fiber.child) {
      return fiber.child
    }
    // 如果不存在就往回找sibling
    let nextFiber = fiber
    while (nextFiber) {
      if(nextFiber.sibling) {
        return nextFiber.sibling
      }
      nextFiber = nextFiber.parent
    }
  }
```
## 五、Render and Commit Phases
当前存在的问题：我们每次渲染只针对一个元素，由于使用```requestIdleCallback```，所以浏览器在我们渲染完整个 ***fiber tree*** 的之前，就可能中断我们的渲染。

1. 移除**performUnitOfWork**函数插入dom代码
  ```javascript
    // 移除
    if(fiber.parent) {
      fiber.parent.dom.appendChild(fiber.dom)
    }
  ```
2. 创建 **wipRoot**，跟踪 ***root fiber***
  ```javascript
    function render(element, container) {
      wipRoot = {
        dom: container,
        props: {
          children: [element],
        },
      }
      nextUnitOfWork = wipRoot
    }
    let wipRoot = null
  ```
3. 判断是否完成所有工作：一旦完成所有工作，提交整个 ***fiber tree*** 给 ***DOM***
  ```javascript
    function workLoop(deadline) {
      ...
      if(!nextUnitOfWork && wipRoot) {
        commitRoot()
      }
    }
  ```
4. 提交整个 ***fiber tree*** 给 ***DOM***
  ```javascript
    function commitRoot() {
      commitWork(wipRoot.child)
      wipRoot = null
    }
    ​
    function commitWork(fiber) {
      if (!fiber) {
        return
      }
      const domParent = fiber.parent.dom
      domParent.appendChild(fiber.dom)
      commitWork(fiber.child)
      commitWork(fiber.sibling)
    }
  ```
## 六、Reconciliation协调(更新和删除)
目前实现了添加节点到 ***DOM***，但是没有考虑更新或者删除节点的操作。所以我们需要对比上次渲染的 ***fiber*** 和当前渲染的 ***fiber***。

因此我们需要保存上一次渲染后的 ***fiber*** 树，称为 **currentRoot**。还需要给每个 ***fiber***节点添加 **alternate**用来指向上一次渲染的 ***fiber***

1. 保存"last fiber tree"，添加 **alternate**
```diff
  function commitRoot() {
    commitWork(wipRoot.child)
+   currentRoot = wipRoot
    wipRoot = null
  }

  function render(element, container) {
    wipRoot = {
      dom: container,
      props: {
        children: [element],
      },
+     alternate: currentRoot
    }
  }

+ let currentRoot = null
```

2. 将 **performUnitOfWork**中的原本添加 ***fiber***的逻辑代码提取到 **reconcileChildren**中
```diff
function performUnitOfWork(fiber) {
  if(!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  // 给每个元素创建fiber
  const elements = fiber.props.children;
+ reconcileChildren(fiber, elements)
​
- let index = 0;
- let prevSibling = null;

- while(index < elements.length) {
-   const element = elements[index]
-   const newFiber = {
-     type: element.type,
-     props: element.props,
-     parent: fiber,
-     dom: null
-   }
-   
-   // 父节点只链接第一个子节点
-   if(index === 0) {
-     fiber.child = newFiber
-   }else {
-     // 兄节点链接弟节点
-     prevSibling.sibling = newFiber
-   }

-   prevSibling = newFiber
-   index ++
- }
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber
  while(nextFiber) {
    if(nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
  return null
}
```
```js
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let prevSibling = null;

  while(index < elements.length) {
    const element = elements[index]
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: wipFiber,
      dom: null
    }
    
    // 父节点只链接第一个子节点
    if(index === 0) {
      wipFiber.child = newFiber
    }else {
      // 兄节点链接弟节点
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index ++
  }
}
```

3. 协调函数改造
```diff
  function reconcileChildren(wipFiber, elements) {
    let index = 0;
    // 上次渲染完成之后的 fiber 节点
+   let oldFiber = wipFiber.alternate && wipFiber.alternate.child
    let prevSibling = null;

+   while(index < elements.length || oldFiber != null) {
      const element = elements[index]
+     let newFiber = null
-     const newFiber = {
-       type: element.type,
-       props: element.props,
-       parent: wipFiber,
-       dom: null
-     }
      // 比较当前和上一次渲染的 type，即 DOM tag 'div'，
+     const sameType = oldFiber && element && element.type === oldFiber.type;
      
      // 父节点只链接第一个子节点
      if(index === 0) {
        wipFiber.child = newFiber
      }else {
        // 兄节点链接弟节点
        prevSibling.sibling = newFiber
      }

      prevSibling = newFiber
      index ++
    }
  }
```

4. 比较
```javascript
function render(element, container) {
  ...
  deletions = []
}
...

let deletions = null

function reconcileChildren(wipFiber, elements) {
  ...

  const sameType = oldFiber && element && element.type === oldFiber.type;
  // 比较规则
  // 同类型节点，只更新节点props
  // 不同类型节点且存在新的节点时，创建新的节点
  // 不同类型节点且存在旧的节点，移除旧的节点
  // 同类型节点，只更新节点props
  if(sameType) {
    newFiber = {
      type: oldFiber.type,
      props: element.props,
      dom: oldFiber.dom,  // 复用旧节点DOM
      parent: wipFiber,
      alternate: oldFiber,
      effectTag: "UPDATE",  // 新增属性，节点如何处理的标识 commit阶段使用
    }
  }

  // 不同类型节点且存在新的节点时，创建新的节点
  if(element && !sameType) {
    newFiber = {
      type: element.type,
      props: element.props,
      dom: null,
      parent: wipFiber,
      alternate: null,
      effectTag: "PLACEMENT"   // 标识需要添加新节点
    }
  }

  // 不同类型节点且存在旧的节点，移除旧的节点
  if(oldFiber && !sameType) {
    // 将如何处理标识添加到旧的节点上
    oldFiber.effectTag = "DELETION"
    // 当最后提交fiber树到DOM时，是从wipRoot开始的，
    // 此时没有上一次的fiber，所以需要一个数组来跟踪需要删除的节点
    deletions.push(oldFiber)
  }
}
```

5. 处理commit相关函数
```diff
function commitRoot() {
+ deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}

function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
- domParent.appendChild(fiber.dom)
// 如果是 PLACEMENT 标识，则新增节点
// 如果是 UPDATE ,则执行更新函数，新增 updateDom 函数
// 如果是 DELETION, 则删除节点
+ if (
+   fiber.effectTag === "PLACEMENT" &&
+   fiber.dom != null
+ ) {
+   domParent.appendChild(fiber.dom)
+ }else if(fiber.effectTag === "UPDATE" && fiber.dom != null) {
+   updateDom(fiber.dom, fiber.alternate.props, fiber.props)
+ }else if(fiber.effectTag === "DELETION") {
+   domParent.removeChild(fiber.dom)
+ }
​
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
```

6. 新增 **updateDom** 函数，用来做新老节点的 props 的 diff，实现事件的绑定

    1. 新增 updateDom 函数，对新旧节点属性做处理
    ```javascript
      const isProperty = key => key !== "children"
      const isNew = (prev, next) => key => prev[key] !== next[key]
      const isGone = (prev, next) => key => !(key in next)
      // 新增函数，更新 DOM 节点属性
      function updateDom(dom, prevProps, nextProps) {
        // 移除旧的属性
        Object.keys(prevProps)
          .filter(isProperty)
          .filter(isGone(prevProps, nextProps))
          .forEach(name => {
            dom[name] = ""
          })

        // 设置新的或者变化了的属性
        Object.keys(nextProps)
          .filter(isProperty)
          .filter(isNew(prevProps, nextProps))
          .forEach(name => {
            dom[name] = nextProps[name]
          })
      }
    ```
    2. 处理事件，对"on"开头的 props 做处理

    ```diff
    + const isEvent = key => key.startsWith("on")
    - const isProperty = key => key !== "children"
    + const isProperty = key => key !== "children" && !isEvent(key)
    + const isNew = (prev, next) => key => prev[key] !== next[key]
    + const isGone = (prev, next) => key => !(key in next)
    // 新增函数，更新 DOM 节点属性
    function updateDom(dom, prevProps, nextProps) {
      // 移除旧的或者改变了的事件
    + Object.keys(prevProps)
    +   .filter(isEvent)
    +   // 筛选出旧的event key 在新的 props 中没有或者在新 props 中有但是绑定的函数变更了的数据
    +   .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    +   .forEach(name => {
    +     const eventType = name.toLowerCase().substring(2)
    +     dom.removeEventListener(eventType, prevProps[name])
    +   })

      // 移除旧的属性
      Object.keys(prevProps)
        .filter(isProperty)
        .filter(isGone(prevProps, nextProps))
        .forEach(name => {
          dom[name] = ""
        })

      // 设置新的或者变化了的属性
      Object.keys(nextProps)
        .filter(isProperty)
        .filter(isNew(prevProps, nextProps))
        .forEach(name => {
          dom[name] = nextProps[name]
        })
      
      // 添加新的event
    + Object.keys(nextProps)
    +   .filter(isEvent)
    +   .filter(isNew(prevProps, nextProps))
    +   .forEach(name => {
    +     console.log(name, dom)
    +     const eventType = name.toLowerCase().substring(2)
    +     dom.addEventListener(eventType, nextProps[name])
    +   })
    }
    ```
    3. 修改createDom函数
    ```js
    function createDom(fiber) {
      const dom = fiber.type === TEXT_ELEMENT ? document.createTextNode("") : document.createElement(fiber.type)

      updateDom(dom, {}, fiber.props)

      return dom 
    }
    ```
## 七、函数组件

函数组件有两点不同:

- 函数组件的 ***fiber*** 节点没有对应的 DOM
- children 是从函数运行的结果来的，而不是直接从 props 中获取的

1. 在 **performUnitOfWork** 函数中判断是否函数组件
```javascript
function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }
  if(!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  reconcileChildren(fiber, fiber.props.children)
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}
// 新增函数，处理函数组件
function updateFuctionComponent(fiber) {
  // 函数组件的DOM是函数的返回值
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}
// 新增函数，处理原生标签组件
function updateHostComponent(fiber) {
  if(!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  reconcileChildren(fiber, fiber.props.children)
} 
```
2. 由于现在有了没有 DOM 的 fiber,所以我们需要在 commitWork 函数中做处理

```javascript
function commitWork(fiber) {
  if(!fiber) {
    return
  }
  let domParentFiber = fiber.parent

  // 由于function组件是没有dom的，所以需要遍历查找最外层的有dom节点的parentFiber
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent
  }
  const domParent = domParentFiber.dom
  if(fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom)
  }else if(fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props)
  }else if(fiber.effectTag === "DELETION") {
    // domParent.removeChild(fiber.dom)
    commitDeletion(fiber, domParent)
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
// 新增函数，递归找到有节点的fiber，进行移除操作
function commitDeletion(fiber, domParent) {
  if(fiber.dom) {
    domParent.removeChild(fiber.dom)
  }else {
    commitDeletion(fiber.child, domParent)
  }
}
```

## 八、Hooks