## class
面向对象的实现
- constructor
- 属性
- 方法

```js
class Student {
  constructor(name, score) {
    this.name = name
    this.score = score
  }

  sayHi() {
    console.log(`姓名${this.name},分数${this.score}`)
  }
}

const zeyue = new Student("zeyue", 100)
```

- 继承
```js
// 父类
class People {
  constructor(name) {
    this.name = name
  }

  eat() {
    console.log(`${this.name} eat something`)
  }
}

// 子类
class Student extends People {
  constructor(name, score) {
    super(name)
    this.score = score
  }

  sayHi() {
    console.log(`姓名${this.name},分数${this.score}`)
  }
}

const zeyue = new Student("zeyue", 100)
zeyue.eat()
```
