/**
 * http://usejsdoc.org/
 */
var http = require('http');
var url = require('url');

var server = http.createServer(function(req,res) {
	var parsed = url.parse(req.url,true);
	var path = parsed.pathname;
	var query = parsed.query;
	var start = parseInt(query.start);
	var end = parseInt(query.end);
	var result = start;
	if( isNaN(start) || isNaN(end)) {
		res.statusCode = 404;
		res.end('Wrong Parameter');
	} else if(start > end) {
		res.statusCode = 404;
		res.end('초기값이 더 큽니다.');
	} else if (path == '/add') {
		console.log('더하기');
		for(var i = start; i<=end; i++) {
			result += i;
		}
		res.end('Result: ' + result);
	} else if (path == '/multiplication') {
		console.log('곱하기')
		for(var i = start; i<=end; i++) {
			result *= i;
		}
		res.end('Result: ' + result);
	}
});

server.listen(3000,function() {
	console.log('running');
});