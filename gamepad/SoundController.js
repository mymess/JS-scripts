
SoundController = function() {
	var scope = this;
	/*
	var effects = new Howl({
	  url: ['sounds/effects.mp3'],
	  sprite: {
	    laser: [70, 400],
	    proton: [1000, 1700]    
	  }
	});

	var laser = new Howl({ urls:['sounds/XWing-Laser.mp3']});
	var proton = new Howl({ urls:['sounds/XWing-Proton.wav']})
	*/

	var laser = new buzz.sound( "sounds/XWing-Laser.mp3");
	var proton = new buzz.sound( "sounds/XWing-Proton.wav");


	this.playLaser = function() { 
		if(laser.isPaused() || laser.isEnded()) {
			laser.play(); 
		}
	};

	this.playProton = function() { 
		if(proton.isPaused() || proton.isEnded()) {
			proton.play(); 
		}
	};

	/*	
	var music = new Howl({
  		urls: ['sounds/starwars.mp3'],
  		volume: 0.3
	}).play();
	*/
}