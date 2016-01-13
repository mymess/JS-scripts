/**
 * @author joandelason / http://mrdoob.com/
 */

THREE.KeyboardControls = function ( object, domElement, targetObject ) {

	var scope = this;

	this.object = object;
	this.target = new THREE.Vector3( 0, 0, 0 );
	this.targetObject = targetObject;
	var KeyCodes = {
        CANCEL: 3, ELP: 6, BACK_SPACE: 8, TAB: 9, CLEAR: 12, RETURN: 13, ENTER: 14, SHIFT: 16, CONTROL: 17, ALT: 18, 
        PAUSE: 19, CAPS_LOCK: 20, ESCAPE: 27, SPACE: 32,PAGE_UP: 33, PAGE_DOWN: 34, END: 35, HOME: 36, LEFT: 37,
        UP: 38, RIGHT: 39, DOWN: 40, PRINTSCREEN: 44, INSERT: 45, DELETE: 46, 0: 48, 1: 49, 2: 50, 3: 51, 4: 52,
        5: 53, 6: 54, 7: 55, 8: 56, 9: 57, SEMICOLON: 59, EQUALS: 61, A: 65, B: 66, C: 67, D: 68, E: 69, F: 70,
		G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, 
		V: 86, W: 87, X: 88, Y: 89, Z: 90, CONTEXT_MENU: 93, NUMPAD0: 96, NUMPAD1: 97, NUMPAD2: 98, NUMPAD3: 99,
        NUMPAD4: 100, NUMPAD5: 101, NUMPAD6: 102, NUMPAD7: 103, NUMPAD8: 104, NUMPAD9: 105, MULTIPLY: 106, ADD: 107,
        SEPARATOR: 108, SUBTRACT: 109, DECIMAL: 110, DIVIDE: 111, F1: 112, F2: 113, F3: 114, F4: 115, F5: 116,
        F6: 117, F7: 118, F8: 119, F9: 120, F10: 121, F11: 122, F12: 123, F13: 124, F14: 125, F15: 126, F16: 127, 
        F17: 128, F18: 129, F19: 130, F20: 131, F21: 132, F22: 133, F23: 134, F24: 135, NUM_LOCK: 144, SCROLL_LOCK: 145,
        COMMA: 188, PERIOD: 190, SLASH: 191, BACK_QUOTE: 192, OPEN_BRACKET: 219, BACK_SLASH: 220, CLOSE_BRACKET: 221,
        QUOTE: 222, META: 224
    };
    var KeyMap = {};

    for(var i=1; i<225; ++i){
    	KeyMap[i] = false;
    }

    var Actions = {PITCH_DOWN: 'UP', PITCH_UP: 'DOWN', ROLL_LEFT: 'LEFT', ROLL_RIGHT: 'RIGHT', SHOOT_LASER: 'CONTROL', SHOOT_PROTON: 'SPACE' }


	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.enabled = true;

	this.movementSpeed = 1.0;
	this.pitchSpeed = 2.0;
	this.rollSpeed  = 5.0;

	this.lookSpeed = 0.005;

	this.lookVertical = true;
	this.autoForward = false;

	this.activeLook = true;


	var shootLaser = false;
	var shootProton = false;

	this.heightSpeed = false;
	this.heightCoef = 1.0;
	this.heightMin = 0.0;
	this.heightMax = 1.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.autoSpeedFactor = 0.0;

	this.mouseX = 0;
	this.mouseY = 0;

	this.lat = 0;
	this.lon = 0;
	this.phi = 0;
	this.theta = 0;


	this.maxSpeed = 1002.5;
	this.thrust = 20;
	this.thrustUp = false;
	this.thrustDown = false;

	this.pitchDown = false;
	this.pitchUp = false;
	this.moveLeft = false;
	this.moveRight = false;

	this.mouseDragOn = false;

	this.viewHalfX = 0;
	this.viewHalfY = 0;


	

	if ( this.domElement !== document ) {

		this.domElement.setAttribute( 'tabindex', - 1 );

	}

	//
	this.shootLaser = function(){
		return shootLaser;
	}

	this.shootProton = function(){
		return shootProton;
	}
	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;

		} else {

			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;

		}

	};

	this.onMouseDown = function ( event ) {

		if ( this.domElement !== document ) {

			this.domElement.focus();

		}

		event.preventDefault();
		event.stopPropagation();

		if ( this.activeLook ) {

			switch ( event.button ) {

				case 0: this.pitchDown = true; break;
				case 2: this.pitchUp = true; break;

			}

		}

		this.mouseDragOn = true;

	};

	this.onMouseUp = function ( event ) {

		event.preventDefault();
		event.stopPropagation();

		if ( this.activeLook ) {

			switch ( event.button ) {

				case 0: this.pitchDown = false; break;
				case 2: this.pitchUp = false; break;

			}

		}

		this.mouseDragOn = false;

	};

	this.onMouseMove = function ( event ) {

		if ( this.domElement === document ) {

			this.mouseX = event.pageX - this.viewHalfX;
			this.mouseY = event.pageY - this.viewHalfY;

		} else {

			this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
			this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

		}

	};

	this.onKeyDown = function ( event ) {

		event.preventDefault();
		event.stopPropagation();

		KeyMap[ event.keyCode ] = true;

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.pitchDown = true; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ this.pitchUp = true; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = true; break;

			case 82: /*R*/ this.moveUp = true; break;
			case 70: /*F*/ this.moveDown = true; break;

			case 107: /*+*/ this.thrustUp = true; break;
			case 109: /*-*/ this.thrustDown = true; break;

			case 17: /*Ctrl*/ shootLaser = true; break;
			case 32: /*Space*/ shootProton = true; break;


		}

	};

	this.onKeyUp = function ( event ) {
		event.preventDefault();

		KeyMap[ event.keyCode ] = false;

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.pitchDown = false; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.pitchUp = false; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = false; break;

			case 82: /*R*/ this.moveUp = false; break;
			case 70: /*F*/ this.moveDown = false; break;

			case 107: /*+*/ this.thrustUp = false; break;
			case 109: /*-*/ this.thrustDown = false; break;

			case 17: /*Ctrl*/ shootLaser = false; break;
			case 32: /*Space*/ shootProton = false; break;

		}

	};

	this.update = function( delta ) {

		if ( this.enabled === false ) return;


		var x = new THREE.Vector3( 1, 0, 0 );
		var y = new THREE.Vector3( 0, 1, 0 );
		var z = new THREE.Vector3( 0, 0, 1 );


		if ( this.heightSpeed ) {

			var y = THREE.Math.clamp( this.object.position.y, this.heightMin, this.heightMax );
			var heightDelta = y - this.heightMin;

			this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

		} else {

			this.autoSpeedFactor = 0.0;

		}

		

		
		var actualPitchSpeed = delta * this.pitchSpeed;
		var actualRollSpeed = delta * this.rollSpeed;
		if( KeyMap[ KeyCodes[ Actions.PITCH_DOWN ] ] ){
		
			this.targetObject.rotateOnAxis(z, - actualPitchSpeed );
		}
		if( KeyMap[ KeyCodes[ Actions.PITCH_UP ] ] ){
			this.targetObject.rotateOnAxis(z, actualPitchSpeed );
		}
		if( KeyMap[ KeyCodes[ Actions.ROLL_LEFT ] ] ){
			this.targetObject.rotateOnAxis(x, - actualRollSpeed );
		}
		if( KeyMap[ KeyCodes[ Actions.ROLL_RIGHT ] ] ){
			this.targetObject.rotateOnAxis(x, actualRollSpeed );
		}

		if( this.thrustUp && this.thrust<100){
			this.thrust += 5;
		}


		if( this.thrustDown && this.theta>0 ){
			this.thrust -= 5;
		}

		this.movementSpeed = .2*this.thrust;
		var actualMoveSpeed = delta * this.movementSpeed;
		actualMoveSpeed < this.maxSpeed? actualMoveSpeed +=.1 : actualMoveSpeed = this.maxSpeed;
		/*
		if( this.thrustUp ){
			actualMoveSpeed < this.maxSpeed? actualMoveSpeed +=.1 : actualMoveSpeed = this.maxSpeed;
		}
		*/
		this.targetObject.translateX(actualMoveSpeed);

		//TODO: this should be YAW
		//if ( this.moveUp ) this.object.translateY( actualRollSpeed );
		//if ( this.moveDown ) this.object.translateY( - actualRollSpeed );

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

			//this.phi = THREE.Math.mapLinear( this.phi, 0, Math.PI, this.verticalMin, this.verticalMax );

		}



		var targetPosition = this.targetObject.position,
			position = this.object.position;
			
		//camera	

		
		//this.staticCamera();

		
		this.targetObject.matrixAutoUpdate= true;
		this.targetObject.matrixWorldNeedsUpdate= true;
		this.targetObject.updateMatrix();
		this.targetObject.updateMatrixWorld ( true );
		
		this.staticCamera();

		this.object.matrixAutoUpdate= true;
		this.object.matrixWorldNeedsUpdate= true;
		this.object.updateMatrix();
		this.object.updateMatrixWorld ( true );
		//this.chaseCamera();
		/*
		var xWorld = this.targetObject.localToWorld( x );
		var yWorld = this.targetObject.localToWorld( y );
		var zWorld = this.targetObject.localToWorld( z );
		
		//scope.staticCamera();	
		this.object.lookAt( targetPosition );

		//this.object.position = 			
		
		this.object.position = targetPosition;
		*/
		//this.object.position.sub(yWorld.multiplyScalar(-50));
		//this.object.position.sub(zWorld.multiplyScalar(-50));
		
	}

	this.chaseCamera = function(){
		var relativeCameraOffset = new THREE.Vector3(-50, 10, 0);

		var cameraOffset = relativeCameraOffset.applyMatrix4( this.targetObject.matrixWorld );
		var targetPosition = this.targetObject.position;		

		this.object.lookAt( targetPosition );
		this.object.position.set( cameraOffset.x, cameraOffset.y, cameraOffset.z) ;
		/*
		this.object.x = cameraOffset.x;
		this.object.y = cameraOffset.y;
		this.object.z = cameraOffset.z;
		*/
		
	}

	this.staticCamera = function(){

		var x = new THREE.Vector3( 1, 0, 0 );

		var targetPosition = this.targetObject.position;
		var xWorld = this.targetObject.localToWorld( x );


		this.object.lookAt( targetPosition );

		//this.object.position = targetPosition;
		//this.object.position = this.object.position.sub( xWorld.multiplyScalar(-50) );
	}


	function contextmenu( event ) {

		event.preventDefault();

	}

	this.dispose = function() {

		this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
		this.domElement.removeEventListener( 'mousedown', _onMouseDown, false );
		this.domElement.removeEventListener( 'mousemove', _onMouseMove, false );
		this.domElement.removeEventListener( 'mouseup', _onMouseUp, false );

		window.removeEventListener( 'keydown', _onKeyDown, false );
		window.removeEventListener( 'keyup', _onKeyUp, false );

	}

	var _onMouseMove = bind( this, this.onMouseMove );
	var _onMouseDown = bind( this, this.onMouseDown );
	var _onMouseUp = bind( this, this.onMouseUp );
	var _onKeyDown = bind( this, this.onKeyDown );
	var _onKeyUp = bind( this, this.onKeyUp );

	this.domElement.addEventListener( 'contextmenu', contextmenu, false );
	this.domElement.addEventListener( 'mousemove', _onMouseMove, false );
	this.domElement.addEventListener( 'mousedown', _onMouseDown, false );
	this.domElement.addEventListener( 'mouseup', _onMouseUp, false );

	window.addEventListener( 'keydown', _onKeyDown, false );
	window.addEventListener( 'keyup', _onKeyUp, false );

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	}

	this.handleResize();

};
