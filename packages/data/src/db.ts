import pgPromise from "pg-promise";

export const pgp = pgPromise();
export const db = pgp({});
