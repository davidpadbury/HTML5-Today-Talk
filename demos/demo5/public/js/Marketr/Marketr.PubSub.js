(function(Marketr) {
	
	Marketr.PubSub = new function() {
		var subs = {},
			sub = function(topic, ctx, fn) {
				(subs[topic] || (subs[topic] = [])).push( fn ? function() { fn.apply(ctx, arguments); } : ctx );
				return this;
			},
			pub = function(topic, data) {
				var s = (subs[topic] || []),
					i,l;
					
				for ( i = 0, l = s.length; i < l; i++ ) {
					s[i](data);
				}
				
				return this;
			};
		
		return {
			sub: sub,
			pub: pub
		};
	};
	
})(window.Marketr || (window.Marketr = {}));