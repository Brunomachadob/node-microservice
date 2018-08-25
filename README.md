# Simple NodeJS Typescript 

### Architeture

**Runtime**

* Node 8.1+ (runtime)
* Express (web framework)
* Mongo/Mongoose (storage and data access)
* morgan/winston (log library)

**Dev**
* Typescript
* Mocha (test framework)
* Chai (assertions library)
* SuperTest (http assertions)
* nyc (coverage library)

### Requirements

* Node 8.1+
* mongo
* docker
* docker-compose

### Commands

* `npm install` to install all dependencies.
* `npm run build` to build the production artifact (output `./dir`).
* `npm run dev` to run in dev mode with hot reload.
* `npm test` to run unit tests.
* `npm run prod` to run in prod in cluster mode.