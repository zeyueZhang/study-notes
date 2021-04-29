
const TEXT_ELEMENT = "TEXT_ELEMENT"
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => typeof child === "object"  ? child : createTextElement(child))
    }
  }
}

function createTextElement(text) {
  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function createDom(fiber) {
  const dom = fiber.type === TEXT_ELEMENT ? document.createTextNode("") : document.createElement(fiber.type)

  updateDom(dom, {}, fiber.props)

  return dom 
}

const isEvent = key => key.startsWith("on")
const isProperty = key => key !== "children" && !isEvent(key)
const isNew = (prev, next) => key => prev[key] !== next[key]
const isGone = (prev, next) => key => !(key in next)
// 新增函数，更新 DOM 节点属性
function updateDom(dom, prevProps, nextProps) {
  // 移除旧的或者改变了的事件
  Object.keys(prevProps)
    .filter(isEvent)
    // 筛选出旧的event key 在新的 props 中没有或者在新 props 中有但是绑定的函数变更了的数据
    .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.removeEventListener(eventType, prevProps[name])
    })

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
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      console.log(name, dom)
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, nextProps[name])
    })
}

function commitRoot() {
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}

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
    commitDeletion(fiber, domParent)
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

// 递归找到有节点的fiber，进行移除操作
function commitDeletion(fiber, domParent) {
  if(fiber.dom) {
    domParent.removeChild(fiber.dom)
  }else {
    commitDeletion(fiber.child, domParent)
  }
}

function render(element, container) {

  // 创建根 fiber，并设置为下一次的单元任务
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    alternate: currentRoot
  }
  deletions = []
  nextUnitOfWork = wipRoot
}

let nextUnitOfWork = null
let currentRoot = null
let wipRoot = null
let deletions = null

function workLoop(deadline) {
  let shouldYield = false
  while(nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    // 回调函数入参 deadline 可以告诉我们在这个渲染周期还剩多少时间可用
    // 剩余时间小于1毫秒就退出回调，等待浏览器再次空闲
    shouldYield = deadline.timeRemaining() < 1
  }
  if(!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

// 注意，这个函数执行完本次单元任务之后要返回下一个单元任务
function performUnitOfWork(fiber) {
  // 判断是否是函数组件
  const isFunctionComponent = fiber.type instanceof Function
  if(isFunctionComponent) {
    updateFuctionComponent(fiber)
  }else {
    updateHostComponent(fiber)
  }
  
  // 返回下一个任务单元（fiber）
  // 有子节点直接返回
  if (fiber.child) {
    return fiber.child;
  }

  // 没有子节点则查找兄弟节点，兄弟节点也没有找父节点的兄弟节点
  // 循环遍历直至找到为止
  let nextFiber = fiber
  while(nextFiber) {
    if(nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
  return null
}

let wipFiber = null
let hookIndex = null

function updateFuctionComponent(fiber) {
  // 更新中的 fiber 节点
  wipFiber = fiber
  // 重置 hook 索引
  hookIndex = 0
  // 新增 hooks 数组，用来支持同一个组件多次调用 useState
  wipFiber.hooks = []
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}

function useState(initial) {
  const oldHook = wipFiber.alternate && wipFiber.alternate.hooks && wipFiber.alternate.hooks[hookIndex]
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  }

  const actions = oldHook ? oldHook.queue : []
  actions.forEach(action => {
    hook.state = action(hook.state)
  })

  const setState = action => {
    hook.queue.push(action)
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot
    }
    nextUnitOfWork = wipRoot
    deletions = []
  }

  wipFiber.hooks.push(hook)
  hookIndex++
  return [hook.state, setState]
}

function updateHostComponent(fiber) {
  if(!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  reconcileChildren(fiber, fiber.props.children)
}

function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child
  let prevSibling = null;

  while(index < elements.length || oldFiber != null) {
    const element = elements[index]
    let newFiber = null

    // 判断是否同类型节点
    const sameType = oldFiber && element && element.type === oldFiber.type

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

    if(oldFiber) {
      // 同步更新下一个旧 fiber 节点
      oldFiber = oldFiber.sibling
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

const OwnReact = {
  render,
  createElement,
  useState
}
let count = 0
const handleH1Click = () => {
  count ++
  console.log(count)
}

/** @jsx OwnReact.createElement */
function Counter() {
  const [state, setState] = OwnReact.useState(1)
  return <h1 onClick={() => setState(c => c + 1)}> Count: { state } </h1>
}
// function App(props) {
//   return <div title="包含子节点">
//   <h1 onClick={handleH1Click}>我是子节点h1
//     <br/>
//     <span>{count}</span>
//   </h1>
//   <h2>我是子节点h2</h2>
// </div>
// }
// const ownElement = <App name="foo" />
const element = <Counter/>

OwnReact.render(element, document.getElementById('root'))


// const container = document.getElementById("root");
// const updateValue = e => {
//   count ++
//   rerender(count);
// };

// const rerender = value => {
//   const element = (
//     <div title="包含子节点">
//       <h1 onClick={updateValue}>我是子节点h1
//         <br/>
//         <span>{count}</span>
//       </h1>
//       <h2>我是子节点h2</h2>
//     </div>
//   );
//   OwnReact.render(element, container);
// };

// rerender(count);
