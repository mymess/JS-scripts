
//TODO: rename to GamepadManager and refactor to allow multi-player input handling.

var GAMEPAD = function () { 
	var me = this;
	me.controllers = {};

	//these mappings are vendor dependent
	me.buttons = { X: 0, A: 1, B: 2, Y: 3, LB: 4, RB: 5, LT: 6, RT: 7, BACK: 8, START: 9, 
				   LEFT_JOYSTICK_PUSH: 10, RIGHT_JOYSTICK_PUSH: 11, LEFT_JOYSTICK_UP: 12, 
				   LEFT_JOYSTICK_DOWN: 13, LEFT_JOYSTICK_LEFT: 14, LEFT_JOYSTICK_RIGHT: 15 };
	
	me.axes = {CROSS_X: 1, CROSS_Y: 2, RIGHT_JOYSTICK_X: 3, RIGHT_JOYSTICK_Y: 4};

	window.addEventListener("gamepadconnected", function(e){ me.connectHandler(e); });
	window.addEventListener("gamepaddisconnected", function(e) { me.disconnectHandler(e); });

	me.addGamepad = function( gamepad ){	
		console.log("Adding gamepad to controllers index %d ", gamepad.index);
		me.controllers[gamepad.index] = gamepad;
	};
	
	me.connectHandler = function(gamepad){
		me.scanGamepads();		
	}	

	me.scanGamepads = function() {
  		var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
		console.log ("There are %d gamepads detected.", gamepads.length );
		  
		if( gamepads.length == 0 ){
		  console.log ("Connect one AND press any button to detect it." );
		}

		for (var i = 0; i < gamepads.length; i++) {
			if (gamepads[i]) {
			  if (gamepads[i].index in me.controllers) {			  	
			    me.controllers[gamepads[i].index] = gamepads[i];		
			    console.log( "Added gamepad %d to controller index %d", gamepads[i].index, i);	    
			  } else {      	
			  	me.addGamepad( gamepads[i] );			    
			  }
			}
		}
	};

	me.disconnectHandler=function(e) {
  		me.removeGamepad(e.gamepad);
  	}

  	me.removegamepad = function(gamepad) {
 		 delete controllers[gamepad.index];
	}
  	me.updateStatus = function() {	  
	  //me.scanGamepads();

	  var i = 0;
	  var j;

	  //console.log(" num controllers " + controllers.length );

	  for (var j=0; j< me.controllers.length; j++) {
	    var controller = me.controllers[j];

	    //buttons
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
	    
	    //axes
	    for (i = 0; i < controller.axes.length; i++) {
	      console.log( "axis %d: %d", i, controller.axes[i] );
	    }
	  }

	  requestAnimationFrame( me.updateStatus );	  	  
	}



	me.isButtonPressed = function ( button ){
		if( me.controllers[0] === undefined ){
			return;
		}
		if( !me.buttons.hasOwnProperty( button ) ){
			return;
		}		
		return me.controllers[0].buttons[ me.buttons[button] ].pressed;
	}

	me.getPressedButtons = function( ){
		var ret = []
		for( var b in me.buttons){			
			if( me.isButtonPressed(b) ){
				ret.push( b )
			}
		}
		return ret;
	}

	me.logPressedButtons = function(){
		var pressedButtons = me.getPressedButtons();		
		var s = pressedButtons.length==0? 'No pressed buttons.': pressedButtons;
		console.log( s );
	}


	me.getRight_xAxis = function(){
		if( me.controllers[0] === undefined ){
			return;
		}

		return me.controllers[0].axes[ me.axes.RIGHT_JOYSTICK_X ];
	}

	me.getRight_yAxis = function() {
		if( me.controllers[0] === undefined ){
			return;
		}
		return me.controllers[0].axes[ me.axes.RIGHT_JOYSTICK_Y ];			
	}

	me.getCross_xAxis = function(){
		if( me.controllers[0] === undefined ){
			return;
		}
		return me.controllers[0].axes[ me.axes.CROSS_X ];			
	}

	me.getCross_yAxis = function(){
		if( me.controllers[0] === undefined ){
			return;
		}
		return me.controllers[0].axes[ me.axes.CROSS_Y ];				
	}


	me.scanGamepads();
	setInterval(me.updateStatus, 500);
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