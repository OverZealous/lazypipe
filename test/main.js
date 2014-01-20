/* jshint node: true */
/* global describe, it, beforeEach */
'use strict';

var lazypipe = require('../');
var mockstream = require('./mockstream');
var should = require('should');
require('mocha');

describe('lazypipe', function() {
  var stream1, stream2, stream3, stream4, stream5;
  beforeEach(function() {
      stream1 = mockstream();
      stream2 = mockstream();
      stream3 = mockstream();
      stream4 = mockstream();
      stream5 = mockstream();
  });

  describe('basics', function() {
    it('should handle a simple stream', function() {
      var pipeline = lazypipe();
      pipeline.should.be.a.Function;
      pipeline.pipe.should.be.a.Function;
      pipeline = pipeline.pipe(stream1);
      stream1.created.should.be.false;
      stream1.data.should.have.length(0);

      var pipelineInstance = pipeline();
      pipelineInstance.on.should.be.a.Function;
      stream1.created.should.be.true;
      stream1.data.should.have.length(0);

      pipelineInstance.write(1);
      stream1.data.should.eql([1]);
      pipelineInstance.end();
    });

    it('should handle multiple streams', function() {
      var pipeline = lazypipe();
      pipeline = pipeline.pipe(stream1).pipe(stream2).pipe(stream3);
      stream1.created.should.be.false;
      stream1.data.should.have.length(0);
      stream2.created.should.be.false;
      stream2.data.should.have.length(0);
      stream3.created.should.be.false;
      stream3.data.should.have.length(0);

      var pipelineInstance = pipeline();
      stream1.created.should.be.true;
      stream1.data.should.have.length(0);
      stream2.created.should.be.true;
      stream2.data.should.have.length(0);
      stream3.created.should.be.true;
      stream3.data.should.have.length(0);

      pipelineInstance.write(1);
      stream1.data.should.eql([1]);
      stream2.data.should.eql([2]);
      stream3.data.should.eql([3]);
      pipelineInstance.end();
    });

    it('should not break existing streams', function() {
      var pl1 = lazypipe().pipe(stream1).pipe(stream2),
          pl2 = pl1.pipe(stream3);
      pl1().write(11);
      stream3.created.should.be.false;
      pl2().write(21);
      stream1.data.should.eql([11,21]);
      stream2.data.should.eql([12,22]);
      stream3.data.should.eql([23]);
    })

    it('should be re-pipeable', function() {
      var pl1 = lazypipe().pipe(stream1).pipe(stream2),
          pl2 = lazypipe().pipe(stream3).pipe(pl1).pipe(stream4),
          pl3 = pl1.pipe(stream5);

      pl1().write(11); // s1 -> s2
      pl2().write(21); // s3 -> s1 -> s2 -> s4
      pl3().write(31); // s1 -> s2 -> s5

      stream1.data.should.eql([11,22,31]);
      stream2.data.should.eql([12,23,32]);
      stream3.data.should.eql([21]);
      stream4.data.should.eql([24]);
      stream5.data.should.eql([33]);
    })

  });

});