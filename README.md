# Ka

## Development setup

Dependencies: Git, PostgreSQL, Node.js, Yarn.

 1. Clone this repo.

 2. Install dependencies:
    ```
    yarn
    ```

 3. Generate the character SQL:
    ```
    yarn run tsc -b packages/kanjidic2sql
    node packages/kanjidic2sql kanjidic2var.xml >> character.sql
    ```

 4. Create the PostgreSQL database:
    ```
    psql
    CREATE DATABASE ka;
    \c ka
    \i schema.sql
    \i character.sql
    exit
    ```

 5. Create a `.env` file in the root of the project to specify environment
    variables. It should look like the example below. You can omit variables
    if the default is fine.
    ```
    # PostgreSQL - See https://www.postgresql.org/docs/9.1/libpq-envars.html
    PGHOST=[defaults to localhost]
    PGPORT=[defaults to 5432]
    PGUSER=
    PGDATABASE=ka
    PGPASSWORD=

    # @ka/web config
    ## The API's URL. The default is correct for local development.
    API_URL=[defaults to http://localhost:3000]
    ```

 6. Run `yarn run dev` (described below) and make sure you can hit
    localhost:8080.

## Development cycle

  * `yarn run dev` starts the following three commands concurrently. Press
    **Ctrl-C** to stop.
      * `yarn run dev:build:project` compiles the project in watch mode.
      * `yarn run dev:serve:rest` starts an auto-reloading rest server at
        localhost:3000.
      * `yarn run dev:serve:web` starts an auto-reloading web server at
        localhost:8080.
  * `yarn run format` formats js, json, ts, and tsx files. Run before
    committing.
  * `yarn run lint` lints each package. Make sure this passes before committing.
  * `yarn run test` runs each package's tests, and ensures each project
    maintains 80% coverage. Make sure this passes before committing.
