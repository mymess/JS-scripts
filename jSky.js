

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
			this.calculateStarLocalCoordinates( this.stars[i] )
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



	calculateStarLocalCoordinates: function ( item ) {		
		var ans = this.coord_to_horizon (item.ra, item.dec)
		item[ 23 ]  = ans[0];
		item[ 24 ]  = ans[1];
	},

	//input: RA in hours, dec in degrees
	//output: Array [az, alt]
	coord_to_horizon: function ( ra, dec )
	{
	    // compute hour angle in degrees
	    var ha = this.mean_sidereal_time( ) - ra * this.HOURS2DEG;
	    if (ha < 0) ha = ha + 360;

	    // convert degrees to radians
	    ha  = ha  * this.DEG2RAD;
	    dec = dec * this.DEG2RAD;
	    

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

	getStarData: function(star){
		//StarID,HIP,HD,HR,Gliese,BayerFlamsteed,ProperName,RA,Dec,Distance,PMRA,PMDec,RV,Mag,AbsMag,Spectrum,ColorIndex, X,Y,Z,VX,VY,VZ
		return {
			StarID: star[0],
			HIP: star[1],
			HD: star[2],
			HR: star[3],
			Gliese: star[4],
			BayerFlamsteed: star[5],
			ProperName: star[6],
			RA: star[7],
			Dec: star[8],
			Distance: star[9],
			PMRA: star[ 10 ],
			PMDec: star[11],
			RV: star[ 12 ],
			Mag: star [ 13 ],
			AbsMag: star[14],
			Spectrum: star[15],
			ColorIndex: star[ 16 ],
			X: star[17],
			Y: star[18],
			Z: star[ 19],
			VX: star[20], 
			VY: star[21],
			VZ: star[22],
			azimuth: star[23],
			altitude: star[24]
		}

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
	},
	getStarRGB: function(starIdx){
		var colorIndex = parseFloat(this.stars[ starIdx ][ 16 ]);

        //RED
        // y = -0,0921x5 + 0,3731x4 - 0,3497x3 - 0,285x2 + 0,5327x + 0,8217            
        var red = -.0921*Math.pow(colorIndex, 5 ) + .3731*Math.pow(colorIndex,4) - .3497*Math.pow(colorIndex,3) 
        	      - .285*Math.pow(colorIndex,2) + .5327*colorIndex + .8217;            
        if (red>1.0) {
        	red = 1.0;
        }
        
        //GREEN
		//y = -0,1054x6 + 0,229x5 + 0,1235x4 - 0,3529x3 - 0,2605x2 + 0,398x + 0,8626
		var green = -.1054*Math.pow(colorIndex, 6) + .229*Math.pow(colorIndex, 5 ) + .1235*Math.pow(colorIndex, 4) 
					- .3529*Math.pow(colorIndex, 3) - .2605 * Math.pow(colorIndex, 2 ) + .398*colorIndex + .8626;           

		//BLUE
		var blue = 0.0;
        //for the interval [-0.40, 0.40]
        //y = 1.0f
        //for the interval (0.40,  1.85]
        //y = -1,9366x6 + 12,037x5 - 30,267x4 + 39,134x3 - 27,148x2 + 9,0945x - 0,1475
        //for the interval (1,85-2.0]
        //y = 0.0f
        if( colorIndex <= .40){
            blue = 1.0;
        }
        if( colorIndex>.40 && colorIndex<=1.85){
            blue = -1.9366*Math.pow(colorIndex, 6) + 12.037*Math.pow(colorIndex, 5) - 30.267*Math.pow(colorIndex, 4)
            	   + 39.134 * Math.pow(colorIndex, 3) -27.148*Math.pow(colorIndex, 2) + 9.0945*colorIndex - .1475;
        }
        if( colorIndex>1.85 ){
            blue = 0.0;                
        }

        return {r:parseInt(red*255), g: parseInt(green*255), b: parseInt(blue*255) };

	},
	
	getStarSize: function( starIdx ){
		
		// f(x) = 1 + ax + bx^2
		// f(0) = 1
		// f( maxM ) = .01
		// f'( maxM ) = 0


		var m = this.stars[starIdx][ 13 ];	
		var m2 = parseFloat(m) + 1.44;
		var max2 = this.maxMag + 1.44;

		var a = -1.98/max2;
		var b = .99/(max2*max2);

		return  1 + a*m2 + b*m2*m2;	

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
	var logger = new WEBLOGGER();

	SKY.init(utc, lon, lat );

	//SKY.loadBodiesData();
	var azAlt = SKY.coord_to_horizon( ra, dec );

	var minRA = (ra - Math.floor(ra))*60;
	var secRA = (minRA - Math.floor(minRA))*60;

	var minDec = (dec - Math.floor(dec))*60;
	var secDec = (minDec - Math.floor(minDec))*60;


	logger.warn(" month --> " + utc.toString());
	logger.warn(" RA --> {0}h {1}m {2}s\" ".format(Math.floor(ra), Math.floor(minRA), secRA ) );
	logger.warn(" Dec -->  {0}º {1}' {2}".format(Math.floor(dec), Math.floor(minDec), secDec ));


	logger.warn(" AZ --> " +azAlt[0] );
	logger.warn(" Alt --> "+azAlt[1] );

	var antares = ["80520", "80763", "148478", "6134", "", "21Alp Sco", "Antares", "16.49012986", "-26.43194608", "185.185185185185", "-10.16", "-23.21", "-3", "1.06", "-5.27803120088516", "M1Ib + B2.5V", "1.865", "-63.85476", "-153.03932", "-82.43231", "-3.788e-06", "1.4607e-05", "-1.7292e-05"];

	

	var sirius = ["32263", "32349", "48915", "2491", "Gl 244  A", "9Alp CMa", "Sirius", "6.7525694", "-16.71314306", "2.63706125893305", "-546.01", "-1223.08", "-9.4", "-1.44", "1.45439890714285", "A0m...", "0.009", "-0.49439", "2.4768", "-0.75836", "9.527e-06", "-1.2072e-05", "-1.221e-05"];
	
	SKY.stars = [antares, sirius];


// AZ: 138º 17' 01"  
// ALT: 22º 34' 17"
	var azS = 138 + 17/60 + 1/3600;
	var alS = 22 + 34/60 +17/3600;
	logger.error(" AZ Stellarium --> " + azS );
	logger.error(" Alt Stellarium --> " + alS );
	//WEBLOGGER.log( starData );
	//WEBLOGGER.error( "ERROR: system failure." );
	//WEBLOGGER.warn( "WARNING: system failure." );
	var rgb = SKY.getStarRGB( 0 );
	logger.warn( "Antares {0} {1} {2}".format(rgb.r, rgb.g, rgb.b) );

	rgb = SKY.getStarRGB( 1 );
	logger.warn( "sirius {0} {1} {2}".format(rgb.r, rgb.g, rgb.b) );

	
});
//model.update();
//model.log();
//console.log( "Hola {0}, {1}".format("joan", "qué tal?") );

