import * as path from 'path';
import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';

import database from './config/database';

import winston from './config/winston';

import apiV1 from './api/v1';

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    private middleware(): void {
        this.express.use(morgan(':method :url :status - :response-time ms', {
            stream: {
                write: (message: String) => {
                    winston.info({
                        label: 'HTTP',
                        message
                    });
                }
            }
        }));

        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {
        this.express.use('/api/v1', apiV1);
    }
}

export default {
    build: () => new Promise<express.Application>((res, rej) => {
        return database.connect().then(() => {
            res(new App().express);
        }, rej)
    })
}