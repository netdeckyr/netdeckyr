// jshint esversion: 6

var base_view = function(app) {
    const _ = app.get('underscore');
    var BaseView = function(response, template) {
        this.response = response;
        this.template = template;
    };

    BaseView.prototype = {
    };

    return BaseView;
};

module.exports = base_view;
