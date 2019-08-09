const serverless = require('serverless-http');
const express = require('express');
const app = express();
const nconf = require('nconf');
const passport = require('passport');

let CONFIG_SCHEME = process.env.CONFIG_SCHEME || 'local';
nconf.argv()
  .env({ separator: '_', lowerCase: true })
  .file({ file: `config/env/.${CONFIG_SCHEME}.json` });

nconf.defaults({
  PORT: 3000,
  NODE_ENV: 'development',
  userRoles: {
    roles: ['ADMIN', 'USER'],
    defaultsTo: 'USER'
  },
});

global.logger = require('./config/logger');

// ORM config and sync
let { db } = require('./models');
db.sync({}).then(() => {
  logger.info('DB Initialized');
}).catch(err => {
  logger.error('Error initialize db', err);
});

const passportConf = require('./config/passport');
const { providers } = require('./services/AuthService');
Object.entries(passportConf).forEach(([key, { Strategy, options }]) => {
  logger.info(`Registering strategy ${key}`);
  passport.use(new Strategy(options, providers[key].verify));
});

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome AuthService!')
});


// Initialize db connection
app.use((req, res, next) => {
  require('./models');
  next();
});

// Configure routing
app.use(require('./config/routes'));

app.all('*', (req, res, next) => {
  // Response 404
  logger.warn(`Route not found '${req.originalUrl}'`)
  res.status(404).send({ message: '404 Not Found' })
});

// Error handler
app.use((err, req, res, next) => {
  if (err) {
    logger.error(`Error processing route '${req.originalUrl}'`, err);
    return res.status(err.status || 500).send(err);
  }
  next();
});

module.exports.coreAuth = serverless(app);
