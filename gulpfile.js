/* jshint esversion: 6 */

var gulp    = require('gulp-help')(require('gulp')),
    gutil   = require('gulp-util'),
    genv    = require('gulp-env'),
    gwatch  = require('gulp-watch'),
    gulpif  = require('gulp-if'),
    through = require('through2'),
    merge   = require('merge-stream'),
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
        describe: '[filename] Set the configuration file to use in the env directory.',
        type: 'string',
        default: configFileName !== undefined ? configFileName : 'env.js',
        requiresArg: true
    })
    .option('secret', {
        demand: false,
        describe: '[filename] Set the secret configuration file to use in the env directory.',
        type: 'string',
        default: 'secret.js',
        requiresArg: true
    }).argv;

    var configFile = getConfigurationFilename(args.config);
    var secretFile = getConfigurationFilename(args.secret);

    genv({ file: configFile });
    genv({ file: secretFile });
}

var logFilesWithMessage = function(message) {
    return through.obj(function(file, enc, cb) {
        gutil.log(message + " " + `${gutil.colors.magenta(file.path)}`);
        cb(null, file);
    });
};

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
        describe: '[reporter] Set the reporter for jshint.',
        default: 'jshint-stylish',
        type: 'string',
        requiresArg: true
    }).option('sass-lint-reporter', {
        demand: false,
        describe: '[reporter] Set the reporter for sass-lint.',
        default: 'stylish',
        type: 'string',
        requiresArg: true
    }).argv;

    var jshint = require('gulp-jshint');
    var slint  = require('gulp-sass-lint');

    gutil.log(`Using jshint reporter: ${gutil.colors.cyan(args.jshintReporter)}`);
    gutil.log(`Using sass-lint reporter: ${gutil.colors.cyan(args.sassLintReporter)}`);

    // Lint the src and test directories by default.
    var jsFiles = ['src/**/*.js', 'test/**/*.js'];

    if (args.lintTools) {
        // Lint the root directory (therefore all tooling code - gulp, knex, etc.)
        // and migrations directory.
        jsFiles.push('*.js');
        jsFiles.push('migrations/**/*.js');
    }

    var jshintStream = gulp.src(jsFiles)
    .pipe(logFilesWithMessage('Linting file:'))
    .pipe(jshint())
    .pipe(jshint.reporter(args.jshintReporter));

    var sassStream = gulp.src(['src/assets/stylesheets/**/*.scss'])
    .pipe(logFilesWithMessage('Linting file:'))
    .pipe(slint())
    .pipe(slint.format())
    .pipe(slint.failOnError());

    return merge(jshintStream, sassStream);
}, {
    aliases: ['l', 'L'],
    options: {
        'lint-tools': 'Lint both the application source code and tooling source code.',
        'jshint-reporter': '[reporter] Set the reporter for jshint.',
        'sass-lint-reporter': '[reporter] Set the reporter for sass-lint.'
    }
});

gulp.task('sass', 'Compile the application sass files to the deployment public css directory.', function() {
    setupEnvironment();
    var args = yargs.reset()
    .option('watch', {
        demand: false,
        describe: 'Run as a daemon',
        type: 'boolean'
    }).argv;

    var sass = require('gulp-sass');

    gutil.log('Compiling sass files...');

    return gulp.src('src/assets/stylesheets/**/*.scss')
    .pipe(gulpif(args.watch, gwatch('src/assets/stylesheets/**/*.scss')))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(path.join(process.env.DEPLOYMENT_DIRECTORY, 'public', 'css')));
}, {
    options: {
        'config': '[filename] Set the configuration file to use in the env directory.',
        'watch': 'Run as a daemon.'
    }
});

gulp.task('build', 'Build the application.', ['lint', 'sass'], function() {
    setupEnvironment();
    var args = yargs.reset()
    .usage('Usage: $0 build')
    .argv;

}, {
    aliases: ['b', 'B'],
    options: {
        'config': '[filename] Set the configuration file to use in the env directory.',
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
        'tests-reporter': '[type] Set the test reporter type.',
        'config': '[filename] Set the configuration file to use in the env directory.',
        'secret': '[filename] Set the secret configuration file to use in the env directory.'
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
        'squelch': 'Squelch request logging.',
        'config': '[filename] Set the configuration file to use in the env directory.',
        'secret': '[filename] Set the secret configuration file to use in the env directory.'
    }
});
