"use strict";

var _ = require('lodash');

exports.register = function (temblate) {

    var safeString = temblate.utils.safeString;

    temblate.registerPartial('ngdocForAction', './ngdoc-for-action');

    temblate.registerHelper('jsDocType', function () {
        var type = this.type == 'any' ? '*' : this.type;
        if (!this.required) type += '=';
        return safeString(type);
    });

    temblate.registerHelper('returnType', function () {
        return safeString(!this.resultful && this.returns.isArray ? 'Array.<Object>' : 'Object');
    });

    temblate.registerHelper('ngdocForAction', function (actionName, action) {
        var data = _.defaults({actionName: actionName}, action);
        return safeString(temblate.renderPartial('ngdocForAction', data));
    });


};