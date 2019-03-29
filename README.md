# Ka

## Set up

 1. Install [Git], [Docker], and [Docker Compose].
 2. [Clone] this repo.

[git]: https://help.github.com/articles/set-up-git/#setting-up-git
[docker]: https://docs.docker.com/install/
[docker compose]: https://docs.docker.com/compose/install/
[clone]: https://help.github.com/articles/cloning-a-repository/

## Development cycle

  * `docker-compose up` serves the webapp on http://localhost:8080 and recompiles on code change.
  * Attach to the container with `docker-compose exec web sh` to run these commands:
     * `yarn run lint` runs the linter
     * `yarn run test` runs the tests
