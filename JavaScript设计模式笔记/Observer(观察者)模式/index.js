/**
 * 模拟目标依赖Observer
 */
function ObserverList() {
  this.observerList = [];
}

ObserverList.prototype.Add = function(obj) {
  return this.observerList.push(obj);
}

ObserverList.prototype.Empty = function() {
  this.observerList = []
}

ObserverList.prototype.Count = function() {
  return this.observerList.length
}

ObserverList.prototype.Get = function(index) {
  if(index > -1 && index < this.observerList.length) {
    return this.observerList[index]
  }
}

ObserverList.prototype.Insert = function(obj, index) {
  var pointer = -1
  if(index === 0) {
    this.observerList.unshift(obj)
    pointer = index
  }else if(index === this.observerList.length) {
    this.observerList.push(obj)
    pointer = index
  }
  return pointer
}

ObserverList.prototype.IndexOf = function(obj, startIndex) {
  var i = startIndex, 
    pointer = -1;
  while (i < this.observerList.length) {
    if(this.observerList[i] === obj) {
      pointer = i
    }
    i++;
  }
  return pointer
}

ObserverList.prototype.RemoveIndexAt = function(indeex) {
  if(index === 0) {
    this.observerList.shift()
  }else if(index === this.observerList.length - 1) {
    this.observerList.pop()
  }
}

function extend(obj, extension) {
  for(var key in obj) {
    extension[key] = obj[key]
  }
}

/**
 * 模拟目标（Subject）和在观察者列表添加、删除或通知观察者的能力
 */
function Subject() {
  this.observers = new ObserverList()
}

Subject.prototype.AddObserver = function(observer) {
  this.observers.Add(observer)
}

Subject.prototype.RemoveObserver = function(observer) {
  this.observers.RemoveIndexAt(this.observers.IndexOf(observer, 0))
}

Subject.prototype.Notify = function(context) {
  var observerCount = this.observers.Count()
  for(var i = 0; i < observerCount; i++) {
    this.observers.Get(i).Update(context)
  }
}

/**
 * 创建新的Observer;定义Update功能
 */
function Observer() {
  this.Update = function() {
    
  }
}