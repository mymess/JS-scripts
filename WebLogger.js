var WEBLOGGER = WEBLOGGER || {}

WEBLOGGER = {
	init: function(){
		this.div =  document.createElement('div');
		this.div.id = 'logger'
		this.div.style.fontFamily= 'Menlo,Courier New'
		this.div.style.fontSize= "16px";
		this.div.style.backgroundColor = 'black';
		this.div.width = '100%';
		this.div.height = '100%';
		$('body').append(this.div);
	},

	log: function(o){
		

		var s = '';
		if (typeof o==='string'){
			s = o.replace(new RegExp("\n", 'gi'), "</br>")		
			console.log( s )			
		}else if( Object.prototype.toString.call( o ) === '[object Array]' ) {
			s = JSON.stringify( o ); 
		}else if (typeof o==='object') {
			//s = o.replace(new RegExp("\n", 'gi'), "</br>");
			s = JSON.stringify( o ); 
		}
		
		this.div.innerHTML += s;
		this.br();
	},

	warn: function(o){
		var span =  document.createElement('span');
		span.style.color='yellow';
		if (typeof o==='string'){
			s = o.replace(new RegExp("\n", 'gi'), "</br>")		
			console.log( s )			
		}
		span.textContent = s;
		
		this.div.appendChild(span);
		this.br();
	},

	error: function(o){
		var span =  document.createElement('span');
		span.style.color='red';

		if (typeof o==='string'){
			s = o.replace(new RegExp("\n", 'gi'), "</br>")		
			console.log( s )			
		}
		span.textContent = s;

		this.div.appendChild(span);		
		this.br();
	},

	br: function(){
		var br =  document.createElement('br');
		this.div.appendChild(br);
	}

}



