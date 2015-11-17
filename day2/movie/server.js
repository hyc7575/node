var http = require('http');
var fs= require('fs');
var querystring = require('querystring');
var movies = [];
var server = http.createServer(function(req,res) {
	if(req.url == '/' && req.method == 'GET') {
		console.log(1);
		res.writeHead(200,{'Content-Type':'text/html; charset=UTF-8'});
		fs.createReadStream('index.html').pipe(res); // index 파일을 읽어서 뿌려주는 기능?(pipe 찾아보기)
		return;
	} else if(req.url == '/list' && req.method== 'GET') {
		var html = '<html><body><head><meta charset="utf-8"/></head><h1>Favorite Movie</h1><ul>'
		for(var i =0; i<movies.length; i++) {
			html+= '<li>'+movies[i].name+'('+ movies[i].author +'</li>';
		}
		html+='</ul><form method="POST" action="/upload">';
		html+='<fieldset><legend>새 영화 입력</legend><table><tr><td><input type="text" name="name" /></td></tr>';
		html+='<tr><td><input type="text" name="author" /></td></tr></table><input type="submit" value="전송" /></fieldset></form></body></html>';
		res.end(html);
	} else if (req.url == '/upload' && req.method == 'POST') {
		var list = '';
		req.on('data',function(chunk) {
			list += chunk;
		});
		req.on('end',function() {
			var query = querystring.parse(list);
			
			movies.push({name:query.name, author:query.author});
			res.statusCode = 302;
			res.setHeader('Location','/list');
			res.end();
		});
	}
});

server.listen(3000,function() {
	console.log('server running');
})