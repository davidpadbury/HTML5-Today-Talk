
(function(Marketr, $) {
	
	var dataService,
		symbolsListViewModel,
		detailViewModel;
		
	Marketr.App = {
		initialize: function() {
			dataService = new Marketr.SymbolDataService();
			
			symbolsListViewModel = new Marketr.SymbolsListViewModel();
			
			ko.applyBindings( symbolsListViewModel, $('#symbols')[0] );
		}
	};
	
	
})(window.Marketr || (window.Marketr = {}), window.jQuery);