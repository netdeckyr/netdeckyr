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
2. Create a shell script to store your secret keys. If you call it `secret.sh`, then `env.sh` will automatically source it when it runs. You'll need to define the following variables:
    * `EXPRESS_SECRET_KEY`
    * `EXPRESS_ADMIN_PASSWORD`
    * `DB_PASSWORD`
3. `source env.sh` to set up the environment.
    * `source env.sh [secrets filename]` if you're not using `secrets.sh`.
4. `npm install gulp -g` to install the latest gulp cli.
5. `gulp run` will build, run db migrations, and run the server.
