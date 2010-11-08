(function(Marketr, ko) {
	var chartKey = 'marketr-chart';
	
	ko.bindingHandlers.chart = {
		
		init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
			var values = valueAccessor();
			var chart = new Highcharts.Chart({
				chart: {
					renderTo: element,
					defaultSeriesType: 'line',
					margin: [15, 5, 5, 35],
					height: 150
				},
				legend: {
					enabled: false
				},
				series: [{
					data: values
				}],
				title: {
					text: null
				},
				xAxis: {
					labels: {
						enabled: false
					},
					title: {
						text: null
					}
				},
				yAxis: {
					min: 0,
					max: 100,
					title: {
						text: null
					}
				}
			});
			
			if (values.length == 0) {
				chart.showLoading();
			}
			
			$(element).data(chartKey, chart);
		},
		
		update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
			var chart = $(element).data(chartKey),
				series = chart.series[0],
				chartData = series.data,
				data = valueAccessor();
				
			if ( data && data.length ) {
				chart.hideLoading();
				
				if ( chartData.length == data.length && chartData[1] == data[0] ) {
					// Make the rather bold assumption that there's a new value on the end
					series.addPoint( data.slice(-1)[0], true, true );
				} else {
					// Replace data and redraw
					series.setData( data, true );
				}
			} else {
				chart.showLoading();
			}
		}

	};
	
})(window.Marketr || (window.Marketr == {}), ko);