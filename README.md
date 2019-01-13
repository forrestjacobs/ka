# Ka

## Set up

 1. Install [Git], [Node.js], [Yarn], [PostgreSQL], and [HAProxy].
 2. [Clone] this repo.
 3. In the cloned directory, run:
    ```
    yarn
    yarn run build
    node ./packages/kanjidic2sql > dict.pgsql
    ```
 4. Create a PostgresSQL database for Ka. Run `schema.pgsql` in to create the
    table structure, and `dict.pgsql` to load the dictionary contents.
 5. Copy `packages/rest/example.env` to `packages/rest/.env`, and edit the new
    `.env` file to point to the database.

[git]: https://help.github.com/articles/set-up-git/#setting-up-git
[node.js]: https://nodejs.org/
[yarn]: https://yarnpkg.com/
[postgresql]: https://www.postgresql.org/
[haproxy]: http://www.haproxy.org/
[clone]: https://help.github.com/articles/cloning-a-repository/

## Start the server

Run `yarn run serve` to start the server on port 8080. (`Ctrl-C` to stop.)
