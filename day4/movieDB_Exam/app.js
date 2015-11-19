
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

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
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

////////////////////// db 연결 - mysql
var mysql = require('mysql');
var dbConfig = {
	host: 'localhost',
	user: 'root',
	password: 's15031503',
	database: 'moviest'
};
var connection = mysql.createConnection(dbConfig);
connection.connect(function(err) {
	if(err) {
		console.log('error connection: ' + err.stack);
	} else {
		console.log('connected as id '+ connection.threadId);
	}
});

////////////////////// db 연결 - mongodb
var MongoClient = require('mongodb').MongoClient;
var mongodb = null;
MongoClient.connect('mongodb://localhost:27017/moviest',function(err,db) {
	if(err) {
		console.log(err.stack);
	}
	console.log('Connected correctly to server');
	mongodb = db;
});


//////////////////////

app.get('/', routes.index);
app.get('/users', user.list);


app.get('/movies',function(req,res) {
	var select = 'select movie_id,title,director,year from movie;';
	connection.query(select, function(err,results) {
		if(err) {
			console.error('Select Error',err);
		} else {
			res.render('movies.jade',{
				title: 'Movies',
				items: results
			})
		}
	});
});
app.get('/movies/:id',function(req,res) {
	var id = req.params.id;
	if(id === 'add') {
		res.render('movies_add',{
			title: '영화 추가하기'
		})
	} else {
		var select = "select * from movie where movie_id=?;"
		connection.query(select,[id],function(err,results) {
			if(err) {
				console.log(err);
			} else {
				var movieObj = {};
				if(results.length > 0) {
					//기본 설정 코멘트와 줄거리는 비어둔다.  다음 구문에서 몽고db에 있는 값 가져와서 넣어둘거임.
					//위의 query select에서 넘어온 results라는 배열을 이용하여 객체에 담는다.
					movieObj = {
							movie_id: results[0].movie_id,
							title: results[0].title,
							director:results[0].director,
							year:results[0].year,
							comments: [],
							synopsis:''
					};
					//몽고db의 콜렉션 movie를 movie라는 변수에 저장.
					var movie = mongodb.collection('movie');
					//movie라는 콜렉션에서 find함수 실행.
					//movie_id가 불러온 결과 값의 movie_id 와 같은 것만 배열로 변환해서 docs로 넘긴다.
					movie.find({movie_id:Number(results[0].movie_id)}).toArray(function(err,docs) {
						if(docs.length > 0) {
							movieObj.synopsis = docs[0].synopsis;
						}
						res.render('movie.jade',{ movie: movieObj });
					});
				}
			}
		});
	}
});
app.post('/movies/add',function(req,res) {
	var title = req.body.title;
	var director = req.body.director;
	var year = Number(req.body.year);
	var insert = 'insert into movie(title,director,year) values(?,?,?);';
	connection.query(insert,[title,director,year],function(err,results) {
		if(err) {
			console.log(err);	
		} else {
			console.log(results);
			var movie = mongodb.collection('movie');
			movie.insert({movie_id:results.insertId, synopsis:req.body.synopsis},function(err,results) {
				if(err) {
					console.log('err 몽고: '+ err);
				} else {
					res.writeHead(301,{'location':'/movies'});res.end();	
				}
			});	
		}
	});
});

app.post('/movies/comment',function() {
	
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
