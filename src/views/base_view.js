// jshint esversion: 6

var base_view = function(app) {
    const _      = app.get('underscore');
    const extend = require('extensive');

    var BaseView = extend(function(response, template) {
        this.response = response;
        this.template = template;
    }, {
        render: function(vars) {
            return this.response.render(vars);
        }
    }, {});

    return BaseView;
};

module.exports = base_view;
