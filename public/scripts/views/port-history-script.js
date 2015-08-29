define([
	'underscore',
	'backbone',
	'jquery',
	'models/stock-graph',
	'text!template/port-hist-script.html'
], function(_, Backbone, $, StockGraph, ScriptTemplate) {
	function findRecordWithDate(report, date) {
		for (var i = 0; i < report.history.length; i++) { // iterating through fund price history
			var r = report.history[i];
			if (date.split('T')[0] == r.date) {
				return r;
			}
		}
		return null;
	}

	return Backbone.View.extend({
		el: $('#scripts'),
		initialize: function(userId, data) {
			this.userId = userId;
			this.data = data;
			this.model = new StockGraph(userId, data.get('start'), data.get('end'));
			this.error = '';
			var that = this;

			this.model.fetch({
				failure: function(error) {
					that.error = 'There was an error connecting to the server.';
				}
			}).then(function(response) {
				that.render();
			});
		},
		render: function() {
			var reports = this.model.get('reports')
			var data = this.data.get('data');

			for (var i = 0; i < data.length; i++) {
				var d = data[i];

				for (var j = 0; j < reports.length; j++) { // iterating through fund reports
					var report = reports[j];
					var record = findRecordWithDate(report, d.date);
					if (record != null) {
						for (var k = 0; k < d.shares.length; k++) {
							if (d.shares[k].name == report.stockName) {
								d.shares[k].price = parseFloat(record.close);
							}
						}
					}
				}

				d.totalValue = 0;
				var valid = true;
				for (var k = 0; k < d.shares.length; k++) {
					var obj = d.shares[k];
					if (obj.price != undefined) {
						d.totalValue += obj.count * obj.price;
					} else {
						valid = false;
					}
				}

				if (!valid && i != 0) {
					d.totalValue = data[i - 1].totalValue;
				}
			} 

			console.log(data);
			var compTmpl = _.template(ScriptTemplate);
			this.$el.html(compTmpl({ 'data': data, 'error': this.error }));
		}
	});
});