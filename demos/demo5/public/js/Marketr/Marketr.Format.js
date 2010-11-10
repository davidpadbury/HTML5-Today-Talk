
(function(Marketr) {
	
	function formatPrice(val) {
		// Round to 2 dp
		if ( typeof val !== 'number') 
			return val;
			
		var v = Math.round(val * 100) / 100;
			s = v + '',
			m = /\.(\d+)/.exec(s),
			dps = m != null ? m[1].length : 0;
			
		if ( s.indexOf('.') < 0 ) {
			s += '.';
		}
		
		for ( var i = 0; i < 2 - dps; i++ ) {
			s += '0';
		}
		
		return s;
	}
	
	Marketr.Format = {
		price: formatPrice
	};
	
})(window.Marketr || (window.Marketr = {}));