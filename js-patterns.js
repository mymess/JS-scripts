/////////
// SINGLETON/NAMESPACE: closure con anonymous function
///////
var counter = (function() {
  // private 
  var privateCounter = 0;

  function changeBy(val) {
    privateCounter += val;
  }

  //
  return {
    increment: function() {
      changeBy(1);
    },
    decrement: function() {
      changeBy(-1);
    },
    value: function() {
      return privateCounter;
    }
  };   
})();

console.log(counter.value()); // logs 0
counter.increment();
counter.increment();
console.log(counter.value()); // logs 2
counter.decrement();
console.log(counter.value()); // logs 1


/////////
// CLASES:
/////////

var makeCounter = function() {
  //private  
  var privateCounter = 0;

  //private method
  function changeBy(val) {
    privateCounter += val;
  }
  //public methods
  return {
    increment: function() {
      changeBy(1);
    },
    decrement: function() {
      changeBy(-1);
    },
    value: function() {
      return privateCounter;
    }
  }  
};

var counter1 = makeCounter();
var counter2 = makeCounter();
alert(counter1.value()); /* Alerts 0 */
counter1.increment();
counter1.increment();
alert(counter1.value()); /* Alerts 2 */
counter1.decrement();
alert(counter1.value()); /* Alerts 1 */
alert(counter2.value()); /* Alerts 0 */




//
function MyObject(name, message) {
  this.name = name.toString();
  this.message = message.toString();
}

MyObject.prototype.getName = function() {
  return this.name;
};
MyObject.prototype.getMessage = function() {
  return this.message;
};



function MyObject(name, message) {
    this.name = name.toString();
    this.message = message.toString();
}

(function() {
    this.getName = function() {
        return this.name;
    };
    this.getMessage = function() {
        return this.message;
    };
}).call(MyObject.prototype);



let arr = [3, 5, 7];
arr.foo = "hello";


//itera sobre índices/claves
for (let i in arr) {
   console.log(i); // logs "0", "1", "2", "foo"
}

//itera sobre valores 
for (let i of arr) {
   console.log(i); // logs "3", "5", "7"
}


let arr = [3, 5, 7];
arr.foo = "hello";

arr.forEach(function (element, index) {
    console.log(element); // logs "3", "5", "7"
    console.log(index);   // logs "0", "1", "2"
});

