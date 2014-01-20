var es = require('event-stream'),
util = require('util');
 
module.exports = function(error) {
	var data = [],
		createStream = function() {
			createStream.created = true;
			return es.map(function(d, cb) {
				createStream.created = true;
				data.push(d);
				if(error) {
					cb('error');
				} else {
					cb(null, d+1);
				}
			});
		};
	createStream.created = false;
	createStream.data = data;
	return createStream;
};