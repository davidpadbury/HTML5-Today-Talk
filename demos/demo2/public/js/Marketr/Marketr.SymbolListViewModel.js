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
		
			this.items.push( symbol );
		},
	};

})(window.Marketr || (window.Marketr = {}));