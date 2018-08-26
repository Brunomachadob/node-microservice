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
* `npm start` to run in prod in cluster mode.

### Monitoring

#### Prometheus

There are some metrics that are exposed on `/metrics` path.

To start a prometheus instance to view those metrics:
`docker run -d --net=host --name=prometheus -v ./ci/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus`

#### Grafana

Also, it has a grafana dashboard, configured with the default metrics gathered from prometheus:

`docker run -d --net=host --name=grafana -v grafana-storage:/var/lib/grafana grafana/grafana`

Then, open grafana the admin and import the `ci/grafana-dashboard.json` file.