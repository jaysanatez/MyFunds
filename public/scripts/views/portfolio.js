define([
	'underscore',
	'backbone',
	'jquery',
	'jCookie',
	'jTable',
	'views/loading',
	'views/portfolio-script',
	'models/portfolio',
	'models/stock-graph',
	'text!template/portfolio.html',
	'highStock'
], function(_, Backbone, $, jCookie, jTable, LoadingView, PortfolioScript, Portfolio, StockGraph, PortfolioTemplate, hs) {
	return Backbone.View.extend({
		el: $('#content'),
		initialize: function() {
			this.error = '';
			this.userId = $.cookie('userId');
			this.model = new Portfolio(this.userId);

			var loadingView = new LoadingView(this.$el);
			var that = this;

			this.model.fetch({
				failure: function(error) {
					that.error = 'The was an error connecting to the database.';
				}
			}).then(function(response) {
				that.render();
			});
		},
		render: function() {
			var compTmpl = _.template(PortfolioTemplate);
			this.$el.html(compTmpl({ 'portfolio': this.model.get('stocks'), 'error': this.error }));

			if (this.model) {
				var that = this;
				var stockGraph = new StockGraph(this.userId, this.model.get('startDate'), this.model.get('endDate'));
				stockGraph.fetch({
					failure: function(error) {
						that.error = 'There was an error connecting to the database.';
					}
				}).then(function(response) {
					var script = new PortfolioScript(that.model.get('stocks'), response.reports);
					script.render();
				});
			}
		}
	});
});