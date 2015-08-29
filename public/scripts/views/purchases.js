define([
	'underscore',
	'backbone',
	'jquery',
	'jCookie',
	'jTable',
	'views/loading',
	'models/purchases',
	'text!template/purchases.html'
], function(_, Backbone, $, jCookie, jTable, LoadingView, Purchases, PurchasesTemplate) {
	var PurchasesView = Backbone.View.extend({
		el: $('#content'),
		initialize: function() {
			this.error = '';
			this.userId = $.cookie('userId');
			this.collection = new Purchases(this.userId);

			var that = this;
			var loadingView = new LoadingView(this.$el);
			
			this.collection.fetch({
				failure: function(error) {
					that.error = 'The was an error connecting to the database.';
				}
			}).then(function(response) {
				that.render();
			});
		},
		render: function() {
	    	var compTmpl = _.template(PurchasesTemplate);
			this.$el.html(compTmpl({ 'collection': this.collection.models, 'error': this.error }));
			$('#purchases').tablesorter();
		}
	});

	return PurchasesView;
});