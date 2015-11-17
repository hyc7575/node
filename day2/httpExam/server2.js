var http = require('http');
var fs = require('fs');
var server = http.createServer(function(req,res) {
	console.log('request : '+ req.url);
	if(req.url == '/') {
		res.writeHead(200,{'Content-Type':'text/html; charset=UTF-8'});
		fs.createReadStream('index.html').pipe(res);
		return;
	}
	var path = __dirname +req.url;
	fs.exists(path,function(exist) {
		if(exist) {
			res.writeHead(200,{'Content-Type':'imgs/*'});
			fs.createReadStream(path).pipe(res);
		} else {
			res.statusCode = 404;
			res.end('Not Found');
		}
	});
});

server.listen(3000,function() {
	console.log('Server running');
});