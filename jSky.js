var SKY = SKY || {}

//http://www.fourmilab.ch/cgi-bin/Solar/action?sys=-Sf
//'http://www.astro-phys.com/api/de406/states?bodies=sun,moon,mercury,venus,earth,mars,jupiter,saturn';
//http://www.astro-phys.com/api/de406/states?date=1000-1-20&bodies=mars


//var url = 'http://www.astro-phys.com/api/de406/states?date=2003-09-25T10:49&bodies=sun,mercury,venus,moon,mars,jupiter,saturn,uranus,neptune,pluto';
//var url2 = 'http://www.astro-phys.com/api/de406/states?date=2452907.95094&bodies=sun,mercury,venus,moon,mars,jupiter,saturn,uranus,neptune,pluto'; 


var url = 'http://api.nginov.com/shared/ws/astro/?lat=39.43&lon=.45&&alt=0&y=2015&m=02&d=17&h=11&i=15&s=00&out=json&callback=?'
//var url = 'http://api.nginov.com/shared/ws/astro/?lat=39.43&lon=.45&&alt=0&y=2015&m=02&d=17&h=11&i=15&s=00&out=json'

//var data = {"astropositions":{"generated":"2015-12-21 09:20:40","copyright":"NGinov ltd","author":"philippe GERARD","references":"swiss ephemeris","api":"http:\/\/api.nginov.com\/","informations":{"geoposition":{"unit":"degree","latitude":39.43,"longitude":0.45,"altitude":0},"calculation":{"mode":"UTC","date":"2015-02-17 11:15:00","stamp":"20150217111500"},"day":{"sunrise":"08:15:15","zenith":"12:58:07","sunset":"17:40:59","daylight":{"duration":"9:25:44"},"night":{"duration":"14:30:20"},"twilight":{"civil":"07:45:19\/18:10:55","nautical":"07:11:46\/18:44:28","astronomical":"06:39:14\/19:17:00"}}},"positions":[{"index":"0","name":"Sun","longitude":"328.4196358","latitude":"-0.0019922","rectascension":"330.5766535","declination":"-12.0232358","azimuth":"325.7372291","height":"31.7700950","speed":"0.9995451","house":"302.9971942","housenumber":"11.0999065"},{"index":"1","name":"Moon","longitude":"306.1352035","latitude":"3.8417119","rectascension":"307.5283670","declination":"-15.0109326","azimuth":"352.6011327","height":"35.2472785","speed":"10.3028679","house":"277.2815272","housenumber":"10.2427176"},{"index":"2","name":"Mercury","longitude":"303.0946584","latitude":"1.3090919","rectascension":"305.0709025","declination":"-18.1881182","azimuth":"355.7367810","height":"32.2728679","speed":"0.5628244","house":"274.5934316","housenumber":"10.1531144"},{"index":"3","name":"Venus","longitude":"355.7969617","latitude":"-1.1456751","rectascension":"356.5976633","declination":"-2.7218677","azimuth":"295.8321283","height":"24.1314303","speed":"1.2298557","house":"326.7324838","housenumber":"11.8910828"},{"index":"4","name":"Mars","longitude":"358.0126380","latitude":"-0.6247939","rectascension":"358.4248794","declination":"-1.3635548","azimuth":"293.3656722","height":"23.8146379","speed":"0.7685302","house":"327.8685489","housenumber":"11.9289516"},{"index":"5","name":"Jupiter","longitude":"136.2352105","latitude":"0.9764811","rectascension":"138.9964675","declination":"16.8992463","azimuth":"160.0762251","height":"-31.2893097","speed":"-0.1250254","house":"111.1127097","housenumber":"4.7037570"},{"index":"6","name":"Saturn","longitude":"244.3972354","latitude":"2.0264648","rectascension":"242.8183620","declination":"-19.0254257","azimuth":"54.9178645","height":"10.0746364","speed":"0.0409553","house":"198.4448549","housenumber":"7.6148285"},{"index":"7","name":"Uranus","longitude":"13.9176630","latitude":"-0.6343729","rectascension":"13.0560255","declination":"4.9044887","azimuth":"277.9306551","height":"17.1538624","speed":"0.0440238","house":"338.6904568","housenumber":"12.2896819"},{"index":"8","name":"Neptune","longitude":"336.9324680","latitude":"-0.7312275","rectascension":"338.9322718","declination":"-9.6439048","azimuth":"316.0669931","height":"29.7668440","speed":"0.0377316","house":"311.3446419","housenumber":"11.3781547"},{"index":"9","name":"Pluto","longitude":"284.7024410","latitude":"2.1040809","rectascension":"285.7138495","declination":"-20.5324945","azimuth":"16.5806012","height":"28.2971555","speed":"0.0268487","house":"250.5624957","housenumber":"9.3520832"}]},"moon":{"phase":{"dynamic":"dsc","value":27.702609141486,"total":29.530588,"percent":93.809879916667,"illumination":6.1901200833333}}}
/*
for( var i=0;i< data.astropositions.positions.length; ++i ){
	var body = data.astropositions.positions[i];
  	console.log( body.name )
	console.log( "RA: " + body.rectascension ); 
	console.log( "Dec: " + body.declination ) ;
	console.log( "Az: " + body.azimuth ) ;
	console.log( "Alt: " + body.height ) ;

}
*/
$.getJSON(url, function(data) {
  data = JSON.parse(data);

  data.astropositions.positions.map(function (v) {
            console.log(v.name);
            
        });      

  //console.log( data );
  for( var i=0; i< data.astropositions.positions.length; ++i ){
	var body = data.astropositions.positions[i];
  	console.log( body.name )
	console.log( "RA: " + body.rectascension ); 
	console.log( "Dec: " + body.declination ) ;
	console.log( "Az: " + body.azimuth ) ;
	console.log( "Alt: " + body.height ) ;
	}
  
});


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

		this.loadBodiesData();
		this.bodies = [];
		//this.bodies = [];  //sun, moon, planets
		//this.stars   = [];
	},

	update: function(){
		for(var i=0; i<this.bodies.length; i++ ){
			this.calculateLocalCoordinates( this.bodies[i] )			
		}
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

	coord_to_horizon: function ( ra, dec )
	{
	    // compute hour angle in degrees
	    var ha = mean_sidereal_time( ) - ra * this.HOURS2DEG;
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
		var url1 = 'http://www.astro-phys.com/api/de406/states?date=';
		var url2 = '&bodies=sun,mercury,venus,earth,moon,mars,jupiter,saturn,uranus,neptune,pluto&unit=km'; 

		var url = url1 + this.getJulianDay() + url2;

		var array = [];

		$.getJSON(url, function(data) {

			for( var body in data.results){
				var pos   = data.results[body][0] ;
				//var v   = data.results[body][1] ;

				var x = pos[0];
				var y = pos[1];
				var z = pos[2];

				//var ans = this.calculatePolarCoordinates(x, y, z);
				ra  = Math.atan2(y, x)*SKY.RAD2DEG + 180;
				dec = Math.atan2(z, Math.sqrt( x*x + y*y ))*SKY.RAD2DEG ;

				var newBody = new SKY.Body( body, ra, dec );
				newBody.x = x;
				newBody.y = y;
				newBody.z = z;
				newBody.distance = Math.sqrt( x*x + y*y + z*z );
				console.log( newBody );
				console.log( SKY.bodies )
				//SKY.bodies.add[ newBody ];
			}

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
	}
}


var year = 2015;
var month = 12;
var day = 20.1213;


var hours 		 = (day - Math.floor(day)) * 24;
var minutes      = hours-Math.floor(hours) * 60;
var seconds      = minutes-Math.floor(minutes) * 60;
var milliseconds = (seconds- Math.floor(seconds))*1000;

var utc = new Date(year, month, 
					Math.floor(day), Math.floor(hours), 
					Math.floor(minutes), Math.floor(seconds), 
					milliseconds );

//var SKY = Object.create(SKY);

//SKY.objects.add( new SKY.Object("Sun", 12, 12, -27) );
//...

//SKY.stars.add( new SKY.Star("..."))

//var model = SKY.init(utc, 0.12, 39.45 );
//model.update();
//model.log();

