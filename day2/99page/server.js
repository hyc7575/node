/**
 * http://usejsdoc.org/
 */
var http = require('http');
var fs = require('fs');
var formidable = require('formidable');
var paint = [];

var server = http.createServer(function(req,res) {
	if(req.url == '/' && req.method == 'GET') {
		res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
		fs.createReadStream('index.html').pipe(res);
		return;
	} else if (req.url == '/list' && req.method == 'GET') {
		var html = '';
		html +='<html><head><meta charset="utf-8"/></head><body><h1>Favorite Paint</h1><ul>';
		for(var i = 0; i<paint.length; i++) {
			html +='<li><img src="'+paint[i].file +'" alt="" />'+ paint[i].name + '</li>';
		}
		html +='</ul><form action="upload" method="POST" enctype="multipart/form-data"><table><tr><td>작품이름: </td><td><input type="text" name="name" /></td></tr><tr><td colspan="2"><input type="file" name="file" /></td>';
		html +='</tr></table><input type="submit" value="submit" /></form></body></html>';
		res.end(html);
		
	} else if(req.url == '/upload' && req.method == 'POST') {
		var form = new formidable.IncomingForm();
		form.encoding = 'utf-8';
		form.keepExtension = true;
		form.uploadDir = './upload';
		form.parse(req, function(err, fields, files) {
			var File = files.file;
			var filename = File['path'];
			filename = filename.replace(/\\/gm,'/');
			paint.push({name: fields.name, file: filename});
			res.statusCode = 302;
			res.setHeader('Location','/list');
			res.end();
		});
	} else {
		var path = __dirname + req.url;
		fs.exists(path, function(exist) {
			if(exist) {
				res.writeHead(200,{'Content-Type':'image/*'});
				res.createReadStream(path).pipe(res);
			}
		});
	}
});

server.listen(3000,function() {
	console.log('server running');
});