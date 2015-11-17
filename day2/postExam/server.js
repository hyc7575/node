var http = require('http');
var fs = require('fs');
var querystring = require('querystring');


var server = http.createServer(function(req,res) {
	/*console.log(req);*/
	if(req.url == '/' && req.method == 'GET') {
		res.writeHead(200,{'Content-Type':'text/html; charset=UTF-8'});
		fs.createReadStream('index.html').pipe(res);
		return;
	} else if (req.url == '/upload'&& req.method == 'POST') {
		var body = '';
		req.on('data',function(chunk) {
			console.log('got %d bytes of data', chunk.length);
			body += chunk;
		});
		req.on('end',function() {
			//x-www-form-urlencoded 로 하니 get방식의 url 쿼리 처럼 출력됨.
			console.log('there will be no more data');
			console.log('end: ' + body);
			var query = querystring.parse(body);
			console.log(query.text);
		});
	}
});


server.listen(3000,function() {
	console.log('server running');
});