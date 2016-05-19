netdeckyr
=========

netdeckyr is a database and community for sharing Duelyst decks. Users can manage their Duelyst collections and share decks with other players, posting comments and upvoting their favorite and most effective decks.

## Planned Features

* □ Deck sharing
* □ Deck export
* □ Deck import from Duelyst application
* □ Social features - upvote, comments, sharing
* □ Deck revisions - update a deck and keep a log of changes

## Getting Started

1. `npm install` to install all dependencies.
2. You'll need to create a secrets file to store secret environment variables. The default secrets file that all gulp commands will reference is `env/secrets.js`, but you can pass `--secret [secretsfile]` to any gulp task to change the secrets file path. You'll need to define the following variables:
    * `EXPRESS_SECRET_KEY`
    * `EXPRESS_ADMIN_PASSWORD`
    * `DB_PASSWORD`
3. `npm install gulp -g` to install the latest gulp cli.
    * You'll also need `javascript-ctags` installed globally if you want to use the `gulp tags` task. `npm install javascript-ctags -g`
4. `gulp run` will build, run db migrations, and run the server.
    * `gulp run & > [logfile]` will run the server in the background quietly and save stdout to the log file.

## Gulp Tasks

`gulp help` will list all available tasks and options
