(function(Marketr) {

	Marketr.SymbolListItemViewModel = function(symbol) {
		this.symbol = symbol;
		this.price = ko.observable('-');
		this.direction = ko.observable(null);
		this.selected = false;
		this.newOrder = ko.observable(false);
	
		this.initialize();
	}

	Marketr.SymbolListItemViewModel.prototype = {
	
		initialize: function() {
			Marketr.PubSub.pub( Marketr.Topics.symbolSubscribe, {
				symbol: this.symbol
			});
			Marketr.PubSub.sub( Marketr.Topics.symbolSelected, this, this._symbolSelected );
			Marketr.PubSub.sub( Marketr.Topics.symbolTick, this, this._tick );
			Marketr.PubSub.sub( Marketr.Topics.newOrder, this, this._newOrder );
		},
	
		remove: function(e) {
			$(this).trigger('removing', this);
			Marketr.PubSub.pub( Marketr.Topics.symbolUnsubscribe, {
				symbol: this.symbol
			});
		},

		select: function() {
			this.selected = true;
			this.newOrder(false);
			Marketr.PubSub.pub( Marketr.Topics.symbolSelected, {
				symbol: this.symbol
			});
		},
	
		_tick: function(data) {
			var p;
			
			if ( this.symbol === data.symbol ) {
				p = this.price();
				
				if (p < data.price) {
					this.direction( 'up' );
				} else if ( p > data.price ) {
					this.direction( 'down' );
				} else {
					this.direction( null );
				}
				
				this.price( data.price );
			}
		},
		
		_newOrder: function(data) {
			if ( !this.selected && data.symbol === this.symbol ) {
				this.newOrder( true );
			}
		},
		
		_symbolSelected: function( data ) {
			if ( data.symbol !== this.symbol) {
				this.selected = false;
			}
		}
	
	};
	
})(window.Marketr || (window.Marketr = {}));