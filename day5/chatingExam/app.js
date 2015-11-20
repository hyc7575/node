
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
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app);
var socketio = require('socket.io');
var io = socketio.listen(server);

var users = [];
io.sockets.on('connection',function(socket) {
	console.log('소켓 연결 완료');
	socket.on('chat_conn',function(raw_msg) { //클라이언트에 있는 chat_conn이라는 이벤트가 넘어오면
		console.log('chat_conn:' + raw_msg);
		var msg = JSON.parse(raw_msg); //클라이언트에서 제이슨 문자형태로 전해준 값을 객체 형태로 변환하여 저장
		console.log(msg);
		var index = users.indexOf(msg.chat_id);
		if(index === -1) {
			users.push(msg.chat_id);
			socket.emit('chat_join',JSON.stringify(users));
			socket.broadcast.emit('chat_join',JSON.stringify(users));
		} else {
			socket.emit('chat_fail',JSON.stringify(msg.chat_id));
		}
	});
	socket.on('leave',function(raw_msg) {
		console.log('leave:' + raw_msg);
		var msg = JSON.parse(raw_msg);
		if(msg.chat_id != '' && msg.chat_id != undefined) {
			var index = users.indexOf(msg.chat_id);
			users.splice(index,1); //해당 chat_id값 배열에서 제거
			socket.emit('someone_leaved',JSON.stringify(users));
			socket.broadcast.emit('someone_leaved',JSON.stringify(users));
		} 
	});
});
io.sockets.on('close',function(socket) {
	console.log('소켓 종료');
});
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
