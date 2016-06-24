// jshint esversion: 6

var base_view = function(app) {
    const _      = app.locals.underscore;
    const extend = require('extensive');

    var BaseView = extend(function(response, template, router) {
        this.response = response;
        this.template = template;
        this.router = router;
    }, {
        render: function(vars) {
            vars.helpers = this.helpers;
            return this.response.render(this.template, vars);
        },
        helpers: {
            pageLink: function(name) {
                return `/page/${name}`;
            },

            linkToRoute: function(router, routePath, variables) {
                if (app.locals.routers && app.locals.routers[router]) {
                    return `/${router + app.locals.routers[router].namedRoutes.build(routePath, variables)}`;
                } else {
                    return "/";
                }
            }
        }
    }, {
        app: app
    });

    return BaseView;
};

module.exports = base_view;
