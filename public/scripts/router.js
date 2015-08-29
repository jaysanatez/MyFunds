define([
	'jquery',
	'jCookie',
	'underscore',
	'backbone',
	'views/public-nav',
	'views/private-nav',
	'views/login',
	'views/home',
	'views/purchases',
	'views/portfolio',
	'views/port-history',
	'views/reports'
], function($, jCookie, _, Backbone, PublicNav, PrivateNav, LoginView, HomeView, PurchasesView, PortfolioView, PortfolioHistoryView, ReportView) {
	var AppRouter = Backbone.Router.extend({ 
		routes: {
			'login': 'login',
			'login?:forced' : 'login',
			'home': 'home',
			'purchases': 'purchases',
			'portfolio': 'portfolio',
			'portfolio/history': 'portHistory',
			'reports': 'reports',
			'': 'default'
		},
		login: function(force) {
			forced = force ? force.split('=')[1] || '' : '';

			// if logged in, go to home
			var userId = $.cookie('userId');
			if (userId) {
				this.navigate('home', true);
			} else {
				// render login
				this.navigate('login');
				var pubNav = new PublicNav();

				if (forced == 'yes') {
					var loginView = new LoginView('You must login first.', '');
				} else if (forced == 'no') {
					var loginView = new LoginView('', 'Logged out successfully.');
				} else {
					var loginView = new LoginView();
				}
			}
		},
		home: function() {
			// if not logged in, go to login
			var userId = $.cookie('userId');
			if (!userId) {
				this.navigate('login?forced=yes', true);
			} else {
				// render home page
				var priNav = new PrivateNav();
				var homeView = new HomeView();
			}
		},
		purchases: function() {
			// if not logged in, go to login
			var userId = $.cookie('userId');
			if (!userId) {
				this.navigate('login?forced=yes', true);
			} else {
				// render home page
				var priNav = new PrivateNav();
				var purchaseView = new PurchasesView();
			}
		},
		portfolio: function() {
			// if not logged in, go to login
			var userId = $.cookie('userId');
			if (!userId) {
				this.navigate('login?forced=yes', true);
			} else {
				// render home page
				var priNav = new PrivateNav();
				var portfolioView = new PortfolioView();
			}
		},
		portHistory: function() {
			// if not logged in, go to login
			var userId = $.cookie('userId');
			if (!userId) {
				this.navigate('login?forced=yes', true);
			} else {
				// render home page
				var priNav = new PrivateNav();
				var portfolioHistoryView = new PortfolioHistoryView();
			}
		},
		reports: function() {
			// if not logged in, go to login
			var userId = $.cookie('userId');
			if (!userId) {
				this.navigate('login?forced=yes', true);
			} else {
				// render home page
				var priNav = new PrivateNav();
				var reportView = new ReportView();
			}
		},
		default: function() {
			this.navigate('login', true);
		}
	});

	var initialize = function() {
		var app_router = new AppRouter();
		Backbone.history.start();
	}

	return {
		initialize: initialize
	};
});