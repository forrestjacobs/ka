# Ka

## Set up

### 1. Get and build the app and dependencies

 1. Install [Git], [Node.js], [Yarn], [PostgreSQL], and [HAProxy].
 2. [Clone] this repo.
 3. In the cloned directory, run:
    ```
    yarn
    yarn run build
    ```

[git]: https://help.github.com/articles/set-up-git/#setting-up-git
[node.js]: https://nodejs.org/
[yarn]: https://yarnpkg.com/
[postgresql]: https://www.postgresql.org/
[haproxy]: http://www.haproxy.org/
[clone]: https://help.github.com/articles/cloning-a-repository/

### 2. Set up the database

 1. Create a PostgresSQL database for Ka. Run `schema.pgsql` in this new database to create the table structure.
 2. Copy `packages/rest/example.env` to `packages/rest/.env`, and edit the new `.env` file to point to the PostgresSQL database.

### 3. Load the dictionary
 1. Download the [kanjidic2 archive] and extract it to the cloned directory.
 2. Remove the doctype (lines between `<?xml version="1.0" encoding="UTF-8"?>` and the root element `<kanjidic2>`) in the extracted `kanjidic2.xml`. (You need to do this because [sax] chokes on the doctype.)
 3. Run:
    ```
    node ./packages/kanjidic2sql/lib/index.js kanjidic2.xml > kanjidic2.pgsql
    ```
 4. Run `kanjidic2.pgsql` in the database.

[sax]: https://github.com/isaacs/sax-js
[kanjidic2 archive]: http://www.edrdg.org/kanjidic/kanjidic2.xml.gz

### 4. Start the server

 1. Run:
    ```
    yarn run serve
    ```
 2. Go to http://localhost:8080
