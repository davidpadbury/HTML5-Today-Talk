
(function(Marketr, $) {
	
	var dataService,
		symbolsListViewModel,
		detailViewModel;
		
	Marketr.App = {
		initialize: function() {
			dataService = new Marketr.SymbolDataService();
			
			symbolsListViewModel = new Marketr.SymbolsListViewModel();
			detailViewModel = new Marketr.DetailViewModel();
			
			ko.applyBindings( symbolsListViewModel, $('#symbols')[0] );
			ko.applyBindings( detailViewModel, $('#detail')[0] );
		}
	};
	
	
})(window.Marketr || (window.Marketr = {}), window.jQuery);