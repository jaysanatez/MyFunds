define([
	'underscore',
	'backbone',
	'jquery',
	'jCookie',
	'views/loading',
	'views/port-history-script',
	'text!template/port-history.html',
	'models/portfolio-history',
	'highStock'
], function(_, Backbone, $, jCookie, LoadingView, PortHistoryScript, PortHistTemplate, PortfolioHistory, hs) {
	return Backbone.View.extend({
		el: $('#content'),
		initialize: function() {
			this.error = '';
			this.userId = $.cookie('userId');
			this.model = new PortfolioHistory(this.userId);

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
			var loadingView = new LoadingView(this.$el);
			var compTmpl = _.template(PortHistTemplate);
			this.$el.html(compTmpl({ 'data': this.model, 'error': this.error }));

			if (this.model  && this.error == '') {
				var portHistScript = new PortHistoryScript(this.userId, this.model);
			}
		}
	});
});