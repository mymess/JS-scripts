var WEBLOGGER = WEBLOGGER || {}

var WEBLOGGER = function(){
	this.div =  document.createElement('div');
	this.div.id = 'logger'
	this.div.style.fontFamily= 'Menlo,Courier New'
	this.div.style.fontSize= "16px";
	this.div.style.backgroundColor = 'black';
	this.div.width = '100%';
	this.div.height = '1000px';

	$('body').append(this.div);
}


WEBLOGGER.prototype.log = function(o){
	var s = '';
	if (typeof o==='string'){
		var chunks = o.split("\n")
		chunks[0] = '>'.concat(chunks[0]);
		for (var i=0; i< chunks.length; ++i){
			var chunk = chunks[i];
			var cSpan =  document.createElement('span');
			cSpan.style.color = 'white';
			cSpan.textContent = chunk;
			this.div.appendChild(cSpan);
			this.br();
		}
		
	}else if (typeof o==='object') {
		var cSpan =  document.createElement('span');
		cSpan.textContent = JSON.stringify( o );
		this.div.appendChild(cSpan) ;
		this.br();
	}	
}

WEBLOGGER.prototype.warn = function(o){
	if (typeof o==='string'){
			var chunks = o.split("\n")
			chunks[0] = '>'.concat(chunks[0]);
			for (var i=0; i< chunks.length; ++i){
				var chunk = chunks[i];
				var cSpan =  document.createElement('span');
				cSpan.style.color='yellow';
				cSpan.textContent = chunk;
				this.div.appendChild(cSpan);
				this.br();
			}
			
		}
	};

WEBLOGGER.prototype.error = function(o){
	if (typeof o==='string'){
			var chunks = o.split("\n")
			chunks[0] = '>'.concat(chunks[0]);

			for (var i=0; i< chunks.length; ++i){
				var chunk = chunks[i];
				var cSpan =  document.createElement('span');
				cSpan.style.color='red';
				cSpan.textContent = chunk;
				this.div.appendChild(cSpan);
				this.br();
			}
			
		}
}

WEBLOGGER.prototype.br = function(){
	var br =  document.createElement('br');
	this.div.appendChild(br);
}

/*
WEBLOGGER = {
	init: function(){
		this.div =  document.createElement('div');
		this.div.id = 'logger'
		this.div.style.fontFamily= 'Menlo,Courier New'
		this.div.style.fontSize= "16px";
		this.div.style.backgroundColor = 'black';
		this.div.width = '100%';
		this.div.height = '1000px';

		$('body').append(this.div);
	},

	log: function(o){
		var s = '';
		if (typeof o==='string'){
			var chunks = o.split("\n")
			chunks[0] = '>'.concat(chunks[0]);
			for (var i=0; i< chunks.length; ++i){
				var chunk = chunks[i];
				var cSpan =  document.createElement('span');
				cSpan.style.color = 'white';
				cSpan.textContent = chunk;
				this.div.appendChild(cSpan);
				this.br();
			}
			
		}else if (typeof o==='object') {
			var cSpan =  document.createElement('span');
			cSpan.textContent = JSON.stringify( o );
			this.div.appendChild(cSpan) ;
			this.br();
		}		
		
	},

	warn: function(o){		
		if (typeof o==='string'){
			var chunks = o.split("\n")
			chunks[0] = '>'.concat(chunks[0]);
			for (var i=0; i< chunks.length; ++i){
				var chunk = chunks[i];
				var cSpan =  document.createElement('span');
				cSpan.style.color='yellow';
				cSpan.textContent = chunk;
				this.div.appendChild(cSpan);
				this.br();
			}
			
		}
	},

	error: function(o){
		if (typeof o==='string'){
			var chunks = o.split("\n")
			chunks[0] = '>'.concat(chunks[0]);

			for (var i=0; i< chunks.length; ++i){
				var chunk = chunks[i];
				var cSpan =  document.createElement('span');
				cSpan.style.color='red';
				cSpan.textContent = chunk;
				this.div.appendChild(cSpan);
				this.br();
			}
			
		}
	},

	br: function(){
		var br =  document.createElement('br');
		this.div.appendChild(br);
	}

}
*/