String.prototype.format = function() {
    var formatted = this;       
    for (var i = 0; i < arguments.length; i++) {    	
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');		
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};


//model.update();
//model.log();
//console.log( "Hola {0}, {1}".format("joan", "qué tal?") );

var Tester = function () { };

Tester.prototype.addgamepad = (function(gamepad) {
	console.log("Adding gamepad to controllers index %d ", gamepad.index)

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
}).bind(Tester.prototype)


Tester.prototype.disconnecthandler=function(e) {
  	this.removegamepad(e.gamepad);
}.bind( Tester.prototype );

Tester.prototype.removegamepad = (function(gamepad){
	  var d = document.getElementById("controller" + gamepad.index);
	  document.body.removeChild(d);
	  delete this.controllers[gamepad.index];
}).bind(Tester.prototype)

Tester.prototype.connecthandler  = (function(e) {  
  	this.addgamepad( e.gamepad );
}).bind(Tester.prototype)

Tester.prototype.controllers = {}

Tester.prototype.scangamepads = (function() {
  
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  console.log (" There are %d gamepads detected.", gamepads.length );
  
  if( gamepads.length == 0 ){
  	console.log ("Connect it AND press any button to detect it." );
  }

  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (gamepads[i].index in this.controllers) {
      	
      	console.log ( "adding gamepad %d to controllers index %d", i, gamepads[i].index);

        this.controllers[gamepads[i].index] = gamepads[i];
      } else {      	
      	this.addgamepad( gamepads[i] );
        //this.addgamepad(  );
      }
    }
  }
}).bind(Tester.prototype);




Tester.prototype.updateStatus = (function() {
	  
	  //this.scangamepads();
	  

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

	  
}).bind(Tester.prototype);


var tester = new Tester();


window.addEventListener("gamepadconnected", function(e){ tester.connecthandler(e);} );
window.addEventListener("gamepaddisconnected", function(e) {tester.disconnecthandler(e); });


//setInterval(tester.scangamepads, 500);
tester.scangamepads();

setInterval(tester.updateStatus, 500);

/*
var Person = function (firstName) {
  this.firstName = firstName;
  var scope = this;
  this.sayHello = function(){
  	console.log("Hello, I'm " + this.firstName);	
  }

  this.repeatHello = function(){
  	console.log("I just said ");
	scope.sayHello();	
  }

};




Person.prototype.sayHello = function() {
  console.log("Hello, I'm " + this.firstName);
};

Person.prototype.repeatHello = (function(e){
	console.log("I just said ");
	this.sayHello();	
}).bind(Person);

var person1 = new Person("Alice");
var person2 = new Person("Joan");


person1.sayHello();
person1.repeatHello();
person2.sayHello();
person2.repeatHello();

document.addEventListener("keydown", person1.repeatHello, true);
*/