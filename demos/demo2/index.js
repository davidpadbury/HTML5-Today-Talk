var express = require('express'),
	assetManager = require('connect-assetmanager'),
	app = express.createServer();

app.configure(function(){
	app.use(express.staticProvider(__dirname + '/public'));
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
});
app.listen(3002);

console.log('Listening on 3002');
