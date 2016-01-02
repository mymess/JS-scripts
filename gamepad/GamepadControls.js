/**
 * Gamepad controls to achieve a chase camera
 * @author joandelason / http://www.tothemoonlabs.com
 */

THREE.GamepadControls = function ( camera, domElement, targetObject ) {

	var scope = this;

	this.object = camera;	//camera
	this.targetObject = targetObject;  //targetObject
	

	this.target = targetObject.position;

	var CONTROLLERS = {}; //contains all connected devices. Will only use the first one
	
	//unfortunately these mappings are gamepad vendor dependent, so check and update them before playing
	//You can check them here: 

	var BUTTONS = { X: 0, A: 1, B: 2, Y: 3, LB: 4, RB: 5, LT: 6, RT: 7, BACK: 8, START: 9, 
				   LEFT_JOYSTICK_PUSH: 10, RIGHT_JOYSTICK_PUSH: 11, LEFT_JOYSTICK_UP: 12, 
				   LEFT_JOYSTICK_DOWN: 13, LEFT_JOYSTICK_LEFT: 14, LEFT_JOYSTICK_RIGHT: 15 };
	
	var AXES = {CROSS_X: 1, CROSS_Y: 2, RIGHT_JOYSTICK_X: 3, RIGHT_JOYSTICK_Y: 4};

	var ACTIONS = {THRUST_UP: 'RT', THRUST_DOWN: 'RB', ROLL: 'CROSS_X', PITCH: 'CROSS_Y', CAMERA_X: 'RIGHT_JOYSTICK_X',
				CAMERA_Y: 'RIGHT_JOYSTICK_Y', SHOOT_LASER: 'A', SHOOT_PROTON: 'B'}


	var CAMERAS = {CHASE:0, STATIC: 1, ORBIT: 2};

	//
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.enabled = true;

	this.movementSpeed = 1.0;
	this.thrust = 0.0;
	this.thrustDelta = 5.0; 	
	this.maxThrust = 100.0;
	this.maxSpeed = 15;

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

	function addGamepad ( gamepad ){	
		console.log("Adding gamepad to controllers index %d ", gamepad.index);
		CONTROLLERS[gamepad.index] = gamepad;
	}
	
	function connectHandler (gamepad){
		scanGamepads();		
	}	

	function scanGamepads () {
  		var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
		console.log ("There are %d gamepads detected.", gamepads.length );
		  
		if( gamepads.length == 0 ){
		  console.log ("Connect one AND press any button to detect it." );
		}

		for (var i = 0; i < gamepads.length; i++) {
			if (gamepads[i]) {
			  if (gamepads[i].index in CONTROLLERS) {			  	
			    CONTROLLERS[gamepads[i].index] = gamepads[i];		
			    console.log( "Added gamepad %d to controller index %d", gamepads[i].index, i);	    
			  } else {      	
			  	addGamepad( gamepads[i] );			    
			  }
			}
		}
	}

	function disconnectHandler(e) {
		console.log( "Disconnecting gamepad " + e.gamepad.index);
  		removeGamepad(e.gamepad);
  	}

	function removegamepad(gamepad) {
 		 delete CONTROLLERS[gamepad.index];
	}

  	function updateStatus () {	  
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

	  for (var j=0; j< CONTROLLERS.length; j++) {
	    var controller = CONTROLLERS[j];

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

	this.shootLaser = function(){		
		return scope.isButtonPressed( ACTIONS.SHOOT_LASER  );
	}

	this.shootProton = function(){
		return scope.isButtonPressed( ACTIONS.SHOOT_PROTON );	
	}


	this.isButtonPressed = function ( button ){
		if( !CONTROLLERS[0] ){
			console.log( "No gamepad connected at index 0. Controllers " + CONTROLLERS[0] );
			return;
		}
		if( !BUTTONS.hasOwnProperty( button ) ){
			console.log( "No button named '" + button +"'" );
			return;
		}		
		return CONTROLLERS[0].buttons[ BUTTONS[button] ].pressed;
	}

	this.getButtonsMap = function(){
		var ret = {} ;
		for( var b in BUTTONS ){		

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
		for( var b in BUTTONS){			
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
		if( CONTROLLERS[0] === undefined ){
			return;
		}

		return CONTROLLERS[0].axes[ AXES.RIGHT_JOYSTICK_X ];
	}

	this.getRight_yAxis = function() {
		if( CONTROLLERS[0] === undefined ){
			return;
		}
		return CONTROLLERS[0].axes[ AXES.RIGHT_JOYSTICK_Y ];			
	}

	this.getCross_xAxis = function(){
		if( CONTROLLERS[0] === undefined ){
			return;
		}
		return CONTROLLERS[0].axes[ AXES.CROSS_X ];			
	}

	this.getCross_yAxis = function(){
		if( CONTROLLERS[0] === undefined ){
			return;
		}
		return CONTROLLERS[0].axes[ AXES.CROSS_Y ];				
	}


	//

	function handleResize () {

		if ( this.domElement === document ) {

			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;

		} else {

			this.viewHalfX = scope.domElement.offsetWidth / 2;
			this.viewHalfY = scope.domElement.offsetHeight / 2;

		}

	};

	this.update = function( delta ) {

		if ( scope.enabled === false ) return;

		var x = new THREE.Vector3( 1, 0, 0 );
		var y = new THREE.Vector3( 0, 1, 0 );
		var z = new THREE.Vector3( 0, 0, 1 );


		updateStatus();

		//console.log ( "RT pressed --> " + this.isButtonPressed( "RT" ) );		

		var pressed = this.getButtonsMap();

		//console.log ( "RT pressed --> " + pressed[ ACTIONS.THRUST_UP ] );		

		// SPEED
		if( pressed[ ACTIONS.THRUST_UP]  && scope.thrust < 100){
			scope.thrust += scope.thrustDelta; 
			console.log( scope.thrust );
		}else if( pressed["RB"] && scope.thrust> -100){
			scope.thrust -= scope.thrustDelta; 
			if( scope.thrust <-100 ){
				scope.thrust = -100.0;
			}
			console.log( scope.thrust );
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
		var pitchSpeed = -scope.getCross_yAxis();
		var rollSpeed = -scope.getCross_xAxis();
		var actualPitchSpeed =3*delta*pitchSpeed; 
		var actualRollSpeed = 10*delta*rollSpeed;
		
		//console.log( "actualRollSpeed " + actualRollSpeed);
		if( Math.abs(pitchSpeed) >0.4){
			scope.targetObject.rotateOnAxis(z, - actualPitchSpeed );
		}
		if( Math.abs(rollSpeed) >0.4){
			scope.targetObject.rotateOnAxis(x, - actualRollSpeed );
		}

		if( pressed[ ACTIONS.THRUST_UP ] && scope.thrust<100){
			scope.thrust += 5;
			console.log( "Thrust up " + scope.thrust );
		}


		if( pressed[  ACTIONS.THRUST_DOWN  ] && scope.thrust>0 ){
			scope.thrust -= 5;
			console.log( "Thrust down " + scope.thrust );
		}

		var targetPosition = scope.target,
			position = this.object.position;
		/*
		targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
		targetPosition.y = position.y + 100 * Math.cos( this.phi );
		targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );
		*/
		var actualMoveSpeed = .01*scope.movementSpeed+  0.2*0.01*scope.thrust;
		
		if( actualMoveSpeed > this.maxSpeed )
		{
			actualMoveSpeed = this.maxSpeed 
		}
		if( actualMoveSpeed<0 ){
			actualMoveSpeed = 0;
		}
		

		//console.log( "MoveSpeed " + scope.movementSpeed);
		//console.log( "actualMoveSpeed " + actualMoveSpeed);
		//console.log( "targetObject.x " + scope.targetObject.position.x);
		scope.targetObject.translateX(actualMoveSpeed);
		

		this.targetObject.matrixAutoUpdate= true;
		this.targetObject.matrixWorldNeedsUpdate= true;
		this.targetObject.updateMatrix();
		this.targetObject.updateMatrixWorld ( true );
		

		chaseCamera();
		//staticCamera();
/*
		if( scope.targetObject === undefined) {
			scope.object.lookAt( targetPosition );
		}else{
			//this.object.lookAt( targetObject.geometry.centroid );
			scope.object.lookAt( targetPosition );
			//this.object.position = this.targetObject.geometry.centroid;			
		}
*/

	}


	function chaseCamera (){
		var relativeCameraOffset = new THREE.Vector3(-50, 10, 0);

		var cameraOffset = relativeCameraOffset.applyMatrix4( targetObject.matrixWorld );
		var targetPosition = scope.targetObject.position;		

		scope.object.lookAt( targetPosition );
		scope.object.position.set( cameraOffset.x, cameraOffset.y, cameraOffset.z) ;
		/*
		this.object.x = cameraOffset.x;
		this.object.y = cameraOffset.y;
		this.object.z = cameraOffset.z;
		*/
		
	}

	function staticCamera (){

		var targetPosition = targetObject.position;
		
		scope.object.lookAt( targetPosition );	
		
		
	}


	function contextmenu( event ) {

		event.preventDefault();

	}

	function dispose () {

		this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
		/*
		this.domElement.removeEventListener( 'mousedown', _onMouseDown, false );
		this.domElement.removeEventListener( 'mousemove', _onMouseMove, false );
		this.domElement.removeEventListener( 'mouseup', _onMouseUp, false );

		window.removeEventListener( 'keydown', _onKeyDown, false );
		window.removeEventListener( 'keyup', _onKeyUp, false );
		*/
	}

		
	var _onGamepadConnected = bind( this, connectHandler);
	var _onGamepadDisconnected = bind( this, disconnectHandler);

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

	handleResize();

};
