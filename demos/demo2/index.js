var express = require('express'),
	assetManager = require('connect-assetmanager'),
	app = express.createServer();

app.configure(function(){
	app.use(express.staticProvider(__dirname + '/public'));
});
app.listen(3002);

console.log('Listening on 3002');
