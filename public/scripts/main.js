require.config({
	baseUrl: 'scripts',
	paths: {
		jquery: '../lib/jquery/jquery-1.11.3',
		jCookie: '../lib/jquery/jquery.cookie',
		jTable: '../lib/jquery/jquery.tablesorter',
		underscore: '../lib/underscore/underscore',
		backbone: '../lib/backbone/backbone',
		template: '../templates',
		highChart: '../lib/highcharts/highcharts',
		highStock: '../lib/highcharts/highstocks'
	} 
});

require([
	'app'
], function(App) {
	App.initialize();
});