

String.prototype.format = function() {
    var formatted = this;       
    for (var i = 0; i < arguments.length; i++) {    	
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');		
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};


var SKY = SKY || {}

/*
SKY = function(utc, lon, lat){
	this.utc = utc;
	this.lon = lon;
	this.lat = lat;
	this.altitude = 0;
	this.DEG2RAD   = Math.PI/180;
	this.RAD2DEG   = 180/Math.PI;
	this.HOURS2DEG = 15;
	this.latRad = this.lat*this.DEG2RAD;

	//this.loadBodiesData();
	this.bodies = [];
	this.stars = starData;

}

SKY.prototype.update = function(){
	this.loadBodiesData();
}

SKY.prototype.loadBodiesData = function(){

}
*/

SKY = {

	bodies: [],
	stars: [],

	init: function(utc, lon, lat){
		
		this.utc = utc;

		this.lon = lon;
		this.lat = lat;
		
		this.DEG2RAD   = Math.PI/180;
		this.RAD2DEG   = 180/Math.PI;
		this.HOURS2DEG = 15;
		this.latRad = this.lat*this.DEG2RAD;

		//this.loadBodiesData();
		this.bodies = [];
		this.stars = starData;
	},

	update: function(){		
		for(var i=0; i<this.stars.length; i++){
			this.calculateLocalCoordinates( this.stars[i] )
		}
	},


	
	getJulianDay: function(){
		var now    = this.utc;
	    var year   = now.getUTCFullYear();
	    var month  = now.getUTCMonth() + 1;
	    var day    = now.getUTCDate();
	    var hour   = now.getUTCHours();
	    var minute = now.getUTCMinutes();
	    var second = now.getUTCSeconds();


	    var dayFract = day + hour/24 + minute/(24*60) + second/(24*60*60)

	    return this.date2Julian(month, dayFract, year);
	},

	date2Julian: function(inMonth, inDay, inYear)
	{
	        var             A,B;
	        var             theMonth = inMonth;
	        var             theYear = inYear;
	  
	        if ( inMonth <= 2 )
	                { --theYear;  theMonth += 12;  }
	   
	        A = Math.floor(theYear/100.0);
	  
	        if ( inYear < 1582 )
	                B = 0;
	        else if (inYear > 1582 )
	                B = 2 - A + Math.floor(A/4.0);
	        else
	    {
	                if ( inMonth < 10 )
	                        B = 0;
	                else if ( inMonth > 10 )
	                        B = 2 - A + Math.floor(A/4.0);
	                else
	                {
	                        if ( inDay < 5 )
	                                B = 0;
	                        else if ( inDay >= 15 )
	                                B = 2 - A + Math.floor(A/4.0);
	                        else
	                                { return -1; } /* error, days falls on 10/5/1582 - 10/14/1582 */
	                } /* end middle else */   
	        } /* end outer else */

	        /* Julian Day */
	        return Math.floor(365.25 * (theYear + 4716.0)) + Math.floor(30.6001 * (theMonth + 1.0)) + inDay + B - 1524.5;
	},



	calculateLocalCoordinates: function ( item ) {		
		var ans = coord_to_horizon (item.ra, item.dec)
		item.prototype.az  = ans[0];
		item.prototype.alt = ans[1];
	},

	//input: RA in hours, dec in degrees
	//output: Array [az, alt]
	coord_to_horizon: function ( ra, dec )
	{
	    // compute hour angle in degrees
	    var ha = this.mean_sidereal_time( ) - ra * this.HOURS2DEG;
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
		var now    = this.utc;
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


	Body:  function(name, ra, dec){
		this.name      = name;
		this.ra 	   = ra;
		this.dec 	   = dec;				
	},

	Star: function(name, ra, dec, magnitude, color){
		this.name      = name;
		this.ra 	   = ra;
		this.dec 	   = dec;	
		this.magnitude = magnitude;		
		this.color 	   = color;	
	},

	loadBodiesData: function(){		
		var now    = this.utc;
	    var year   = now.getUTCFullYear();
	    var month  = now.getUTCMonth() + 1;
	    var day    = now.getUTCDate();
	    var hour   = now.getUTCHours();
	    var minute = now.getUTCMinutes();
	    var second = now.getUTCSeconds();

	    var url1 = 'https://crossorigin.me/'
		var url2 = "http://api.nginov.com/shared/ws/astro/?lat={0}&lon={1}&alt={2}&y={3}&m={4}&d={5}&h={6}&i={7}&s={8}&out=json".format(
			this.lat, this.lon, 0, year, month, day, hour, minute, second);
		
		var array = [];
		url = url1 + url2;
		

		$.getJSON(url, function(data) {
			SKY.bodies = data.astropositions.positions;				
		});		
	},

	//input: rectangular coordinates X, Y, Z
	//output: array containing RA and declination in degrees, and distance in km
	calculatePolarCoordinates: function(x, y, z){
		var ra = Math.atan2(y, x);
		var dec = Math.atan2(z, Math.sqrt( x*x + y*y ));
		var distance = Math.sqrt( x*x + y*y + z*z );

		var ans = [ra*this.RAD2DEG, dec*this.RAD2DEG, distance];

		return ans;
	},

	log: function(){
		for( var body in this.bodies){
			console.log( "Name -> " + body.name );
			console.log( "Dec -> " + body.dec );
			
		}
	},

	getLog: function(){
		var s= '';
		for( var i =0; i< this.bodies.length; ++i){
			var body = this.bodies[i];
			s += "\nName --> " + body.name;
			s += "\nAz: " + body.azimuth;
			s += "\nAlt: " + body.height;
			s += "\n---- ";
		}
		return s;
	}
}





//sirius
// VALENCIA LON/LAT: 0º 23' 24"   39º 28' 48"
// TIME 25-12-2015  22:51:24
// AZ: 138º 17' 01"  
// ALT: 22º 34' 17"
//              StarID,  HIP,      HD,     HR,   Gliese,    BayerFlamsteed,ProperName,RA,         Dec,            Distance,           PMRA,       PMDec,      RV,     Mag,       AbsMag,        Spectrum, ColorIndex, X,Y,Z,VX,VY,VZ
var sirius = ["32263", "32349", "48915", "2491", "Gl 244  A", "9Alp CMa", "Sirius", "6.7525694", "-16.71314306", "2.63706125893305", "-546.01", "-1223.08", "-9.4", "-1.44", "1.45439890714285", "A0m...", "0.009", "-0.49439", "2.4768", "-0.75836", "9.527e-06", "-1.2072e-05", "-1.221e-05"];

var ra = sirius[7];
var dec = sirius[8];
console.log( dec )
var year = 2015;
var month = 11;
var day = 25 + 22/24 + 51/(24*60) + 24/86400;


var hours 		 = (day - Math.floor(day)) * 24;
var minutes      = hours-Math.floor(hours) * 60;
var seconds      = minutes-Math.floor(minutes) * 60;
var milliseconds = (seconds- Math.floor(seconds))*1000;

day = 25;
hours = 22;
minutes = 51;
seconds = 24;
milliseconds = 0;

var utc = new Date(year, month, 
					Math.floor(day), Math.floor(hours), 
					Math.floor(minutes), Math.floor(seconds), 
					milliseconds );


var lon = 23/60 + 24/3600;
var lat = 39+28/60 + 48/3600; 


$(document).ready(function(){
	WEBLOGGER.init();

	SKY.init(utc, lon, lat );

	//SKY.loadBodiesData();
	var azAlt = SKY.coord_to_horizon( ra, dec );

	var minRA = (ra - Math.floor(ra))*60;
	var secRA = (minRA - Math.floor(minRA))*60;

	var minDec = (dec - Math.floor(dec))*60;
	var secDec = (minDec - Math.floor(minDec))*60;


	WEBLOGGER.warn(" month --> " + utc.toString());
	WEBLOGGER.warn(" RA --> {0}h {1}m {2}s\" ".format(Math.floor(ra), Math.floor(minRA), secRA ) );
	WEBLOGGER.warn(" Dec -->  {0}º {1}' {2}".format(Math.floor(dec), Math.floor(minDec), secDec ));


	WEBLOGGER.warn(" AZ --> " +azAlt[0] );
	WEBLOGGER.warn(" Alt --> "+azAlt[1] );


// AZ: 138º 17' 01"  
// ALT: 22º 34' 17"
	var azS = 138 + 17/60 + 1/3600;
	var alS = 22 + 34/60 +17/3600;
	WEBLOGGER.error(" AZ Stellarium --> " + azS );
	WEBLOGGER.error(" Alt Stellarium --> " + alS );
	//WEBLOGGER.log( starData );
	//WEBLOGGER.error( "ERROR: system failure." );
	//WEBLOGGER.warn( "WARNING: system failure." );
	
	
});
//model.update();
//model.log();
//console.log( "Hola {0}, {1}".format("joan", "qué tal?") );

