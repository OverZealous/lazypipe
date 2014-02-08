![status](https://secure.travis-ci.org/OverZealous/lazypipe.png?branch=master)

lazypipe
=======

Lazypipe allows you to create an immutable, lazily-initialized pipeline.  It's designed to be used in an environment where you want to reuse partial pipelines, such as with [gulp](http://gulpjs.com).

This module returns a function that can be used to start building a lazypipe.  Individual steps are added via the `.pipe()` method.  At any point, a new lazypipe can be built by adding to an existing one, without affecting the previous lazypipe.  Lazypipes can even be used as steps within another lazypipe.

Once the partial pipeline is ready to use, call the last result from `.pipe()` directly as a function (e.g.: `.pipe()()`).

Usage
-----

Install using:

    npm i --save-dev lazypipe

Then create lazypipes like so:

```js
// Example usage within a gulpfile
var lazypipe = require('lazypipe');

...

// initialize a lazypipe
var jsHintTasks = lazypipe()
    // adding a pipeline step, notice the stream function has not been called!
    .pipe(jshint)
    // adding a step with an argument
    .pipe(jshint.reporter, 'jshint-stylish');
 
// this is OK, because lazypipes are immutable
// jsHintTasks will _not_ be affected by the addition.
var jsTasks = jsHintTasks
    .pipe(gulp.dest, 'build/js');
 
// Create another pipe
var cssTasks = lazypipe()
    .pipe(recess, recessConfig)
    .pipe(less)
    .pipe(autoprefixer);


// now using the lazypipes
gulp.task('jsHint', function() {
    gulp.src('js/**/*.js').pipe(jsHintTasks());
});

gulp.task('build', function() {
    // for example only!
    return gulp.src('js/**/*.js').pipe(jsTasks());
});

gulp.task('default', ['build'], function() {
	// using gulp-watch
	watch('js/**/*.js').pipe(jsTasks());
});
```

You can combine lazypipes in various ways:

```js
// streamA -> streamB
var foo = lazypipe().pipe(streamA).pipe(streamB);

// streamA -> streamB -> streamC
var bar = foo.pipe(streamC);

// streamD -> streamA -> streamB -> streamE
var baz = lazypipe().pipe(streamD).pipe(foo).pipe(streamE);

```

API
---

### `lazypipe()`

Initializes a lazypipe.  Returns a function that can be used to create the pipeline.  The returned function has a function (`pipe`) which can be used to create new lazypipes with an additional step.

### `lazypipe().pipe(fn, [args...])`

Creates a new lazy pipeline with all the previous steps, and the new step added to the end.  Returns the new lazypipe.

* `fn` - a stream creation function to call when the pipeline is created later.  You can either provide existing functions (such as gulp plugins), or provide your own custom functions if you want to manipulate the stream before creation.
* `args` - Any remaining arguments are saved and passed into `fn` when the pipeline is created.

The arguments allows you to pass in configuration arguments when the pipeline is created, like this:

```js
var pipeline = lazypipe().pipe(jsHint, jsHintOptions);

// now, when gulp.src().pipe(pipeline()) is called later, it's as if you did:
gulp.src().pipe(jsHint(jsHintOptions));
```

### `lazypipe()()`  *"create"*

Calling the result of `pipe()` as a function creates a pipeline at that time.  This can be used multiple times, and can even be called if the lazypipe was used to create different pipelines.

It returns a stream created using `stream-combiner`, where all the internal steps are processed sequentially, and the final result is passed on.


LICENSE
-------

(MIT License)

Copyright (c) 2014 [Phil DeJarnett](http://overzealous.com)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
