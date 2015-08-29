define([
	'underscore',
	'backbone',
	'jquery',
	'jCookie',
	'text!template/private-nav.html'
], function(_, Backbone, $, jCookie, NavTemplate) {
	return Backbone.View.extend({
		el: $('#nav'),
		initialize: function() {
			this.render();
		},
		render: function() {
			var compTmpl = _.template(NavTemplate);
			this.$el.html(compTmpl);
		},
		events: {
			'click #logout': 'attemptLogout'
		},
		attemptLogout: function(e) {
			e.preventDefault();
			var success = $.removeCookie('userId', { path: '/' });
			if (success) {
				Backbone.history.navigate('login?forced=no', true);
			}
		}
	});
});