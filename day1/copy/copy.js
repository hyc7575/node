/**
 * http://usejsdoc.org/
 */
var fs = require('fs');
var async = require('async');
var text;
var checkFileFunc = function(callback) {
	fs.stat('./README1.md',function(err,stats) {
		if(err) {
			console.log(err);
			callback(err);
		} else {
			if(stats.isFile()) {
				callback(null,'check done');
			} else {
				callback('not file');
			}
		}
	});
};

var readFileFunc = function(callback) {
	fs.readFile('./README.md','utf-8',function(err,data) {
		text = data;
		callback(null,'Read Complete');
	});
};
var writeFileFunc = function(callback) {
	fs.writeFile('./HELLO.md', text, function(err) {
		if(err) {
			callback(err);
		} else {
			callback(null,'Write Complete');
		}
	});
};
async.series([
              checkFileFunc,
              readFileFunc,
              writeFileFunc
              ],function(err,results) {
	console.log(results);
});