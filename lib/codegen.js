"use strict";

var _ = require('lodash');
var path = require('path');
var beautify = require('js-beautify').js_beautify;
var Temblate = require('temblate');

var spec = require('./spec');

var DEFAULT_TYPE = 'angular';

exports.generate = function (opts, type) {
    if (typeof opts === 'string') {
        type = opts;
        opts = {};
    }
    opts = _.assign({
        moduleName: 'siras',
        url: '/'
    }, opts);
    opts.url = opts.url.replace(/\/+$/, ''); // remove last slash

    type = type || DEFAULT_TYPE;

    var render = createRenderForType(type);
    var data = spec(opts);

    var source = render(data);
    if (opts.jshint) hint(source, type);
    return beautify(source, { indent_size: 4, max_preserve_newlines: 2, preserve_newlines: false });
};

function createRenderForType(type) {
    var temblate = Temblate.create();
    temblate.configure(path.join(__dirname, '../templates/' + type));
    temblate.registerHelpers(path.join(__dirname, '../templates/' + type + '/helpers'));
    return function (data, options) {
        return temblate.render('template', data, options);
    }
}

function hint(source, type) {
    var lint = require('jshint').JSHINT;
    lint(source, {
        node: type === 'node',
        browser: type === 'angular',
        undef: true,
        strict: true,
        trailing: true,
        smarttabs: true
    });
    lint.errors.forEach(function(error){
        if(error.code[0] === 'E') {
            throw new Error(lint.errors[0].reason + ' in ' + lint.errors[0].evidence);
        }
    });
}