
require.paths.unshift(__dirname + '/src');

var express = require('express'),
	app = express.createServer(),
	io = require('socket.io'),
	createSymbol = require('symbol').create,
	assetManager = require('connect-assetmanager'),
	socket;


var clients = {},
	tickers = {};
	
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyDecoder());
	app.use(express.methodOverride());
	app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
	app.use(app.router);
	app.use(assetManager({
		'app-js': {
			route: /\/js\/Marketr.js/,
			path: './public/js/Marketr/',
			dataType: 'javascript',
			debug: true,
			files: [
				'*'
			]
		},
		'lib-js': {
			route: /\/js\/lib.js/,
			path: './public/js/',
			dataType: 'javascript',
			debug: true,
			files: [ 
				'jquery-1.4.3.js',
				'jquery.tmpl.js',
				'*' 
			]
		}
	}));
	app.use(express.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

function getSymbols() {
	var s = [];
	for (var p in tickers) {
		s.push(p);
	}
	return s;	
}

app.get('/order', function(req, res) {
	var symbols = getSymbols();
	res.render('order', {
		locals: {
			errz: [],
			user: '',
			symbol: symbols[0],
			symbols: symbols,
			size: '100'
		}
	});
});

app.post('/order', function(req, res) {
	var rules = [
		{ name: 'user', valid: function(v) { return v; }, message: 'Big up yerself! (You need a username)' },
		{ name: 'symbol', valid: function(v) { return tickers[v]; }, message: 'Use a symbol uz seen'},
		{ name: 'size', valid: function(v) { return parseInt(v, 10) > 0; }, message: 'BUYZ MORE PLZ (size > 0)' }
	], errz = [];
	
	rules.forEach(function(rule) {
		if ( !rule.valid( req.body[rule.name] ) ) {
			errz.push( rule.message );
		}
	});
	
	if (errz && errz.length) {
		res.render('order', {
			locals: {
				errz: errz,
				user: req.body.user,
				symbol: req.body.symbol,
				symbols: getSymbols(),
				size: req.body.size
			}
		});
	} else {
		console.log('Order from ' + req.body.user + ' for ' + req.body.size + ' ' + req.body.symbol);
		makeOrder( req.body.symbol, req.body.user, parseInt( req.body.size ));
		res.render('ordered');
	}
});

app.listen(3000);

function tick(symbol, price) {
	var clientIds = tickers[symbol] ? tickers[symbol].clients : [],
		i, l;
		
	for (i = 0, l = clientIds.length; i < l; i++) {
		clients[clientIds[i]].client.send(JSON.stringify({
			topic: 'tick',
			symbol: symbol,
			price: price
		}));
	}
}

function createTicker(s) {
	var symbol = createSymbol(s);
	symbol.on('tick', tick);
	return {
		symbol: symbol,
		orders: [],
		clients: []
	};
}

function makeOrder(symbol, user, size) {
	var ticker = tickers[symbol],
		clientIds = ticker.clients || [],
		order = {
			user: user,
			size: size
		},
		i,l;
		
	ticker.orders.push(order);
	
	for (i = 0, l = clientIds.length; i < l; i++) {
		clients[clientIds[i]].client.send(JSON.stringify({
			topic: 'new-order',
			symbol: symbol,
			user: user,
			size: size
		}));
	}
}

socket = io.listen(app);

socket.on('connection', function(client) {
	var id = client.sessionId;
	
	clients[id] = {
		client: client,
		tickers: []
	};
	
	function getTicker(symbol) {
		return tickers[symbol] || (tickers[symbol] = createTicker(symbol));
	}
	
	client.on('message', function(s) {
		var data = JSON.parse(s);
		
		switch (data.topic) {
			case 'subscribe-tick':
				var ticker = getTicker(data.symbol);
				
				ticker.clients.push(client.sessionId);
				client.send(JSON.stringify({
					topic: 'tick',
					symbol: data.symbol,
					price: ticker.symbol.currentPrice()
				}));
				break;
				
			case 'unsubscribe-tick':
				var ticker = tickers[data.symbol];
				for (var i = 0; i < ticker.clients.length; i++) {
					if (ticker.clients[i] === client.sessionId) {
						ticker.clients.splice(i, 1);
						break;
					}
				}
				break;
				
			case 'request-recent-data':
				var ticker = getTicker(data.symbol);
				client.send(JSON.stringify({
					topic: 'recent-data',
					symbol: data.symbol,
					prices: ticker.symbol.getRecentPrices(),
					orders: ticker.orders.slice( -20 )
				}));
		}
	});
	
});