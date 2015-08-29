define([
	'underscore',
	'backbone',
	'jquery',
	'jCookie',
	'text!template/login.html'
], function(_, Backbone, $, jCookie, LoginTemplate) {
	var LoginView = Backbone.View.extend({
		initialize: function() {
			this.error = '';
			this.message = '';
			this.render();
		},
		initialize: function(error, message) {
			this.error = error;
			this.message = message;
			this.render();
		},
		el: $('#content'),
		render: function() {
			var compTmpl = _.template(LoginTemplate);
			this.$el.html(compTmpl({ 'error': this.error, 'message': this.message }));
		},
		events: {
			'click #login': 'attemptLogin',
			'click #create': 'createUser',
			'click input': 'suppressLink',
			'focusout input#newEmail': 'checkIfTaken',
			'focusout input#newName': 'checkWhosEmpty'
		},
		attemptLogin: function(e) {
			this.suppressLink(e);
			var email = $('#inputEmail').val().trim();
			var body = { 'email': email };
			var that = this;

			// send to /api/login
			$.ajax({
		        type: 'POST',
		        dataType: 'json',
		        url: '/api/login',
		        data: body,
		        success: function (data) {
		        	if (data.result == 'success') {
		        		that.routeToHome(data.userId);
		        	} else {
		        		that.error = 'No user exists with email ' + email + '.';
		        		that.message = '';
		        		$('#inputEmail').val('');
		        		that.render();
		        	}
		        },
		        error: function (error) {
		        	that.error = 'There was an error accessing the database.';
		        	that.message = '';
		        	that.render();
		        }
		    });
		},
		createUser: function(e) {
			this.suppressLink(e);
			var name = $('#newName').val().trim();
			var email = $('#newEmail').val().trim(); 
			var body = { 'email': email, 'name': name };
			var that = this;

			if (email.trim().length > 0 && name.trim().length > 0) {
				$.ajax({
			        type: 'POST',
			        dataType: 'json',
			        url: '/api/users',
			        data: body,
			        success: function (data) {
			        	if (!data.error) {
			        		console.log(data);
			        		that.routeToHome(data._id);
			        	} else {
			        		that.error = data.error;
			        		that.message = '';
			        		$('#newName').val('');
			        		$('#newEmail').val('');
			        		that.render();
			        	}
			        },
			        error: function (error) {
			        	that.error = 'There was an error accessing the database.';
			        	that.message = '';
			        	that.render();
			        }
			    });
			} else {
				that.checkWhosEmpty();
			}
		},
		checkIfTaken: function() {
			var email = $('#newEmail').val();
			var that = this;

			if (email.trim().length > 0) {
				$.ajax({
			        type: 'GET',
			        dataType: 'json',
			        url: '/api/users/' + email + '/valid',
			        success: function (data) {
			        	that.displayValidity(data.valid);
			        }
			    });
			} else {
				that.displayValidity(false);
			}
		},
		checkWhosEmpty: function() {
			var email = $('#newEmail');
			if (email.val().trim().length == 0) {
				email.parent().addClass('has-error');
			} else {
				email.parent().removeClass('has-error');
			}

			var name = $('#newName');
			if (name.val().trim().length == 0) {
				name.parent().addClass('has-error');
			} else {
				name.parent().removeClass('has-error');
			}
		},
		routeToHome: function(id) {
			$.cookie('userId', id, { path: '/' });
			Backbone.history.navigate('home', true);
		},
		suppressLink: function(e) {
			e.preventDefault();
		},
		clearValidityClasses: function() {
			$('#newEmail').parent().removeClass('has-success');
			$('#newEmail').parent().removeClass('has-error');
		},
		displayValidity: function(isValid) {
			$('#newEmail').parent().addClass(isValid ? 'has-success' : 'has-error');
			$('#newEmail').parent().removeClass(isValid ? 'has-error' : 'has-success');
		}
	});

	return LoginView;
});