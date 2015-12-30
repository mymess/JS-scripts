String.prototype.format = function() {
    var formatted = this;       
    for (var i = 0; i < arguments.length; i++) {    	
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');		
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};


var GP = GP || {}
/*
GP = {
	 init: function(event){
	 	this.gamepad = event.gamepad;
	 	var logger = new WEBLOGGER();
		logger.log("Gamepad connected at index {0}: {1}. {2} buttons, {3} axes.".format(this.gamepad.index, this.gamepad.id, this.gamepad.buttons.length, this.gamepad.axes.length));
		

		var gamepads = navigator.getGamepads();
		logger.log(" gamepads ", gamepads);
 
		for(var i = 0; i<gamepads; ++i){
	  		gp = gamepads[i];
	  		if(gp !== undefined){
				logger.log("Gamepad connected at index {0}: {1}. {2} buttons, {3} axes.".format(gp.index, gp.id, gp.buttons.length, gp.axes.length));
			}
	  	}


	 },


	 close: function(event){
	 	delete this.gamepad;
	 }
}


function gamepadHandler(event, connecting) {
  	var gamepad = event.gamepad;
  	// Note:
  	// gamepad === navigator.getGamepads()[gamepad.index]
	var logger = new WEBLOGGER();

	logger.log("Gamepad connected at index {0}: {1}. {2} buttons, {3} axes.".format(gamepad.index, gamepad.id, gamepad.buttons.length, gamepad.axes.length));

	
	logger.log( "En el handler ");
	var gamepads = navigator.getGamepads();
	logger.log(" gamepads ", gamepads);
 
	for(var i = 0; i<gamepads; ++i){
  		gp = gamepads[i];
  		if(gp !== undefined){
			logger.log("Gamepad connected at index {0}: {1}. {2} buttons, {3} axes.".format(gp.index, gp.id, gp.buttons.length, gp.axes.length));
		}
  	}
	GP = navigator.getGamepads()[event.gamepad.index];

  	

  	

  if (connecting) {
    gamepads[gamepad.index] = gamepad;

  } else {
    delete gamepads[gamepad.index];
  }
}


window.addEventListener("gamepadconnected", function(e) { GP.init(e); }, false);
window.addEventListener("gamepaddisconnected", function(e) { GP.close(e); }, false);



$(document).ready(function(){
	
	var logger = new WEBLOGGER();
	
	logger.log( "Ready");
	
	
	
});
*/

//model.update();
//model.log();
//console.log( "Hola {0}, {1}".format("joan", "qué tal?") );

var GAMEPAD = function () { };

GAMEPAD.prototype.addgamepad = (function(gamepad) {
	this.controllers[gamepad.index] = gamepad;

	var d = document.createElement("div");
	d.setAttribute("id", "controller" + gamepad.index);

	var t = document.createElement("h1");
	t.appendChild(document.createTextNode("gamepad: " + gamepad.id));
	d.appendChild(t);

	var b = document.createElement("div");
	b.className = "buttons";
	for (var i = 0; i < gamepad.buttons.length; i++) {
		var e = document.createElement("span");
		e.className = "button";
		//e.id = "b" + i;
		e.innerHTML = i;
		b.appendChild(e);
	}

	d.appendChild(b);

	var a = document.createElement("div");
	a.className = "axes";

	for (var i = 0; i < gamepad.axes.length; i++) {
		var p = document.createElement("progress");
		p.className = "axis";
		//p.id = "a" + i;
		p.setAttribute("max", "2");
		p.setAttribute("value", "1");
		p.innerHTML = i;
		a.appendChild(p);
	}

	d.appendChild(a);

	// See https://github.com/luser/gamepadtest/blob/master/index.html
	var start = document.getElementById("start");
	if (start) {
		start.style.display = "none";
	}

	document.body.appendChild(d);
	requestAnimationFrame(this.updateStatus );
}).bind(GAMEPAD.prototype)


GAMEPAD.prototype.disconnecthandler=function(e) {
  	this.removegamepad(e.gamepad);
}.bind( GAMEPAD.prototype );

GAMEPAD.prototype.removegamepad = (function(gamepad){
	  var d = document.getElementById("controller" + gamepad.index);
	  document.body.removeChild(d);
	  delete this.controllers[gamepad.index];
}).bind(GAMEPAD.prototype)

GAMEPAD.prototype.connecthandler  = (function(e) {  
  	this.addgamepad( e.gamepad );
}).bind(GAMEPAD.prototype)

GAMEPAD.prototype.controllers = {}

GAMEPAD.prototype.scangamepads = (function() {
  
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);

  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (gamepads[i].index in this.controllers) {
      	
        this.controllers[gamepads[i].index] = gamepads[i];
      } else {      	
      	this.addgamepad( gamepads[i] );
        //this.addgamepad(  );
      }
    }
  }
}).bind(GAMEPAD.prototype);




GAMEPAD.prototype.updateStatus = (function() {
	  
	  this.scangamepads();
	  

	  var i = 0;
	  var j;

	  for (j in this.controllers) {
	    var controller = this.controllers[j];
	    var d = document.getElementById("controller" + j);
	    var buttons = d.getElementsByClassName("button");

	    for (i = 0; i < controller.buttons.length; i++) {
	      var b = buttons[i];
	      var val = controller.buttons[i];
	      var pressed = val == 1.0;
	      if (typeof(val) == "object") {
	        pressed = val.pressed;
	        val = val.value;
	      }

	      var pct = Math.round(val * 100) + "%";
	      b.style.backgroundSize = pct + " " + pct;

	      if (pressed) {
	        b.className = "button pressed";
	      } else {
	        b.className = "button";
	      }
	    }

	    var axes = d.getElementsByClassName("axis");
	    for (i = 0; i < controller.axes.length; i++) {
	      var a = axes[i];
	      a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
	      a.setAttribute("value", controller.axes[i] + 1);
	    }
	  }

	  requestAnimationFrame( this.updateStatus );	  

	  
}).bind(GAMEPAD.prototype);


var gamepad = new GAMEPAD();


window.addEventListener("gamepadconnected", function(e){ gamepad.connecthandler(e);} );
window.addEventListener("gamepaddisconnected", function(e) {gamepad.disconnecthandler(e); });


setInterval(gamepad.scangamepads, 500);

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