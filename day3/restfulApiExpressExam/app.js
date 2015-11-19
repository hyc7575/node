
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
	res.send(JSON.stringify(movieList));
});
app.get('/movies/:title',function(req,res) {
	var title = req.params.title;
	if(movieDetail[title]) {
		res.send(movieDetail[title]);
	} else {
		res.send("Not Found Movies");
	}
});
app.post('/movies',function(req,res) {
	var name = req.body.name;
	var director = req.body.director;
	movieList.push(name);
	movieDetail[name] = {'director': director};
	res.redirect('/movies');
});
app.post('/movies/:title',function(req,res) {
	var title = req.params.title;
	var director = req.body.director;
	movieList.push(title);
	movieDetail[title] = {'director': director};
	res.redirect('/movies');
});
app.put('/movies',function(req,res) {
	var obj = JSON.parse(req.body.movies);
	movieList = [];
	movieDetail = {};
	for(var i = 0; i<obj.length; i++) {
		movieList.push(obj[i]['title']);
		movieDetail[obj[i]['title']] = {director: obj[i].director};
	}
	res.send({movieList:movieList,movieDetail:movieDetail});
});
app.put('/movies/:title',function(req,res) {
	var title = req.params.title;
	if(!movieDetail[title]) {
		movieList.push(title);
		movieDetail[title] = {director: req.body.director};
		res.send({movieList:movieList,movieDetail:movieDetail});
	}
});
app.del('/movies',function(req,res) {
	movieList = [];
	movieDetail = {};
	res.send({movieList:movieList,movieDetail:movieDetail});
});
app.del('/movies/:title',function(req,res) {
	var title = req.params.title;
	if(movieDetail[title]) {
		var index = movieList.indexOf(title);
		if(index !== -1) {
			movieList.splice(index,1);
			delete movieDetail[title];
			res.send({movieList:movieList,movieDetail:movieDetail});
		} else {
			res.send('Not found movie');
		}
	} else {
		res.send('not found')
	}
});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
