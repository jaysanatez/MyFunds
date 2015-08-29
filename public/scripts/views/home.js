define([
	'underscore',
	'backbone',
	'jquery',
	'jCookie',
	'models/user',
	'views/loading',
	'text!template/home.html'
], function(_, Backbone, $, jCookie, User, LoadingView, HomeTemplate) {
	return Backbone.View.extend({
		el: $('#content'),
		initialize: function() {
			this.error = '';
			this.userId = $.cookie('userId');
			this.model = new User(this.userId);

			var that = this;
			var loadingView = new LoadingView(this.$el);
			
			this.model.fetch({
				failure: function(error) {
					that.error = 'The was an error connecting to the database.';
				}
			}).then(function(response) {
				that.render();
			});
		},
		render: function() {
			var compTmpl = _.template(HomeTemplate);
			this.$el.html(compTmpl({ 'user': this.model, 'error': this.error }));
			$('#net-value').tablesorter();
			$('.net').each(function(net) {
				var b = $(this).text().includes('+');
				$(this).children().first().css('background-color', b ? '#99FF99' : '#FF9999');
			});
		}
	});
});