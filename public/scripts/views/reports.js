define([
	'underscore',
	'backbone',
	'jquery',
	'jCookie',
	'models/rep-settings',
	'views/loading',
	'text!template/reports.html'
], function(_, Backbone, $, jCookie, ReportSettings, LoadingView, ReportsTemplate) {
	return Backbone.View.extend({
		el: $('#content'),
		initialize: function() {
			this.error = '';
			var userId = $.cookie('userId');

			var loadingView = new LoadingView(this.$el);
			var that = this;

			this.model = new ReportSettings(userId);
			this.model.fetch({
				failure: function(error) {
					that.error = 'The was an error connecting to the database.';
				}
			}).then(function(response) {
				that.render();
			});
		},
		render: function() {
			var compTmpl = _.template(ReportsTemplate);
			this.$el.html(compTmpl({ 'settings': this.model, 'error': this.error }));

			var dates = this.model.get('dates');
			$('#startDate').val(dates.start);
			$('#endDate').val(dates.end);
		}
	});
});