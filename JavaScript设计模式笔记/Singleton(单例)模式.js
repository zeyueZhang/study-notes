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