define([
	'underscore',
	'backbone',
	'jquery',
	'text!template/portfolio-script.html'
], function(_, Backbone, $, ScriptTemplate) {
	return Backbone.View.extend({
		el: $('#scripts'),
		initialize: function(stocks, data) {
			this.stocks = stocks;
			this.data = data;
		},
		render: function() {
			var compTmpl = _.template(ScriptTemplate);
			this.$el.html(compTmpl({ 'stocks': this.stocks, 'data': this.data }));
		}
	});
});