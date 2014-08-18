"use strict";

var voya = require('voya');
var generator = require('../');

var sapp = voya();
sapp.disable('model public');

sapp.registry.define('User', {public: true, crud: true});
sapp.registry.define('Product', {public: true, crud: true}, function (Product) {
    Product.bar = function bar(a, cb) {
        cb(null, a);
    };

    Product.expose('bar', {
        aliases: ['foo'],
        accepts: [
            { arg: 'a', type: 'object', source: 'payload' }
        ],
        returns: { arg: 'data', type: 'object', root: true },
        http: { path: '/' }
    });
});

sapp.boot(function () {
    var source = generator.generate({
        moduleName: 'service', // the service module name
        metadata: sapp, // the sira app, remotes, shared classes or rest classes for generating
        resultful: true, // no isArray for returns
        url: 'http://custom/api/', // api base url
        description: 'Example service' // the module description
    }, 'angular');

    console.log(source);
//    require('grunt').file.write('./generated/example_sdk.js', source, 'utf-8');
});