/**
 * RESTfulApiExam server.js
 */
var movieList = ['아바타','스타워즈','인터스텔라'];
var movieDetail = {
	'아바타': {
		'director':'제임스 카메론'
	},
	'스타워즈': {
		'director':'조지 루카스'
	},
	'인터스텔라': {
		'director':'크리스토퍼 놀란'
	}
};
var urlencode = require('urlencode');
var querystring = require('querystring');
var http = require('http');
var server = http.createServer(function(req,res) {
	var method = req.method.toLowerCase();
	if(method == 'get') {
		handleGetRequest(req,res);
	} else if(method == 'post') {
		handlePostRequest(req,res);
	} else if(method == 'put') {
		handlePutRequest(req,res);
	} else if(method == 'delete') {
		handleDeleteRequest(req,res);
	} else {
		res.statusCode = 404;
		res.end('Wrong method');
	}
});
server.listen(3000,function() {
	console.log('server running');
});
function handleGetRequest(req,res) {
	var url = req.url;
	if(url == '/movies') {
		res.writeHead(200, {'Content-Type':'application/json; charset=UTF-8'});
		res.end(JSON.stringify(movieList));
	} else {
		var itemName = url.split('/')[2];
		console.log('itemNmae: ' + itemName);
		itemName = urlencode.decode(itemName);
		var item = movieDetail[itemName];
		if(item) {
			res.writeHead(200,{'Content-Type':'application/json; charset=UTF-8'});
			res.end(JSON.stringify(item));
		} else {
			res.statusCode = 404;
			res.end('Wrong movie name');
		}
	}
}
function handlePostRequest(req,res) {
	var url = req.url;
	if(url == '/movies') {
		var body = '';
		req.on('data',function(chunk) {
			body += chunk;
		});
		req.on('end',function() {
			var parsed = querystring.parse(body);
			movieList.push(parsed.title);
			movieDetail[parsed.title] = {director: parsed.director};
			res.statusCode = 302; // 리다이렉트
			res.setHeader('Location','/movies'); //리다이렉트
			res.end();
		});
	}
}
function handlePutRequest(req,res) {
	var url = req.url;
	if(url == '/movies') {
		var body = '';
		req.on('data',function(chunk) {
			body += chunk;
		});
		req.on('end',function() {
			var parsed = querystring.parse(body);
			//console.log(parsed);
			//console.log('-----------------------\n parsed.movies 출력');
			parsed.movies = urlencode.decode(parsed.movies);
			//console.log(parsed.movies);
			var obj = JSON.parse(parsed.movies); // parsed.movies 라는 json문자열을 json 객체로 변경
			//console.log('---------------------- \n parsed.movies 문자열을 객체로 변경한 값 출력');
			//console.log(obj);
			movieList = [];
			movieDetail = {};
			for(var i = 0; i<obj.length; i++) {
				movieList.push(obj[i].title);
				movieDetail[obj[i].title] = {director: obj[i].director};
			}
			res.writeHead(200,{'Content-Type':'application/json; charset=UTF-8'});
			res.end(JSON.stringify({'movieList':movieList,'movieDetail':movieDetail}));
		});
	} else {
		var itemName = url.split('/')[2]; //url '/'로 나누어서 배열에 담음 그중 2번쨰
		itemName = urlencode.decode(itemName); //urlencode라는 모듈 설치 후 문자 decode하여 한글로 바꾸는 로직인듯함.
		var body = '';
		req.on('data',function(chunk) {
			body += chunk
		});
		req.on('end',function() {
			var parsed = querystring.parse(body);
			if(!movieDetail[itemName]) {
				movieList.push(itemName);
			}
			movieDetail[itemName] = {director:parsed.director};
			res.writeHead(200,{'content-type':'application/json; charset=utf-8'});
			res.end(JSON.stringify({movieList:movieList,movieDetail:movieDetail}));
		});
	}
}
function handleDeleteRequest(req,res) {
	var url = req.url;
	if(url == '/movies') {
		movieList = [];
		moiveDetail = {};
		res.writeHead(200,{'Content-Type':'application/json; charset=UTF-8'});
		res.end(JSON.stringify(movieList));
	} else {
		var itemName = url.split('/')[2];
		itemName = urlencode.decode(itemName);
		var item = movieDetail[itemName];
		if(item) {
			var index = movieList.indexOf(itemName);
			if(index != -1) {
				movieList.splice(index,1);
			}
			delete movieDetail[itemName];
			res.writeHead(200,{'Content-Type':'application/json; charset=UTF-8'});
			res.end(JSON.stringify({movieList:movieList,movieDetail:movieDetail}));
		} else {
			res.statusCode = 404; res.end('Wrong movie name');
		}
	}
}
