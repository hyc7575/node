var http = require('http');

//한번 불러온 모듈은 다음에 불러와도 처음 불러온 모듈로 같이 씁니다.(모듈 캐시)
var hello = require('./myModule1.js');
var hello2 = require('./myModule1.js');
hello.howAreYou();
hello2.howAreYou();

var hello3 = require('./myModule2.js');
var greeting = hello3.createGreeting();
greeting.hello('Steve jobs');
greeting.howAreYou();

var hello4 = require('./myModule3.js');
var obj = new hello4();
obj.howAreYou();

var hello5 = require('./myModule4.js');
hello5.hello();

//////////////////////////////////////////////////////////////

/*function task1() {
	console.log('First Task Started');
	setTimeout(function() {
		console.log('First Task Done');
	},3000);
}
function task2() {
	console.log('Second Task Started');
	setTimeout(function() {
		console.log('Second Task Done');
	},1000);
}
task1();
task2();
*/
/*function task3(callback) {
	console.log('#First Task Started');
	setTimeout(function() {
		console.log('#First Task Done');
		callback();
	},3000);
}
function task4() {
	console.log('#Second Task Started');
	setTimeout(function() {
		console.log('#Second Task Done');
	},1000);
}
task3(task4);*/

/*
//async 동기식 처리 지원 모듈
var async = require('async');
async.series([
              function(callback) {
            	  console.log('$First Task Started');
            	  setTimeout(function() {
            		 console.log('$First Task Done')
            		 callback(null, 'Done1');
            	  },3000);
              },
              function(callback) {
            	  console.log('$Second Task Started');
            	  setTimeout(function() {
            		 console.log('$Second Task Done');
            		 callback(null, 'Done2');
            	  },1000);
              },
              function(callback) {
            	  console.log('$Third Task Started');
            	  setTimeout(function() {
            		  console.log('$Third Task Done');
            		  callback(null, 'Done3');
            	  },2000);
              }
              
], function(err,results) {
	console.log('All Task Done, series ' +results);
});
*/

/////////////////////////////////////////////////////////////


http.createServer(function handler(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');