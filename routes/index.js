var express = require('express');
var request = require('request');
var router = express.Router();

// AUTHENTICATION
router.post('/api/login', function (req, res) {
	var email = req.body.email;
	var db = req.db;
	var collection = db.get('users');
	
	collection.find({ email: email }, { }, function(e, docs) {
		if (e) {
			res.send(JSON.stringify({ 'result': 'login failed ', 'error': 'database error' }));
		} else {
			if (docs.length == 0) {
				res.send(JSON.stringify({ 'result': 'login failed', 'error': 'no users exist with that email' }));
			} else {
				res.send(JSON.stringify({ 'result': 'success', 'userId': docs[0]._id }));
			}
		}
	});
});

// PUBLIC PAGE

router.get('/', function(req, res, next) {
    res.render('index');
});

// API ROUTES

router.post('/api/users', function(req, res) {
	var db = req.db;
	var users = db.get('users');

	var name = req.body.name;
	var email = req.body.email;

	if (typeof name != 'undefined' && typeof email != 'undefined') {
		users.find({ 'email': email }, { }, function(e, docs) {
			if (e) {
				res.send(JSON.stringify({ 'error': 'Could not access database' }));
			} else {
				if (docs.length == 0) {
					users.insert({ 'name': name, 'email': email }, function(err, records) {
						if (!err) {
							res.send(records);
						} else {
							res.send(JSON.stringify({ 'error': 'User could not be created' }));
						}
					});
				} else {
					res.send(JSON.stringify({ 'error': 'That email has already been taken' }));
				}
			}
		});
	} else {
		res.send(JSON.stringify({ 'error': 'Must provide name and email for user' }));
	}
});

router.get('/api/users/:id', function(req, res) 
{
	var id = req.params.id;
	var db = req.db;
	var collection = db.get('users');
	var purchases = db.get('purchases');

	if (id.length == 24) {
		collection.find({ _id: id }, { }, function(e, docs) {
			if (e) {
				res.send(JSON.stringify({ 'error': 'Id provided was in invalid format' }));
			} else {
				if (docs.length == 0) {
					res.send(JSON.stringify({ 'error': 'No user exists for id ' + id }));
				} else {
					var result = docs[0];
					purchases.find({ userId: id }, { }, function(e, docs) {
						if (e) {
							res.send(JSON.stringify({ 'error': 'Error retrieving data for user with id ' + id }));
						} else {
							if (docs.length > 0) {
								getDailyReport(id, docs, res, result, db, true);
							} else {
								res.send(JSON.stringify(result));
							}
						}
					});
				}
			}
		});
	} else 
	{
		res.send(JSON.stringify({ 'error': 'Id provided was in invalid format' }));
	}
});

router.get('/api/users/:email/valid', function(req, res) {
	var email = req.params.email;
	var db = req.db;
	var collection = db.get('users');

	collection.find({ 'email': email }, { }, function(e, docs) {
		if (e) {
			res.send(JSON.stringify({ 'valid': false }));
		} else {
			res.send(JSON.stringify({ 'valid': docs.length == 0 }));
		}
	});
});

router.get('/api/users/:id/purchases', function(req, res) {
	var id = req.params.id;
	var db = req.db;
	var users = db.get('users');
	var purchases = db.get('purchases');

	if (id.length == 24) {
		purchases.find({ userId: id }, { }, function(e, docs) {
			if (e) {
				res.send(JSON.stringify({ 'error': 'Error retrieving data for user with id ' + id }));
			} else {
				if (docs.length > 0) {
					res.send(docs);
				} else {
					users.find({ _id: id }, { }, function(e, docs) {
						if (e) {
							res.send(JSON.stringify({ 'error': 'Id provided was in invalid format' }));
						} else {
							if (docs.length == 0) {
								res.send(JSON.stringify({ 'error': 'No user exists for id ' + id }));
							} else {
								res.send(JSON.stringify([]));
							}
						}
					});
				}
			}
		});
	} else {
		res.send(JSON.stringify({ 'error': 'Id provided was in invalid format' }));
	}
});

router.get('/api/users/:id/tracks', function(req, res) {
	var id = req.params.id;
	var db = req.db;
	var users = db.get('users');
	var tracks = db.get('tracks');

	if (id.length == 24) {
		tracks.find({ userId: id }, { }, function(e, docs) {
			if (e) {
				res.send(JSON.stringify({ 'error': 'Error retrieving data for user with id ' + id }));
			} else {
				if (docs.length > 0) {
					res.send(docs);
				} else {
					users.find({ _id: id }, { }, function(e, docs) {
						if (e) {
							res.send(JSON.stringify({ 'error': 'Id provided was in invalid format' }));
						} else {
							if (docs.length == 0) {
								res.send(JSON.stringify({ 'error': 'No user exists for id ' + id }));
							} else {
								res.send(JSON.stringify([]));
							}
						}
					});
				}
			}
		});
	} else {
		res.send(JSON.stringify({ 'error': 'Id provided was in invalid format' }));
	}
});

router.get('/api/users/:id/portfolio', function(req, res) {
	var id = req.params.id;
	var db = req.db;
	var users = db.get('users');
	var purchases = db.get('purchases');

	if (id.length == 24) {
		purchases.find({ userId: id }, { }, function(e, docs) {
			if (e) {
				res.send(JSON.stringify({ 'error': 'Error retrieving data for user with id ' + id }));
			} else {
				if (docs.length > 0) {
					getPortfolio(id, docs, res);
				} else {
					users.find({ _id: id }, { }, function(e, docs) {
						if (e) {
							res.send(JSON.stringify({ 'error': 'Id provided was in invalid format' }));
						} else {
							if (docs.length == 0) {
								res.send(JSON.stringify({ 'error': 'No user exists for id ' + id }));
							} else {
								res.send(JSON.stringify({ 'error': 'No purchases exist for user with id ' + id }));
							}
						}
					});
				}
			}
		});
	} else {
		res.send(JSON.stringify({ 'error': 'Id provided was in invalid format' }));
	}
});

router.get('/api/users/:id/report/settings', function(req, res) {
	var id = req.params.id;
	var db = req.db;
	var users = db.get('users');
	var purchases = db.get('purchases');

	if (id.length == 24) {
		users.find({ _id: id }, { }, function(e, docs) {
			if (e) {
				res.send(JSON.stringify({ 'error': 'Id provided was in invalid format' }));
			} else {
				if (docs.length == 0) {
					res.send(JSON.stringify({ 'error': 'No user exists for id ' + id }));
				} else {
					var user = docs[0];
					var settings = {};
					settings.dates = {};
					purchases.find({ userId: id }, { }, function(e, docs) {
						if (e) {
							res.send(JSON.stringify({ 'error': 'Error retrieving data for user with id ' + id }));
						} else {
							if (docs.length > 0) {
								var dates = [];
								for (var i = 0; i < docs.length; i++) {
									dates.push(docs[i].date);
								}

								dates.sort(compare);
								settings.dates.start = formatDate(dates[0]);
								settings.dates.end = formatDate(new Date());
								settings.funds = getUniqueStocks(docs);

								addFundNamesToSettings(id, settings, res, db);
							} else {
								var d2 = new Date();
								var d1 = new Date(d2);
								d1.setDate(d1.getDate() - 365);

								settings.dates.start = formatDate(d1);
								settings.dates.end = formatDate(d2);
								settings.funds = [];

								addFundNamesToSettings(id, settings, res, db);
							}
						}
					});
				}
			}
		});
	} else {
		res.send(JSON.stringify({ 'error': 'Id provided was in invalid format' }));
	}
});

router.get('/api/users/:id/report/today', function(req, res) {
	var id = req.params.id;
	var db = req.db;
	var users = db.get('users');
	var purchases = db.get('purchases');

	if (id.length == 24) {
		purchases.find({ userId: id }, { }, function(e, docs) {
			if (e) {
				res.send(JSON.stringify({ 'error': 'Error retrieving data for user with id ' + id }));
			} else {
				if (docs.length > 0) {
					getDailyReport(id, docs, res, null, db, false);
				} else {
					users.find({ _id: id }, { }, function(e, docs) {
						if (e) {
							res.send(JSON.stringify({ 'error': 'Id provided was in invalid format' }));
						} else {
							if (docs.length == 0) {
								res.send(JSON.stringify({ 'error': 'No user exists for id ' + id }));
							} else {
								res.send(JSON.stringify({ 'error': 'No purchases exist for user with id ' + id }));
							}
						}
					});
				}
			}
		});
	} else {
		res.send(JSON.stringify({ 'error': 'Id provided was in invalid format' }));
	}
});

router.get('/api/users/:id/report/history', function(req, res) {
	var id = req.params.id;
	var db = req.db;
	var users = db.get('users');
	var purchases = db.get('purchases');

	var start = req.query.start;
	var end = req.query.end;

	if (typeof start == 'undefined' && typeof end == 'undefined') {
		res.send(JSON.stringify({ 'error': 'Start and end parameters were not provided' }));
	} else if (typeof start == 'undefined') {
		res.send(JSON.stringify({ 'error': 'Start parameter was not provided' }));
	} else if (typeof end == 'undefined') {
		res.send(JSON.stringify({ 'error': 'End parameter was not provided' }));
	} else if (!isValidDateString(start) || !isValidDateString(end)) {
		res.send(JSON.stringify({ 'error': 'Parameters were not formatted correctly' }));
	} else {
		if (id.length == 24) {
			purchases.find({ userId: id }, { }, function(e, docs) {
				if (e) {
					res.send(JSON.stringify({ 'error': 'Error retrieving data for user with id ' + id }));
				} else {
					if (docs.length > 0) {
						getHistoryReport(docs, start, end, res, null);
					} else {
						users.find({ _id: id }, { }, function(e, docs) {
							if (e) {
								res.send(JSON.stringify({ 'error': 'Id provided was in invalid format' }));
							} else {
								if (docs.length == 0) {
									res.send(JSON.stringify({ 'error': 'No user exists for id ' + id }));
								} else {
									res.send(JSON.stringify({ 'error': 'No purchases exist for user with id ' + id }));
								}
							}
						});
					}
				}
			});
		} else {
			res.send(JSON.stringify({ 'error': 'Id provided was in invalid format' }));
		}
	}
});

router.get('/api/users/:id/report/portfolio', function(req, res) {
	var id = req.params.id;
	var db = req.db;
	var users = db.get('users');
	var purchases = db.get('purchases');

	if (id.length == 24) {
		purchases.find({ userId: id }, { }, function(e, docs) {
			if (e) {
				res.send(JSON.stringify({ 'error': 'Error retrieving data for user with id ' + id }));
			} else {
				if (docs.length > 0) {
					getPortfolioHistory(docs, res);
				} else {
					users.find({ _id: id }, { }, function(e, docs) {
						if (e) {
							res.send(JSON.stringify({ 'error': 'Id provided was in invalid format' }));
						} else {
							if (docs.length == 0) {
								res.send(JSON.stringify({ 'error': 'No user exists for id ' + id }));
							} else {
								res.send(JSON.stringify({ 'error': 'No purchases exist for user with id ' + id }));
							}
						}
					});
				}
			}
		});
	} else {
		res.send(JSON.stringify({ 'error': 'Id provided was in invalid format' }));
	}
});

function getPortfolio(id, purchases, res) {
	var uniqueNames = getUniqueStocks(purchases);
	var stocksOwned = [];
	var firstDates = [];

	for (var i = 0; i < uniqueNames.length; i++) {
		var obj = {};
		obj.name = uniqueNames[i];
		var dates = []
		obj.numShares = 0;

		for (var j = 0; j < purchases.length; j++) {
			var name = purchases[j].stock;
			if (name == obj.name) {
				obj.numShares += purchases[j].shares;
				dates.push(purchases[j].date);
			}
		}

		var purchaseDates = dates.sort(compare);
		firstDates.push(purchaseDates[0]);
		obj.purchaseDates = purchaseDates.map(function(date) {
			return formatDate(date);
		});

		stocksOwned.push(obj);
	}

	var earliestPurchase = firstDates.sort(compare)[0];
	var m = earliestPurchase.getMonth();
	earliestPurchase.setMonth(m - 1);

	var ePFormatted = formatDate(earliestPurchase);
	var todayFormatted = formatDate(new Date());

	// add meta-data for subsequent request
	var portfolioData = {};
	portfolioData.startDate = ePFormatted;
	portfolioData.endDate = todayFormatted;
	portfolioData.stocks = stocksOwned;
	res.send(portfolioData);
}

function getDailyReport(id, docs, res, existingModel, db, includePurchases) {
	var uniqueNames = getUniqueStocks(docs);

	var urlPref = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D%27http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes.csv%3Fs%3D';
	var urlSuff = '%26f%3Dsl1d1t1c1%26e%3D.csv%27%20and%20columns%3D%27symbol%2Cprice%2Cdate%2Ctime%2Cchange%27&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
	var tickers = uniqueNames[0];
	for (var i = 1; i < uniqueNames.length; i++) {
		tickers += '%2C' + uniqueNames[i];
	}

	var url = urlPref + tickers + urlSuff;
	request({
		url: url,
		json: true
	}, function(error, response, body) {
		if (error) {
			res.send(JSON.stringify({ 'error': 'error retrieving stock data from Yahoo finance' }));
		} else {
			var ship;
			if (existingModel != null) {
				existingModel.purchased = body.query.results.row;
				ship = existingModel;
			} else {
				ship = {};
				ship.purchased = body.query.results.row;
			}

			if (includePurchases) {
				ship.purchases = docs.sort(compareDates);
			} 
			
			getTrackedFunds(res, ship, id, db);
		}
	});
}

function getTrackedFunds(res, model, id, db) {
	var tracks = db.get('tracks');

	tracks.find({ userId: id }, { }, function(e, docs) {
		if (e) {
			res.send(JSON.stringify({ 'error': 'Could not access database' }));
		} else {
			if (docs.length > 0) {
				var names = [];
				for (var i = 0; i < docs.length; i++) {
					names.push(docs[i].stock);
				}

				var urlPref = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D%27http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes.csv%3Fs%3D';
				var urlSuff = '%26f%3Dsl1d1t1c1%26e%3D.csv%27%20and%20columns%3D%27symbol%2Cprice%2Cdate%2Ctime%2Cchange%27&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
				var tickers = names[0];
				for (var i = 1; i < names.length; i++) {
					tickers += '%2C' + names[i];
				}

				var url = urlPref + tickers + urlSuff;
				request({
					url: url,
					json: true
				}, function(error, response, body) {
					if (error) {
						res.send(JSON.stringify({ 'error': 'error retrieving stock data from Yahoo finance' }));
					} else {
						model.tracked = body.query.results.row;
						res.send(model);
					}
				});
			} else {
				res.send(model);
			}
		}
	});
}

function getHistoryReport(purchases, start, end, res, existingModel) {
	var uniqueNames = getUniqueStocks(purchases);

	var urlPref = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20in%20(%22';
	var tickers = uniqueNames[0];
	var urlMid1 = '%22)%20and%20startDate%20%3D%20%22';
	var urlMid2 = '%22%20and%20endDate%20%3D%20%22';
	var urlSuff = '%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

	for (var i = 1; i < uniqueNames.length; i++) {
		tickers += '%22%2C%20%22' + uniqueNames[i];
	}

	var url = urlPref + tickers + urlMid1 + start + urlMid2 + end + urlSuff;
	request({
		url: url,
		json: true
	}, function(error, response, body) {
		if (error) {
			res.send(JSON.stringify({ 'error': 'error retrieving stock data from Yahoo finance' }));
		} else {
			var reports = [];
			var quotes = body.query.results.quote;

			for (var i = 0; i < uniqueNames.length; i++) {
				var name = uniqueNames[i];
				var report = {};
				report.stockName = name;
				var history = [];

				for (var j = 0; j < quotes.length; j++) {
					var quote = quotes[j];
					if (quote.Symbol == name) {
						var q = {};
						q.date = getNextDay(quote.Date);
						q.open = quote.Open;
						q.high = quote.High;
						q.low = quote.Low;
						q.close = quote.Close;
						history.push(q);
					}
				}

				history.sort(compareDates);

				report.history = history;
				reports.push(report);
			}

			if (existingModel != null) {
				// match them up
				for (var i = 0; i < existingModel.length; i++) {
					var item = existingModel[i];
					var name = item.name;

					for (var j = 0; j < reports.length; j++) {
						if (reports[j].stockName == name) {
							item.history = reports[j].history;
						}
					}
				}

				res.send(JSON.stringify(existingModel));
			} else {
				var history = {};
				history.reports = reports;
				res.send(JSON.stringify(history));
			}
		}
	});
}

function getPortfolioHistory(purchases, res) {
	var model = {};

	var dates = [];

	for (var i = 0; i < purchases.length; i++) {
		var d = purchases[i].date;
		if (!objExists(dates, d)) {
			dates.push(d);
		}
	}

	var start = dates.sort(compare)[0];
	var uniqueStocks = getUniqueStocks(purchases);
	var data = [];

	for(var date = new Date(start); date < new Date(); date.setDate(date.getDate() + 1)) {
		var obj = {}; 
		obj.date = new Date(date);
		obj.value = 0;
		obj.shares = [];
		data.push(obj);
	}

	populatePortfolioHistory(data, purchases);

	model.start = formatDate(start);
	model.end = formatDate(new Date());
	model.data = data;
	res.send(model);
}

function populatePortfolioHistory(data, purchases) {
	for (var i = 0; i < purchases.length; i++) {
		var p = purchases[i];

		for (var j = 0; j < data.length; j++) {
			var d =  data[j];
			if (p.date <= d.date) { // if in date range
				var stock = getStockWithName(d.shares, p.stock);
				d.value += p.price * p.shares;

				if (stock != null) {
					stock.count += p.shares;
				}
				else {
					var obj = {};
					obj.name = p.stock;
					obj.count = p.shares;
					d.shares.push(obj);
				}
			}
		}
	}

	for (var k = 0; k < data.length; k++) {
		var d = data[k];
		d.value = parseInt(d.value * 100) / 100.0;
	}
}

function addFundNamesToSettings(id, settings, res, db) {
	var tracks = db.get('tracks');

	tracks.find({ userId: id }, { }, function(e, docs) {
		if (e) {
			res.send(JSON.stringify({ 'error': 'Could not access database' }));
		} else {
			if (docs.length > 0) {
				for (var i = 0; i < docs.length; i++) {
					settings.funds.push(docs[i].stock);
				}

			} 

			res.send(settings);
		}
	});
}

function getStockWithName(arr, name) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].name == name) {
			return arr[i];
		}
	}
	return null;
}

function objExists(arr, obj) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == obj) {
			return true;
		}
	}
	return false;
}

function getUniqueStocks(purchases) {
	var uniqueNames = [];

	// get all unique stock names
	for (var i=0; i < purchases.length; i++) {
		var name = purchases[i].stock;
		if (!objExists(uniqueNames, name)) {
			uniqueNames.push(name);
		}
	}

	return uniqueNames;
}

function compareDates(a, b) {
	var dateA = Date.parse(a.date);
	var dateB = Date.parse(b.date);
	if (dateA < dateB) {
		return -1;
	} else if (dateA > dateB) {
		return 1;
	}
	return 0;
}

function compare(a, b) {
	var dateA = Date.parse(a);
	var dateB = Date.parse(b);
	if (dateA < dateB) {
		return -1;
	} else if (dateA > dateB) {
		return 1;
	}
	return 0;
}

function formatDate(d) {
	var month = (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1);
	var date = (d.getDate() < 10 ? '0' : '') + d.getDate();
	return d.getFullYear() + '-' + month + '-' + date;
}

function getNextDay(string) {
	var d = new Date(string);
	d.setDate(d.getDate() + 1);
	return formatDate(new Date(d));
}

function isValidDateString(dateString) {
    // First check for the pattern
    if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateString)) {
    	return false;
    }
       
    // Parse the date parts to integers
    var parts = dateString.split("-");
    var day = parseInt(parts[2]);
    var month = parseInt(parts[1]);
    var year = parseInt(parts[0]);

    // Check the ranges of month and year
    if (year < 1900 || year > 2015 || month < 1 || month > 12) {
    	return false;
    }
        
    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
        monthLength[1] = 29;
    }

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
}

module.exports = router;