# JavaScript 设计模式

## 设计模式

### Singleton（单例）模式

[代码](./Singleton(单例)模式.js)

**Singleton**模式限制了类的实例化次数只能一次：在该实例不存在时，通过方法创建一个类来实现创建类的新实例；如果实例已经存在，则会简单返回该实例对象的引用。

**Singleton**模式创建了一个闭包函数，通过闭包的方式将实例赋值给作用域内的变量，从而将实例保存在该闭包作用域内。获取时通过检测该变量是否有值，来控制是否初始化实例。

在 **JavaScript** 中，**Singleton** 充当共享资源命名空间，从全局命名空间中隔离出代码实现，从而为函数提供单一访问点。

```javascript
const mySingleton = (function () {
  let instance = null;
  function init() {
    function privateMethod() {
      console.log("I am private")
    }
    const privateVariable = "Im also private"
    const privateRandomNumber = Math.random()
    return {
      publicMethod: function () {
        console.log("the public can see me!")
      },
      publicProperty: "Im also public",
      getRandomNumber: function () {
        return privateRandomNumber
      }
    }
  }
  return {
    getInstance: function() {
      // 获取 Singleton 的实例，如果存在就返回，不存在就创建新实例
      if(!instance) {
        instance = init()
      }
      return instance
    }
  }
})()

const singleA = mySingleton.getInstance();
const singleB = mySingleton.getInstance();
console.log(singleA.getRandomNumber() === singleB.getRandomNumber()) // true
```

**应用场景**

- 当类只能有一个实例且客户可以从一个从所周知的访问点访问它
- 该唯一的实例应该是通过子类化可扩展的，并且客户应该无需更改代码就能使用一个扩展的实例

**缺陷**

- 测试困难
- 增加底层依赖的难度

### Observer（观察者）模式

[代码](./Observer(观察者)模式/index.js)

​	**Observer** 是一种设计模式，其中，一个对象（称为subject）维持一系列依赖于它（观察者）的对象，将有关状态的任何变更自动通知给它们。

- ***Subject（目标）***

  维护一系列的观察者，方便添加或删除观察者

- ***Observer（观察者）***

  为那些在目标状态发生改变时需获得通知的对象提供一个更新接口

- ***ConcreteSubject（具体目标）***

  状态发生改变时，向 **Observer** 发出通知，储存 **ConcreteObserver** 的状态

- ***ConcreteObserver（具体观察者）***

  存储一个指向 **ConcreteSubject** 的引用，实现 **Observer** 的更新接口，以使自身状态与目标的状态保持一致

