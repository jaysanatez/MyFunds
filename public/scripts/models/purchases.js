define([
	'underscore',
	'backbone',
	'jquery',
	'models/purchase'
], function(_, Backbone, $, Purchase) {
	return Backbone.Collection.extend({
		model: Purchase,
		initialize: function(userId) {
			this.url = '/api/users/' + userId + '/purchases';
		}
	});
});