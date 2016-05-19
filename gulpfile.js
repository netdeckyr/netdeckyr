/* jshint esversion: 6 */

var gulp    = require('gulp-help')(require('gulp')),
    gutil   = require('gulp-util'),
    genv    = require('gulp-env'),
    through = require('through2'),
    yargs   = require('yargs'),
    path    = require('path'),
    _       = require('lodash'),
    chai    = require('chai');

// Helpers

function getConfigurationFilename(config) {
    const environmentDirectory = 'env';
    var result;
    if (path.extname(config) !== '') {
        result = config;
    } else {
        result = path.format({
            name: config,
            ext: '.json'
        });
    }
    result = path.join(environmentDirectory, result);
    return result;
}

function setupEnvironment(configFileName) {
    var args = yargs.reset()
    .option('config', {
        demand: false,
        describe: '[file] Set the deployment config file.',
        type: 'string',
        default: configFileName !== undefined ? configFileName : 'env.js',
        requiresArg: true
    })
    .option('secret', {
        demand: false,
        describe: '[file] Set the secret config file.',
        type: 'string',
        default: 'secret.js',
        requiresArg: true
    }).argv;

    var configFile = getConfigurationFilename(args.config);
    var secretFile = getConfigurationFilename(args.secret);

    genv({ file: configFile });
    genv({ file: secretFile });
}

// Tasks

gulp.task('lint', 'Lint the codebase.', function() {
    var args = yargs.reset()
    .usage('Usage: $0 lint [options]')
    .option('lint-tools', {
        demand: false,
        describe: 'Lint both the application source code and tooling source code.',
        type: 'boolean'
    }).option('jshint-reporter', {
        demand: false,
        describe: 'Set the reporter for jshint.',
        default: 'jshint-stylish',
        type: 'string',
        requiresArg: true
    }).argv;
    var jshint = require('gulp-jshint');

    gutil.log(`Using reporter: ${gutil.colors.cyan(args.jshintReporter)}`);

    // Lint the src and test directories by default.
    var files = ['src/**/*.js', 'test/**/*.js'];

    if (args.lintTools) {
        // Lint the root directory (therefore all tooling code - gulp, knex, etc.)
        // and migrations directory.
        files.push('*.js');
        files.push('migrations/**/*.js');
    }

    return gulp.src(files)
    .pipe(through.obj(function(file, enc, cb) {
        gutil.log(`Linting file: ${gutil.colors.magenta(file.path)}`);
        cb(null, file);
    }))
    .pipe(jshint())
    .pipe(jshint.reporter(args.jshintReporter));
}, {
    aliases: ['l', 'L'],
    options: {
        'lint-tools': 'Lint both the application source code and tooling source code.',
        'jshint-reporter': 'Set the reporter for jshint.'
    }
});

gulp.task('build', 'Build the application.', ['lint'], function() {
    setupEnvironment();
    var args = yargs.reset()
    .usage('Usage: $0 build')
    .argv;

}, {
    aliases: ['b', 'B'],
    options: {
        'config': '[filename] Set the configuration file to use in the env directory.',
        'secret': '[filename] Set the secret configuration file to use in the env directory.'
    }
});

gulp.task('doc', 'Generate documentation for the application.', function() {
    // TODO: Implement
    gutil.log(gutil.colors.yellow("Warning: Task not implemented."));
}, {
    aliases: ['d', 'D']
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
        'create': '[name] Create a migration with the specified name.',
        'config': '[filename] Set the configuration file to use in the env directory.',
        'secret': '[filename] Set the secret configuration file to use in the env directory.'
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

    var tagsfile = args.tagsfile ? args.tagsfile : 'tags';

    return gulp.src('src/**/*.js')
    .pipe(ctags(tagsfile))
    .pipe(gulp.dest('./'));
}, {
    aliases: ['g', 'G'],
    options: {
        'tagsfile': '[file] Tagsfile to save tags.'
    }
});

gulp.task('test', 'Build, migrate, and test the application.', ['build', 'migrate'], function() {
    setupEnvironment();
    var args = yargs.reset()
    .usage('Usage: $0 test [options]')
    .option('tests-reporter', {
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
        'tests-reporter': '[type] Set the test reporter type. Must be one of nyan|cheddar.'
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
