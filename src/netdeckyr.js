/* jshint esversion: 6 */

var netdeckyr = function(options) {
    // Require dependencies
    var express        = require('express'),
        _              = require('lodash'),
        passport       = require('passport'),
        path           = require('path'),
        bodyParser     = require('body-parser'),
        debug          = require('debug')('development'),
        cookieParser   = require('cookie-parser'),
        morgan         = require('morgan'),
        winston        = require('winston'),
        moment         = require('moment'),
        use            = require('rekuire'),
        chalk          = require('chalk'),
        expressSession = require('express-session'),
        RedisStore     = require('connect-redis')(expressSession),
        bcrypt         = require('bcrypt');

    var app = express();

    // Save library references
    app.set('underscore', _);
    app.set('debug', debug);
    app.set('bcrypt', bcrypt);
    app.set('chalk', chalk);

    var winstonTimestamp = function() {
        return `[${ chalk.gray(moment().format('HH:mm:ss')) }]`;
    };

    var logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                timestamp: winstonTimestamp,
                colorize: true,
                level: (options && options.squelch) ? 'error' : 'info'
            })
            // TODO: Add file logging
        ]
    });

    app.set('winston', logger);

    // Initialize DB
    logger.info(`Setting up '${ chalk.cyan('knex') }' with environment ${ process.env.CONFIGURATION_ENV }.`);
    var config = use('knexfile')[process.env.CONFIGURATION_ENV] || {
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

    let sessionStore = new RedisStore();
    app.use(expressSession({
        secret: process.env.EXPRESS_SECRET_KEY,
        store: sessionStore,
        resave: true,
        saveUninitialized: true
    }));

    // Setup passport
    app.use(passport.initialize());
    app.use(passport.session());
    app.set('passport', passport);
    use('passport-init')(passport, use('models/user')(app));

    // Setup views
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    // Setup static files
    app.use(express.static(path.join(process.env.DEPLOYMENT_DIRECTORY, 'public')));


    // Require routes
    use('routes')(app, express);

    return app;
};

module.exports = netdeckyr;
