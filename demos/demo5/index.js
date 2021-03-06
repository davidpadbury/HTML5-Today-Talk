
require.paths.unshift(__dirname + '/src');

var express = require('express'),
	app = express.createServer(),
	io = require('socket.io'),
	createSymbol = require('symbol').create,
	assetManager = require('connect-assetmanager'),
	socket;

app.configure(function(){
	app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
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

app.listen(3005);
socket = io.listen(app);
console.log( 'Listening on 3005' );


socket.on('connection', function(client) {
	
});