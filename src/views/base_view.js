// jshint esversion: 6

var base_view = function(app) {
    const _      = app.get('underscore');
    const extend = require('extensive');

    var BaseView = extend(function(response, template) {
        this.response = response;
        this.template = template;
    }, {
        render: function(vars) {
            return this.response.render(this.template, vars);
        },
        helpers: {
            pageLink: function(name) {
                return `page/${name}`;
            },
            
            linkTo: function(name) {
                return `/${name}`;
            }
        }
    }, {
        app: app
    });

    return BaseView;
};

module.exports = base_view;
