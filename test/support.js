"use strict";

var voya = require('voya');
var Rest = require('sira-express-rest').Rest;

exports.save = function (data, path) {
    require('grunt').file.write(path, data, 'utf-8');
};

exports.createSapp = function createSapp(fns, cb) {
    var sapp = voya();
    sapp.disable('model public');

    if (fns) {
        fns = Array.isArray(fns) ? fns : [fns];
        fns.forEach(function (fn) {
            fn(sapp);
        })
    }
    process.nextTick(function () {
        sapp.boot(cb);
    });

    return sapp;
};

exports.prepare = function (options) {
    return function (done) {
        var sapp = this.sapp = voya();
        sapp.disable('model public');
        sapp.setAll(options || {});
        done();
    }
};

exports.boot = function () {
    return function (done) {
        this.sapp.boot(done);
    }
};

exports.givenSharedModel = function (clazz, config, fn, sharing) {
    config = config || {};
    if (config.public === undefined) config.public = true;
    if (typeof fn === 'object' && sharing === undefined) {
        sharing = fn;
        fn = null;
    }

    fn = fn || function (cb) {
        cb();
    };
    var method = fn.name || 'anonymous';

    return function (done) {
        var test = this;

        test.sapp.registry.define(clazz, config, function (Model) {
            if (sharing) {
                Model[method] = fn;
                Model.expose(method, sharing);
            }
            test[clazz] = Model;
        });
        done();
    }
};

exports.restClasses = function (sapp) {
    return Rest.buildClasses(sapp);
};

