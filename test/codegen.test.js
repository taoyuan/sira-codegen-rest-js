"use strict";

var s = require('./support');
var t = require('chai').assert;

var generator = require('../');

describe('codegen', function () {

    beforeEach(s.prepare());
    beforeEach(s.givenSharedModel('User', {crud: true}));
    beforeEach(s.givenSharedModel('Product', {crud: false},
        function bar(a, cb) {
            cb(null, a);
        },
        {
            aliases: ['foo'],
            accepts: [
                { arg: 'a', type: 'object', source: 'payload' }
            ],
            returns: { arg: 'data', type: 'object', root: true },
            http: { path: '/' }
        }
    ));
    beforeEach(s.boot());

    it('should work', function () {
        var source = generator.generate({
            moduleName: 'service',
            classes: s.restClasses(this.sapp)
        }, 'angular');
        t.ok(source);
    });

    it('should ignore returns array with resultful', function () {
        var source = generator.generate({
            moduleName: 'service',
            resultful: true,
            classes: s.restClasses(this.sapp)
        }, 'angular');
        t.ok(source);
    });
});