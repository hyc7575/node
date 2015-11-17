/**
 * http://usejsdoc.org/
 */
var formidable = require('formidable');
var http = require('http');
var server = http.createServer(function(req,res) {
	if(req.url == '/upload' && req.method == 'POST') {
		var form = new formidable.IncomingForm();
		form.encoding = 'utf-8';
		form.keepExtension = true;
		form.uploadDir = './upload';
		form.parse(req, function(err, fields, files) {
			console.log(fields);
			console.log('-----------');
			console.log(files);
		});
	} 
});
server.listen(3000,function() {
	console.log('server running');
});