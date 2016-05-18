var gulp    = require('gulp-help')(require('gulp')),
    gutil   = require('gulp-util'),
    genv    = require('gulp-env'),
    yargs   = require('yargs'),
    path    = require('path'),
    _       = require('lodash'),
    chai    = require('chai');

// Constants

const defaultConfigFile = "env.js";
const defaultSecretFile = "secret.js";

// Helpers

function getConfigurationFilename(config) {
    var result;
    if (path.extname(config) != "") {
        result = config;
    } else {
        result = path.format({
            name: config,
            ext: '.json'
        });
    }
    return result;
}

function setupEnvironment() {
    var args = yargs.reset()
    .option('config', {
        demand: false,
        describe: '[file] Set the deployment config file.',
        type: 'string',
        requiresArg: true
    })
    .option('secret', {
        demand: false,
        describe: '[file] Set the secret config file.',
        type: 'string',
        requiresArg: true
    }).argv;

    var configFile;
    if (args.config) {
        configFile = getConfigurationFilename(args.config);
    } else {
        configFile = defaultConfigFile;
    }

    var secretFile
    if (args.secret) {
        secretFile = getConfigurationFilename(args.secret);
    } else {
        secretFile = defaultSecretFile;
    }

    genv({ file: configFile });
    genv({ file: secretFile });
}

// Tasks

gulp.task('build', 'Build the application.', function() {
    setupEnvironment();
    var args = yargs.reset()
    .usage('Usage: $0 build').argv;
}, {
    aliases: ['b', 'B']
});

gulp.task('migrate', 'Run or create DB migrations.', function() {
    setupEnvironment();
    var app  = require('app')({ squelch: true });
    var knex = app.get('bookshelf').knex;

    // Set CLI options using yargs.
    var args = yargs.reset()
    .usage('Usage: $0 migrate [options]')
    .option('create', {
        alias: 'c',
        demand: false,
        describe: '[name] Create a migration with the specified name.',
        type: 'string',
        requiresArg: true
    }).argv;

    if (args.create) {
        gutil.log('Creating migration: ' + args.create);

        // Create the database migration.
        return knex.migrate.make(args.create)
        .then(function() {
            // Make sure to clean up knex when we're done.
            knex.destroy();
        }).catch(function(error) {
            // Log any errors and clean up knex.
            gutil.log(error, gutil.colors.red);
            knex.destroy();
        });
    } else {
        // Run latest database migrations as default command.
        return knex.migrate.latest().tap(function(migrations) {
            _.each(migrations[1], function(migration) {
                gutil.log(gutil.colors.yellow('Running migration: ' + path.basename(migration)));
            });
        }).then(function() {
            knex.destroy();
        }).catch(function(error) {
            gutil.log(error, gutil.colors.red);
            knex.destroy();
        });
    }
}, {
    aliases: ['m', 'M'],
    options: {
        'create': '[name] Create a migration with the specified name.'
    }
});

gulp.task('tags', 'Build ctags for the application.', function() {
    setupEnvironment();
    var args = yargs.reset()
    .usage('Usage: $0 tags --tagsfile [tagsfile]')
    .option('tagsfile', {
        alias: 't',
        demand: false,
        describe: '[file] Tagsfile to save tags.',
        type: 'string',
        requiresArg: true
    }).argv;

    var ctags = require('gulp-javascript-ctags');

    var tagsfile = args.tagsfile ? args.tagsfile : process.env.APPNAME + '.tags';

    return gulp.src('src/**/*.js')
               .pipe(ctags(tagsfile))
               .pipe(gulp.dest('./'));
}, {
    aliases: ['g', 'G'],
    options: {
        'tagsfile': '[file] Tagsfile to save tags.'
    }
});

gulp.task('test', 'Build, migrate, and test the application.', ['build'], function() {
    setupEnvironment();
    var args = yargs.reset()
    .usage('Usage: $0 test [options]')
    .option('reporter', {
        alias: 'r',
        demand: false,
        describe: '[type] Set the test reporter type.',
        choices: ['nyan'],
        type: 'string',
        requiresArg: true
    }).argv;

    // TODO: Implement test runner
    return "";
}, {
    aliases: ['t', 'T'],
    options: {
        'reporter': '[type] Set the test reporter type. Must be one of nyan|cheddar.'
    }
});

gulp.task('run', 'Build, migrate, and run the application.', ['build', 'migrate'], function() {
    setupEnvironment();
    var args = yargs.reset()
    .usage('Usage: $0 run [options]')
    .option('squelch', {
        alias: 's',
        demand: false,
        describe: 'Squelch request logging.',
        type: 'boolean'
    }).argv;

    // Set the squelch environment variable.
    process.env.NETDECKYR_SQUELCH = args.squelch;

    // Start the server.
    require('server');
}, {
    aliases: ['r', 'R', 'server', 's', 'S'],
    options: {
        'squelch': 'Squelch request logging.'
    }
});
