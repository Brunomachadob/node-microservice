import * as winston from 'winston';

const { format } = winston;

let logCfg = {
    production: {
        level: 'info'
    },
    development: {
        level: 'debug'
    },
    test: {
        level: 'error'
    }
}

/* coverage ignore next */
winston.configure(logCfg[process.env.NODE_ENV] || logCfg.development);

winston.remove(winston.transports.Console);
winston.add(new winston.transports.Console({
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(info => {
            if (info.label) {
                return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
            } else {
                return `${info.timestamp} ${info.level}: ${info.message}`;
            }
        })
    )
}));

/* coverage ignore if */
if (process.env.NODE_ENV === 'production') {
    winston.add(new winston.transports.File({
        filename: 'app.log',
        format: format.combine(
            format.timestamp(),
            format.json()
        )
    }));
}


export default winston;