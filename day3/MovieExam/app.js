
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
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
}

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

/* movie code */
app.get('/movies',function(req,res) {
	console.log(movieList);
	res.render('movies.jade',{title: 'Movie List', items: movieList});
});
app.get('/movies/:title',function(req,res) {
	var title = req.params.title;
	var item = movieDetail[title]; 
	if(item) {
		res.render('movie.jade',{title:title, director: item.director, actor: item.actor});
	} else {
		res.send("Not Found Movies");
	}
});
app.post('/movies',function(req,res) {
	var name = req.body.name;
	var director = req.body.director;
	var actor = req.body.actor;
	movieList.push(name);
	movieDetail[name] = {'director': director,'actor': actor};
	res.writeHead(301,{'location':'/movies'}); res.end();
});
app.put('/movies',function(req,res) {
	var obj = JSON.parse(req.body.movies);
	movieList = [];
	movieDetail = {};
	for(var i = 0; i<obj.length; i++) {
		movieList.push(obj[i]['title']);
		movieDetail[obj[i]['title']] = {director: obj[i].director, actor: obj[i].actor};
	}
	res.writeHead(301,{'location':'/movies'}); res.end();
});
app.put('/movies/:title',function(req,res) {
	var title = req.params.title;
	var director = req.body.director;
	var actor = req.body.actor;
	if(!movieDetail[title]) {
		movieList.push(title);
		movieDetail[title] = {director: director,'actor':actor};
		res.writeHead(301,{'location':'/movies'}); res.end();
	} else {
		movieDetail[title] = {director: director,'actor':actor};
		res.writeHead(301,{'location':'/movies'}); res.end();
	}
});
app.del('/movies',function(req,res) {
	movieList = [];
	movieDetail = {};
	res.writeHead(301,{'location':'/movies'}); res.end();
});
app.del('/movies/:title',function(req,res) {
	var title = req.params.title;
	var item = movieDetail[title];
	if(item) {
		var index = movieList.indexOf(title);
		if(index !== -1) {
			movieList.splice(index,1);
			delete item;
			res.writeHead(301,{'location':'/movies'}); res.end();
		} else {
			res.send('Not found movie');
		}
	} else {
		res.send('not found');
	}
});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
