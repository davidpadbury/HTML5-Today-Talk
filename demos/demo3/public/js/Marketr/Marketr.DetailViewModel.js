(function(Marketr) {
	
	Marketr.DetailViewModel = function() {
		this.symbol = ko.observable('');
		this.price = ko.observable('-');
		this.prices = ko.observableArray([]);
		this.orders = ko.observableArray([]);
		
		this.initialize();
	};
	
	Marketr.DetailViewModel.prototype = {
		initialize: function() {
			
			this.symbol('');
			
			Marketr.PubSub.sub( Marketr.Topics.symbolSelected, this, this._symbolSelected );
			Marketr.PubSub.sub( Marketr.Topics.receivedRecentData, this, this._receivedRecentData );
			Marketr.PubSub.sub( Marketr.Topics.newOrder, this, this._newOrder );
			Marketr.PubSub.sub( Marketr.Topics.symbolTick, this, this._tick );
		},
		
		_symbolSelected: function(data) {
			this._gotPrices = false;
			this.prices([]);
			this.orders([]);
			this.symbol( data.symbol );
			this.price( '-' );
			
			Marketr.PubSub.pub( Marketr.Topics.requestRecentData, {
				symbol: data.symbol
			});
		},
		
		_receivedRecentData: function(data) {
			if (data.symbol === this.symbol()) {
				this.prices.push.apply( this.prices, data.recentPrices );
				this.orders.push.apply( this.orders, data.recentOrders );
				this._gotPrices = true;
			}
		},
		
		_tick: function(data) {
			if ( this.symbol() === data.symbol ) {
				this.price( data.price );
				
				// Push new price on to prices list
				if ( this._gotPrices ) {
					this.prices().shift(); // Remove element from underlying array, so not to notify
					this.prices.push( data.price );
				}
			}
		},
		
		_newOrder: function(data) {
			if ( this.symbol() === data.symbol ) {
				this.orders.unshift({
					user: data.user,
					size: data.size
				});
			}
		}
	};
	
})(window.Marketr || (window.Marketr = {}));