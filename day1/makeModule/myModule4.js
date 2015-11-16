/**
 * http://usejsdoc.org/
 */
var hello = {
		count: 0,
		hello: function() {
			console.log('hello ' + this.count++);
		}
};
module.exports = hello;
