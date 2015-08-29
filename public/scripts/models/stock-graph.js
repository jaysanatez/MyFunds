define([
	'underscore',
	'backbone',
	'jquery'
], function(_, Backbone, $) {
	var PortfolioGraph = Backbone.Model.extend({
		initialize: function(userId, start, end) {
			this.urlRoot = '/api/users/' + userId + '/report/history/?start=' + start + '&end=' + end;
		}
	});

	return PortfolioGraph;
});