define([
	'underscore',
	'backbone',
	'jquery',
	'text!template/loading.html'
], function(_, Backbone, $, LoadingTemplate) {
	var LoadingView = Backbone.View.extend({
		initialize: function(element) {
			this.$el = element;
			this.render();
		},
		render: function() {
        	var compTmpl = _.template(LoadingTemplate);
			this.$el.html(compTmpl);
		}
	});

	return LoadingView;
});