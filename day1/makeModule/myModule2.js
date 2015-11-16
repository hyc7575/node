/**
 * http://usejsdoc.org/
 */
exports.createGreeting = function() {
	var obj = {
		hello: function(who) {
			console.log('Hello '+ who);
		}
	};
	obj.howAreYou = function() {
		console.log('Fine Thank you and you?');
	};
	return obj;
};