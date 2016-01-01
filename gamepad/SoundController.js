
SoundController = function() {
	var scope = this;
	var effects = new Howl({
	  url: ['sounds/effects.mp3'],
	  sprite: {
	    laser: [70, 400],
	    proton: [1000, 1700]    
	  }
	});

	var laser = new Howl({ urls:['sounds/XWing-Laser.mp3']});
	var proton = new Howl({ urls:['sounds/XWing-Proton.wav']})
	
	this.playLaser = function() { laser.play(); };

	this.playProton = function() { proton.play(); };

	/*	
	var music = new Howl({
  		urls: ['sounds/starwars.mp3'],
  		volume: 0.3
	}).play();
	*/
}