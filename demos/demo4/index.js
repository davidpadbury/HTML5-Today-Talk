
require.paths.unshift(__dirname + '/src');

var express = require('express'),
	app = express.createServer(),
	io = require('socket.io'),
	createSymbol = require('symbol').create,
	assetManager = require('connect-assetmanager'),
	socket;

app.configure(function(){
	app.use(assetManager({
		'app-js': {
			route: /\/js\/Marketr.js/,
			path: './public/js/Marketr/',
			dataType: 'javascript',
			debug: true,
			files: [
				'*'
			]
		}
	}));
	app.use(express.staticProvider(__dirname + '/public'));
});

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
		clients: []
	};
}

function getTicker(symbol) {
	return tickers[symbol] || (tickers[symbol] = createTicker(symbol));
}

app.listen(3004);
socket = io.listen(app);
console.log( 'Listening on 3004' );


var clients = {},
	tickers = {};


socket.on('connection', function(client) {
	var id = client.sessionId;
	
	clients[id] = {
		client: client,
		tickers: []
	};
	
	client.on('message', function(s) {
		var data = JSON.parse(s);
		
		var ticker = getTicker(data.symbol);
		
		ticker.clients.push(client.sessionId);
		client.send(JSON.stringify({
			topic: 'tick',
			symbol: data.symbol,
			price: ticker.symbol.currentPrice()
		}));
	});
	
});