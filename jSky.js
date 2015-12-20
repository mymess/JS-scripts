var SKY = SKY || {}

//http://www.fourmilab.ch/cgi-bin/Solar/action?sys=-Sf
//'http://www.astro-phys.com/api/de406/states?bodies=sun,moon,mercury,venus,earth,mars,jupiter,saturn';
//http://www.astro-phys.com/api/de406/states?date=1000-1-20&bodies=mars


var url = 'http://www.astro-phys.com/api/de406/states?date=2003-09-25T10:49&bodies=sun,moon';
var url2 = 'http://www.astro-phys.com/api/de406/states?date=2452907.95094&bodies=sun,moon' 

$.getJSON(url, {bodies: 'mercury'}, function(data) {
  var p = data.results.mercury[0];
  var v = data.results.mercury[1];
  console.log('Position:\nx='+p[0]+'\ny='+p[1]+'\nz='+p[2]);
  console.log('Velocity:\nx='+v[0]+'\ny='+v[1]+'\nz='+v[2]);
});



SKY = {

	init: function(utc, lon, lat){
		
		this.utc = utc;

		this.lon = lon;
		this.lat = lat;
		
		this.DEG2RAD   = Math.PI/180;
		this.RAD2DEG   = 180/Math.PI;
		this.HOURS2DEG = 15;
		this.latRad = this.lat*this.DEG2RAD;

		this.objects = [];  //sun, moon, planets
		this.stars   = [];
	},

	update: function(){
		for(var i=0; i<this.objects.length; i++ ){
			this.calculateLocalCoordinates( this.objects[i] )			
		}
		for(var i=0; i<this.stars.length; i++){
			this.calculateLocalCoordinates( this.stars[i] )
		}
	},

	//day is a fraction
	getJulianDay: function(year, month, day){
		//return jd
	}
	calculateLocalCoordinates: function ( body ) {		
		var ans = coord_to_horizon (item.ra, item.dec)
		item.prototype.az  = ans[0];
		item.prototype.alt = ans[1];
	},

	coord_to_horizon: function ( ra, dec )
	{
	    // compute hour angle in degrees
	    var ha = mean_sidereal_time( ) - ra*this.HOURS2DEG;
	    if (ha < 0) ha = ha + 360;

	    // convert degrees to radians
	    ha  = ha *this.DEG2RAD;
	    dec = dec*this.DEG2RAD;
	    

	    // compute altitude in radians
	    var sin_alt = Math.sin(dec)*Math.sin(this.latRad) + Math.cos(dec)*Math.cos(this.latRad)*Math.cos(ha);
	    var alt = Math.asin(sin_alt);
	    
	    // compute azimuth in radians
	    // divide by zero error at poles or if alt = 90 deg
	    var cos_az = (Math.sin(dec) - Math.sin(alt)*Math.sin(this.latRad))/(Math.cos(alt)*Math.cos(this.latRad));
	    var az  = Math.acos(cos_az);

	    // convert radians to degrees
	    hrz_altitude = alt*this.RAD2DEG;
	    hrz_azimuth  = az*this.RAD2DEG;

	    // choose hemisphere
	    if (Math.sin(ha) > 0) hrz_azimuth = 360 - hrz_azimuth;

	    return [hrz_azimuth, hrz_altitude];
	},

	// Compute the Mean Sidereal Time in units of degrees. 
	// Use lon := 0 to get the Greenwich MST. 
	// East longitudes are negative; West longitudes are positive
	// returns: time in degrees
	mean_sidereal_time: function ()
	{
		var now = this.utc;
	    var year   = now.getUTCFullYear();
	    var month  = now.getUTCMonth() + 1;
	    var day    = now.getUTCDate();
	    var hour   = now.getUTCHours();
	    var minute = now.getUTCMinutes();
	    var second = now.getUTCSeconds();

	    if ((month == 1)||(month == 2))
	    {
	        year  = year - 1;
	        month = month + 12;
	    }

	    var a = Math.floor(year/100);
	    var b = 2 - a + Math.floor(a/4);
	    var c = Math.floor(365.25*year);
	    var d = Math.floor(30.6001*(month + 1));

	    // days since J2000.0
	    var jd = b + c + d - 730550.5 + day + (hour + minute/60.0 + second/3600.0)/24.0;
	    
	    // julian centuries since J2000.0
	    var jt = jd/36525.0;

	    // the mean sidereal time in degrees
	    var mst = 280.46061837 + 360.98564736629*jd + 0.000387933*jt*jt - jt*jt*jt/38710000 - this.lon;

	    // in degrees modulo 360.0
	    if (mst > 0.0) 
	        while (mst > 360.0) mst = mst - 360.0;
	    else
	        while (mst < 0.0)   mst = mst + 360.0;
	        
	    return mst;
	},
	Object:  function(name, ra, dec, magnitude){
		this.name      = name;
		this.ra 	   = ra;
		this.dec 	   = dec;	
		this.magnitude = magnitude;		
	}

	Star: function(name, ra, dec, magnitude, color){
		this.name      = name;
		this.ra 	   = ra;
		this.dec 	   = dec;	
		this.magnitude = magnitude;		
		this.color 	   = color;	
	}
}


var year = 2015;
var month = 11;
var day = 12.1213;


var hours = (day - Math.floor(day)) * 24;
var minutes = hours-Math.floor(hours) * 60;
var seconds = minutes-Math.floor(minutes) * 60;
var miliseconds = (seconds- Math.floor(seconds))*1000;

var utc = new Date(year, month, 
					Math.floor(day), Math.floor(hours), 
					Math.floor(minutes), Math.floor(seconds), 
					miliseconds );

SKY.objects.add( new SKY.Object("Sun", 12, 12, -27) );
//...

//SKY.stars.add( new SKY.Star("..."))

var model = SKY.init(utc, 120.12, 12.12 );
model.update();


SKY.loader = function(){

}
