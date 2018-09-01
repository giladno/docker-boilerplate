('use strict');
const path = require('path');
const express = require('express');
const winston = require('winston');

const __DEV__ = process.env.NODE_ENV == 'development';

const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL);

winston.add(
    new winston.transports.Console({
        level: process.env.LOG_LEVEL || 'info',
        format: winston.format.combine(winston.format.colorize({level: true}), winston.format.simple()),
    })
);

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/healthcheck', (req, res) => res.send('ok'));

if (__DEV__) {
    require('longjohn');
    app.use(require('morgan')('dev'));
    app.use((req, res, next) => {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    });
}

for (const [name, controller] of Object.entries(
    require('require-all')({dirname: path.resolve(__dirname, './controllers'), recursive: false})
)) {
    winston.info(`Registering controller /${name}`);
    app.use(`/${name}`, controller);
}

app.use((req, res) => res.status(404).send('Not Found'));

app.use((err, req, res, next) => {
    winston.error(err.message, {url: req.url, err});
    res.status(500).send('Server Error');
    next;
});

process.on('unhandledRejection', err => {
    winston.error(err.message, {err});
    throw err;
});

(async () => {
    await sequelize.sync();
    await new Promise((resolve, reject) =>
        require('http')
            .Server(app)
            .listen(Number(process.env.PORT) || 3000, resolve)
            .on('error', reject)
    );
    winston.info('server is running...');
})();
