define([
	'underscore',
	'backbone',
	'jquery'
], function(_, Backbone, $) {
	return Backbone.Model.extend({
		initialize: function(userId) {
			this.urlRoot = '/api/users/' + userId + '/portfolio';
		}
	});
});