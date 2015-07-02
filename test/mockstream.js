var util = require('util'),
	through2 = require('through2');

module.exports = function(error) {
	var data = [],
		createStream = function() {
			createStream.created = true;
			return through2(function(chunk, enc, cb) {
				createStream.created = true;
				var num = parseInt(chunk.toString());
				data.push(num);
				if(error) {
					cb('error');
				} else {
					cb(null, (num + 1).toString());
				}
			});
		};
	createStream.created = false;
	createStream.data = data;
	return createStream;
};
