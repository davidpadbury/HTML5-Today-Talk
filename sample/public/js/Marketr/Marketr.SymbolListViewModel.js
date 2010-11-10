(function(Marketr) {

	Marketr.SymbolsListViewModel = function() {
		this.lookupText = ko.observable('');
		this.items = ko.observableArray([]);
	};

	Marketr.SymbolsListViewModel.prototype = {
		lookupSymbol: function(e) {
			var symbol = this.lookupText();
		
			this.addSymbol(symbol);
			this.lookupText('');
		},
	
		addSymbol: function(symbol) {
			symbol = symbol.toUpperCase();
		
			var itemViewModel = new Marketr.SymbolListItemViewModel( symbol );
			$(itemViewModel).bind('removing', $.proxy(this.removeSymbol, this));
			this.items.push( itemViewModel );
		},
	
		removeSymbol: function(e, s) {
			this.items.remove( s );
		}
	};

})(window.Marketr || (window.Marketr = {}));