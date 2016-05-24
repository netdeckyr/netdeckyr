// jshint esversion: 6

const _ = require('lodash');

var base_view = (function(app) {
    var BaseView = function(response, template) {
        properties.response = response;
        properties.template = template;
    };

    BaseView.prototype = {
        extend: function(properties) {
            var Child = _.assign({}, BaseView, properties);
            
        }
    };

    return BaseView;
})();

module.exports = base_view;
