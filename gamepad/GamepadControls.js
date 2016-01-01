/**
 * Gamepad controls to achieve a chase camera
 * @author joandelason / http://www.tothemoonlabs.com
 */

THREE.GamepadControls = function ( object, domElement, targetObject ) {

	var scope = this;

	this.object = object;	//camera
	this.targetObject = targetObject;  //targetObject
	this.targetObject.name = 'target'
	

	this.target = targetObject.position;

	this.controllers = {}; //contains all connected devices. Will only use the first one
	
	//unfortunately these mappings are gamepad vendor dependent, so check and update them before playing
	this.buttons = { X: 0, A: 1, B: 2, Y: 3, LB: 4, RB: 5, LT: 6, RT: 7, BACK: 8, START: 9, 
				   LEFT_JOYSTICK_PUSH: 10, RIGHT_JOYSTICK_PUSH: 11, LEFT_JOYSTICK_UP: 12, 
				   LEFT_JOYSTICK_DOWN: 13, LEFT_JOYSTICK_LEFT: 14, LEFT_JOYSTICK_RIGHT: 15 };
	
	this.axes = {CROSS_X: 1, CROSS_Y: 2, RIGHT_JOYSTICK_X: 3, RIGHT_JOYSTICK_Y: 4};


	//
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.enabled = true;

	this.movementSpeed = 1.0;
	this.thrust = 0.0;
	this.thrustDelta = 5.0; 	
	this.maxThrust = 100.0;
	this.maxSpeed = 100.0;

	this.pitch = 0;
	this.roll = 0;
	this.yaw = 0;

	this.lookSpeed = 0.005;

	this.lookVertical = true;
	this.autoForward = false;

	this.activeLook = true;

	this.heightSpeed = false;
	this.heightCoef = 1.0;
	this.heightMin = 0.0;
	this.heightMax = 1.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.autoSpeedFactor = 0.0;


	this.lat = 0;
	this.lon = 0;
	this.phi = 0;
	this.theta = 0;

	this.moveForward = false;
	this.moveBackward = false;

	this.rotateLeft = false;
	this.rotateRight = false;


	this.viewHalfX = 0;
	this.viewHalfY = 0;

	if ( this.domElement !== document ) {

		this.domElement.setAttribute( 'tabindex', - 1 );

	}
	/*
	this.calculateTargetCentroid = (function ( ) {
		console.log( targetObject );

		dae.traverse( function ( child ) {

		}
		var geometry = scope.targetObject;

		geometry.centroid = new THREE.Vector3();

		for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {

		    geometry.centroid.addSelf( geometry.vertices[ i ].position );

		} 

		geometry.centroid.divideScalar( geometry.vertices.length );
	})();
	*/

	this.addGamepad = function( gamepad ){	
		console.log("Adding gamepad to controllers index %d ", gamepad.index);
		scope.controllers[gamepad.index] = gamepad;
	};
	
	this.connectHandler = function(gamepad){
		scope.scanGamepads();		
	}	

	this.scanGamepads = function() {
  		var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
		console.log ("There are %d gamepads detected.", gamepads.length );
		  
		if( gamepads.length == 0 ){
		  console.log ("Connect one AND press any button to detect it." );
		}

		for (var i = 0; i < gamepads.length; i++) {
			if (gamepads[i]) {
			  if (gamepads[i].index in scope.controllers) {			  	
			    scope.controllers[gamepads[i].index] = gamepads[i];		
			    console.log( "Added gamepad %d to controller index %d", gamepads[i].index, i);	    
			  } else {      	
			  	scope.addGamepad( gamepads[i] );			    
			  }
			}
		}
	};

	this.disconnectHandler=function(e) {
		console.log( "Disconnecting gamepad " + e.gamepad.index);
  		this.removeGamepad(e.gamepad);
  	}

	this.removegamepad = function(gamepad) {
 		 delete controllers[gamepad.index];
	}

  	this.updateStatus = function() {	  
	  //me.scanGamepads();
	  this.lastState = this.currentState;
	  var i = 0;
	  var j;

	  /*
	  if( this.controllers.length > 0){
	  	var controller = this.controllers[0];
	  	this.currentState.pressedButtons = this.getPressedButtons();
	  }*/

	  //console.log(" num controllers " + controllers.length );

	  for (var j=0; j< this.controllers.length; j++) {
	    var controller = this.controllers[j];

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
	  
	}



	this.isButtonPressed = function ( button ){
		if( !scope.controllers[0] ){
			console.log( "No gamepad connected at index 0. Controllers " + scope.controllers[0] );
			return;
		}
		if( !scope.buttons.hasOwnProperty( button ) ){
			console.log( "No button named '" + button +"'" );
			return;
		}		
		return scope.controllers[0].buttons[ scope.buttons[button] ].pressed;
	}

	this.getButtonsMap = function(){
		var ret = {} ;
		for( var b in scope.buttons ){			
			if( scope.isButtonPressed(b) ){
				ret[b] = true; 
			}else{
				ret[b] = false;
			}
		}
		return ret;
	}


	this.getPressedButtons = function( ){
		var ret = []
		for( var b in scope.buttons){			
			if( scope.isButtonPressed(b) ){
				ret.push( b )
			}
		}
		return ret;
	}

	this.logPressedButtons = function(){
		var pressedButtons = scope.getPressedButtons();		
		var s = pressedButtons.length==0? 'No pressed buttons.': pressedButtons;
		console.log( s );
	}


	this.getRight_xAxis = function(){
		if( scope.controllers[0] === undefined ){
			return;
		}

		return scope.controllers[0].axes[ scope.axes.RIGHT_JOYSTICK_X ];
	}

	this.getRight_yAxis = function() {
		if( scope.controllers[0] === undefined ){
			return;
		}
		return scope.controllers[0].axes[ scope.axes.RIGHT_JOYSTICK_Y ];			
	}

	this.getCross_xAxis = function(){
		if( scope.controllers[0] === undefined ){
			return;
		}
		return scope.controllers[0].axes[ scope.axes.CROSS_X ];			
	}

	this.getCross_yAxis = function(){
		if( scope.controllers[0] === undefined ){
			return;
		}
		return scope.controllers[0].axes[ scope.axes.CROSS_Y ];				
	}


	//

	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;

		} else {

			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;

		}

	};

	this.update = function( delta ) {

		if ( scope.enabled === false ) return;


		scope.updateStatus();

		//console.log ( "RT pressed --> " + this.isButtonPressed( "RT" ) );

		var pressed = scope.getButtonsMap();

		// SPEED
		if( pressed["RT"]  && scope.thrust < scope.maxThrust){
			scope.thrust += scope.thrustDelta; 

		}else if( pressed["RB"] && scope.thrust> -100){
			scope.thrust -= scope.thrustDelta; 
			if( scope.thrust <-100 ){
				scope.thrust = -100.0;
			}
		}

		if( scope.movementSpeed<scope.maxSpeed && pressed["RT"] ){
			if( scope.movementSpeed + scope.thrustDelta< scope.maxSpeed){
				scope.movementSpeed += scope.thrustDelta;
			}else{
				scope.movementSpeed = scope.maxSpeed;
			}
			
		}

		if( scope.movementSpeed>0.0 && pressed["RB"] ){
			if( scope.movementSpeed - scope.thrustDelta>0.0){
				scope.movementSpeed -= scope.thrustDelta;
			}else{
				scope.movementSpeed = 0.0;
			}
		}


		//console.log( "Speed: " + scope.movementSpeed );
		//console.log( "Thrust: " + scope.thrust );



		//ROTATION
		var rollSpeed = scope.getCross_yAxis();
		var pitchSpeed = scope.getCross_xAxis();



		//console.log( "Pitch: " + pitch );
		//console.log( "Roll: " + rollSpeed );		

		if ( scope.heightSpeed ) {

			var y = THREE.Math.clamp( this.object.position.y, this.heightMin, this.heightMax );
			var heightDelta = y - this.heightMin;

			this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

		} else {

			this.autoSpeedFactor = 0.0;

		}

		var actualMoveSpeed = delta * scope.movementSpeed;
		//console.log("actualMoveSpeed: " + actualMoveSpeed );


		if ( this.moveForward || ( this.autoForward && ! this.moveBackward ) ) this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
		if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );

		if ( this.rotateLeft ) this.object.translateX( - actualMoveSpeed );
		if ( this.rotateRight ) this.object.translateX( actualMoveSpeed );

		if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
		if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );

		var actualLookSpeed = delta * this.lookSpeed;

		if ( ! this.activeLook ) {

			actualLookSpeed = 0;

		}

		var verticalLookRatio = 1;

		if ( this.constrainVertical ) {

			verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

		}

		this.lon += this.mouseX * actualLookSpeed;
		if ( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

		this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
		this.phi = THREE.Math.degToRad( 90 - this.lat );

		this.theta = THREE.Math.degToRad( this.lon );

		if ( this.constrainVertical ) {

			this.phi = THREE.Math.mapLinear( this.phi, 0, Math.PI, this.verticalMin, this.verticalMax );

		}

		var targetPosition = scope.target,
			position = this.object.position;
		/*
		targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
		targetPosition.y = position.y + 100 * Math.cos( this.phi );
		targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );
		*/

		scope.target.translateX = targetPosition.x + actualMoveSpeed;


		if( scope.targetObject === undefined) {
			scope.object.lookAt( targetPosition );
		}else{
			//this.object.lookAt( targetObject.geometry.centroid );
			scope.object.lookAt( targetPosition );
			//this.object.position = this.targetObject.geometry.centroid;
			scope.object.position.z =  40;
		}

	};

	function contextmenu( event ) {

		event.preventDefault();

	}

	this.dispose = function() {

		this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
		/*
		this.domElement.removeEventListener( 'mousedown', _onMouseDown, false );
		this.domElement.removeEventListener( 'mousemove', _onMouseMove, false );
		this.domElement.removeEventListener( 'mouseup', _onMouseUp, false );

		window.removeEventListener( 'keydown', _onKeyDown, false );
		window.removeEventListener( 'keyup', _onKeyUp, false );
		*/
	}

		
	var _onGamepadConnected = bind( this, this.connectHandler);
	var _onGamepadDisconnected = bind( this, this.disconnectHandler);

	this.domElement.addEventListener( 'contextmenu', contextmenu, false );
/*
	this.domElement.addEventListener( 'mousemove', _onMouseMove, false );
	this.domElement.addEventListener( 'mousedown', _onMouseDown, false );
	this.domElement.addEventListener( 'mouseup', _onMouseUp, false );

	window.addEventListener( 'keydown', _onKeyDown, false );
	window.addEventListener( 'keyup', _onKeyUp, false );
*/
	//this.domElement.addEventListener( "gamepadconnected", _onGamepadConnected, false);
	//this.domElement.addEventListener( "gamepaddisconnected", _onGamepadDisconnected, false );
	
	window.addEventListener("gamepadconnected", _onGamepadConnected, false );
	window.addEventListener("gamepaddisconnected", _onGamepadDisconnected, false );




	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	}

	this.handleResize();

};
