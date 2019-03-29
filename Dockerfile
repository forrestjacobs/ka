FROM node:8-alpine AS base
WORKDIR /usr/src/app
COPY lerna.json package.json yarn.lock ./
COPY packages/base/package.json ./packages/base/package.json
COPY packages/data/package.json ./packages/data/package.json
COPY packages/kanjidic2sql/package.json ./packages/kanjidic2sql/package.json
COPY packages/rest/package.json ./packages/rest/package.json
COPY packages/web/package.json ./packages/web/package.json
RUN yarn
COPY . .

FROM base AS schema-builder
RUN yarn run tsc -b packages/kanjidic2sql
RUN node packages/kanjidic2sql kanjidic2var.xml >> schema.sql

FROM postgres:11-alpine AS db
COPY --from=schema-builder /usr/src/app/schema.sql /docker-entrypoint-initdb.d/
