
var GAMEPAD = function () { 
	var me = this;
	me.controllers = [];

	window.addEventListener("gamepadconnected", function(e){ me.connecthandler(e); });
	window.addEventListener("gamepaddisconnected", function(e) { me.disconnecthandler(e); });

	me.addGamepad = function( gamepad ){		
		//requestAnimationFrame( me.updateStatus );
	};
	
	

	me.scanGamepads = function() {
  		var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
		for (var i = 0; i < gamepads.length; i++) {
			if (gamepads[i]) {
			  if (gamepads[i].index in me.controllers) {			  	
			    me.controllers[gamepads[i].index] = gamepads[i];
			  } else {      	
			  	me.addgamepad( gamepads[i] );			    
			  }
			}
		}
	};

	me.disconnecthandler=function(e) {
  		me.removeGamepad(e.gamepad);
  	}

  	me.updateStatus = function() {	  
	  me.scanGamepads();

	  var i = 0;
	  var j;

	  console.log(" num controllers " + controllers.length );

	  for (j in me.controllers) {
	    var controller = me.controllers[j];

	    for (i = 0; i < controller.buttons.length; i++) {	      

	      var val = controller.buttons[i];
	      var pressed = val == 1.0;
	      if (typeof(val) == "object") {
	      	controller.buttons[i].pressed = val.pressed;  
	        pressed = val.pressed;
	        val = val.value;
	      }


	      if (pressed) {
	        console.log("button %d pressed", i);
	      } 
	    }

	    var axes = d.getElementsByClassName("axis");
	    for (i = 0; i < controller.axes.length; i++) {
	      console.log( "axis %d: %d", i, controller.axes[i] );
	    }
	  }

	  requestAnimationFrame( me.updateStatus );	  	  
	}

	me.getRight_xAxis=function(){
		return me.controllers[0].axes[ 3 ];
	}

	setInterval(me.scanGamepads, 500);
};


//var gamepad = new GAMEPAD();





/*
var Person = function (firstName) {
  this.firstName = firstName;
};

Person.prototype.sayHello = function() {
  console.log("Hello, I'm " + this.firstName);
};

var person1 = new Person("Alice");


Person.prototype.repeatHello = (function(e){
	console.log("I just said ");
	this.sayHello();	
}).bind(Person);


person1.sayHello();
person1.repeatHello();

//document.addEventListener("keydown", person1.repeatHello, true);
*/