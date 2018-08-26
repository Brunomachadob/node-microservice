import * as http from 'http';
import * as cluster from 'cluster';
import * as os from 'os';

import winstom from './config/winston';

import App from './App';

const port = Number(process.env.PORT) || 8080;

App.build().then((instance) => {
    const server = http.createServer(instance);

    server.listen(port, () => {
        let addr = server.address();
        let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
        
        winstom.info(`Worker ${process.pid} listening on ${bind}`);
    });

    server.on('error', onError);
}).catch((err) => {
    winstom.error(err);
})


function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;

    switch (error.code) {
        case 'EACCES':
            console.error(`${port} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${port} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}