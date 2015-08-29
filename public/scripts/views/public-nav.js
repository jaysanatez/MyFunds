define([
	'underscore',
	'backbone',
	'jquery',
	'text!template/public-nav.html'
], function(_, Backbone, $, NavTemplate) {
	return Backbone.View.extend({
		el: $('#nav'),
		initialize: function() {
			this.render();
		},
		render: function() {
			var compTmpl = _.template(NavTemplate);
			this.$el.html(compTmpl);
		}
	});
});