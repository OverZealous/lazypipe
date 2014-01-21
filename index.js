/*jshint node:true */

"use strict";

var combine = require('stream-combiner');

function lazypipe() {
	var createPipeline = function(tasks) {
		var build = function() {
				if(tasks.length === 0) {
					throw new Error("Tried to build a pipeline with no pipes!");
				}
				return combine.apply(null, tasks.map(function(t) {
					return t.task.apply(null, t.args);
				}));
			};
		build.pipe = function(task) {
			if(!task) {
				throw new Error("Invalid call to lazypipe().pipe(): no stream specified");
			} else if(typeof task !== 'function') {
				throw new Error("Invalid call to lazypipe().pipe(): stream is not a function");
			}
			return createPipeline(tasks.concat({
				task: task,
				args: Array.prototype.slice.call(arguments, 1)
			}));
		}
		return build;
	};
	return createPipeline([]);
}

module.exports = lazypipe;