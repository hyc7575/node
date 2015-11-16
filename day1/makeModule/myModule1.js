/**
 * http://usejsdoc.org/
 */
var helloCount = 0;
module.exports.howAreYou = function() {
	console.log('Fine Thank you and you?' + helloCount++);
};