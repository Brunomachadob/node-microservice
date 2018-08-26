import * as express from 'express';

import { register, Counter, Histogram, Summary, collectDefaultMetrics } from 'prom-client';

import winston from './winston';

/**
 * A Prometheus counter that counts the invocations of the different HTTP verbs
 * e.g. a GET and a POST call will be counted as 2 different calls
 */
export const numOfRequests = new Counter({
    name: 'numOfRequests',
    help: 'Number of requests made',
    labelNames: ['method']
});

const httpRequestDurationMicroseconds = new Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'path', 'code'],
    buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]  // buckets for response time from 0.1ms to 500ms
})

/**
 * A Prometheus counter that counts the invocations with different paths
 * e.g. /foo and /bar will be counted as 2 different paths
 */
export const pathsTaken = new Counter({
    name: 'pathsTaken',
    help: 'Paths taken in the app',
    labelNames: ['path']
});

/**
 * This funtion will start the collection of metrics and should be called from within in the main js file
 */
export const startCollection = function () {
    winston.info(`Starting the collection of metrics, the metrics are available on /metrics`);
    collectDefaultMetrics();
};

/**
 * This function increments the counters that are executed on the request side of an invocation
 * Currently it increments the counters for numOfPaths and pathsTaken
 */
function requestCounters(req, res, next) {
    if (req.path != '/metrics') {
        numOfRequests.inc({ method: req.method });
        pathsTaken.inc({ path: req.path });
    }

    next();
}

function requestTime(req, res, next) {
    if (req.path == '/metrics') {
        return next();
    }

    res.locals.startEpoch = Date.now();
    res.locals.path = req.path;

    res.on('finish', function () {
        const responseTimeInMs = Date.now() - res.locals.startEpoch

        httpRequestDurationMicroseconds
            .labels(req.method, res.locals.path, String(res.statusCode))
            .observe(responseTimeInMs)
    });

    next();
}

/**
 * In order to have Prometheus get the data from this app a specific URL is registered
 */
export const injectMetricsRoute = function (App: express.Application) {
    App.get('/metrics', (req, res) => {
        res.set('Content-Type', register.contentType);
        res.end(register.metrics());
    });
};

export const injectMiddlewares = function (App: express.Application) {
    App.use(requestTime);
    App.use(requestCounters);
}