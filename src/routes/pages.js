// jshint esversion: 6

const use = require('rekuire');

var pages = function(app, express) {
    const PageController = use('page_controller')(app);

    var router = express.Router();
    var controller = new PageController();

    controller.initialize(router, {


    }, {
        // Variables
    });
};

module.exports = pages;
