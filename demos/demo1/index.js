
require.paths.unshift(__dirname + '/src');

var express = require('express'),
	app = express.createServer();

app.configure(function(){
	app.use(express.staticProvider(__dirname + '/public'));
});

app.listen(3001);

console.log('Listening on port 3001');
