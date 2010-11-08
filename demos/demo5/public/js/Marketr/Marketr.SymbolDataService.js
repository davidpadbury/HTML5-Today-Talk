(function(Marketr) {
	
	
	Marketr.SymbolDataService = function() {
		this.initialize();
	};
	
	Marketr.SymbolDataService.prototype = {
		initialize: function() {
			this.socket = new io.Socket();
			
			this.socket.on('connect', $.proxy( this._connect, this ) );
			this.socket.on('disconnect', $.proxy( this._disconnect, this ) );
			this.socket.on('message', $.proxy( this._message, this) );
			
			Marketr.PubSub.sub( Marketr.Topics.symbolSubscribe, this, this._subscribe );
			Marketr.PubSub.sub( Marketr.Topics.symbolUnsubscribe, this, this._unsubscribe );
			Marketr.PubSub.sub( Marketr.Topics.requestRecentData, this, this._requestRecentData );
			
			this.socket.connect();
			
			this.handlers = {
				tick: this._ticked,
				'recent-data': this._receivedRecentData,
				'new-order': this._newOrder
			};
		},
		
		_connect: function() {
		},
		
		_disconnect: function() {
		},
		
		_send: function(data) {
			this.socket.send(JSON.stringify(data));
		},
		
		_message: function(s) {
			var data = JSON.parse(s);
			(this.handlers[data.topic] || this._unhandledTopic)(data);
		},
		
		_requestRecentData: function(data) {
			this._send({
				topic: 'request-recent-data',
				symbol: data.symbol
			});
		},
		
		_unhandledTopic: function(data) {
			console.log('Topic ' + data.topic + ' has no handler');
		},
		
		_subscribe: function(data) {
			this._send({
				topic: 'subscribe-tick',
				symbol: data.symbol
			});
		},
		
		_unsubscribe: function(data) {
			this.socket.send({
				topic: 'unsubscribe-tick',
				symbol: data.symbol
			});
		},

		_ticked: function(data) {
			Marketr.PubSub.pub( Marketr.Topics.symbolTick, {
				symbol: data.symbol,
				price: data.price
			});
		},
		
		_receivedRecentData: function(data) {
			Marketr.PubSub.pub( Marketr.Topics.receivedRecentData, {
				symbol: data.symbol,
				recentPrices: data.prices,
				recentOrders: data.orders
			});
		},
		
		_newOrder: function(data) {
			Marketr.PubSub.pub( Marketr.Topics.newOrder, {
				symbol: data.symbol,
				user: data.user,
				size: data.size
			});
		}
	};
	
})(window.Marketr || (window.Marketr = {}));