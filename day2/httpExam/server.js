/**
 * server.js
 */
/*var url = require('url');


var urlStr = 'http://idols.com/q?group=EXID&name=하니&since=';
var parsed = url.parse(urlStr,true);
console.log(parsed);
console.log('==================== url parsing ==================');
console.log('protocol: '+ parsed.protocol);
console.log('host: ', parsed['host']);
console.log('query.group: ' + parsed.query.group);

var querystring = require('querystring');
var str = parsed.search;
var parsed2 = querystring.parse(str);
console.log(parsed2);
var str2 = 'group=걸스데이&member=혜리&member=유라&member=민아';
var parsed3 = querystring.parse(str2);
console.log(parsed3);
var members = parsed3.member;
console.log(members);
*/






var http = require('http');
var fs = require('fs');

var path = './imgs/rabit.jpg';

var server = http.createServer(function(request,response) {
	
/*	console.log('version: ' + request.httpVersion);
	console.log('method '+ request.method);
	console.log('url ' + request.url);
	console.log('------------header-------------');
	console.log(request.headers);*/
	
	if(request.url =='/imgs') {
		fs.readFile(path,function(err ,data) {
			if(err) {
				response.statusCode = 404;
				response.end('Can not find Resourse');
			} else {
				response.statusCode = 200;
				response.setHeader('Content-type','image/jpg');
				response.end(data);
			}
		});
	} else if(request.url == '/google') {
		response.writeHead(302,{'Location':'http://google.com'});
		response.end();
	} else {
		var body = '<html>';
		body += '<body>';
		body +='<h1>Hello Node.js</h1>';
		body +='</body>';
		body +='</html>';
		
		response.statusCode = 200;
		response.statusMessage ='OK';
		response.writeHead(200, {
			'Content-Type':'text/html; charset=UTf-8',
			'Content-Length':body.length
		});
		response.write(body);
		response.end();
	}
});
server.listen(52273, function() {
	console.log('server running');
});