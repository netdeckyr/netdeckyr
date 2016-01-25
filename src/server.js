var app = function(options) {
    // Require dependencies
    var express        = require('express'),
        _              = require('lodash'),
        passport       = require('passport'),
        path           = require('path'),
        bodyParser     = require('body-parser'),
        debug          = require('debug')('development'),
        cookieParser   = require('cookie-parser'),
        morgan         = require('morgan'),
        expressSession = require('express-session'),
        bcrypt         = require('bcrypt');

    var app = express();

    // Set libraries
    app.set('underscore', _);
    app.set('debug', debug);
    app.set('bcrypt', bcrypt);

    // Initialize DB
    var config = require('knexfile')[process.env.CONFIGURATION_ENV] || {
        client: 'sqlite3',
        connection: {
        filename: './dev.sqlite3'
        }
    };

    var knex = require('knex')(config);

    var bookshelf = require('bookshelf')(knex);
    bookshelf.plugin('registry');
    app.set('bookshelf', bookshelf);

    // Set up middleware
    app.use(bodyParser.json());
    app.use(cookieParser());
    if (!options || (options && !options.squelch)) {
        app.use(morgan('dev'));
    }
    app.use(expressSession({
        secret: process.env.EXPRESS_SECRET_KEY,
        resave: true,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.set('passport', passport);

    app.set('views', './views');
    app.set('view engine', 'jade');

    require('passport-init')(passport, require('models/user')(app));

    // Require routes
    require('routes')(app, express);


    return app;
};

module.exports = app;
