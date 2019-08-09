/**
 * Sequelize
 */
const Sequelize = require('sequelize');
const nconf = require('nconf');

const dbConfig = nconf.get('postgres') || {};

const Op = Sequelize.Op;
const operatorsAliases = {
  $iLike: Op.iLike,
};

let opts = {
  host: dbConfig.host || 'localhost',
  port: dbConfig.port || 5432,
  dialect: 'postgres',
  operatorsAliases,

  pool: {
    max: 5,
    min: 0,
    idle: 100
  },

  logging: false,
  // logging: (msg) => logger.debug(msg),
};

let dbName = dbConfig.database || 'authservice';
let dbUserName = dbConfig.username || 'authuser';
let dbPassword = dbConfig.password || '';

module.exports = new Sequelize(dbName, dbUserName, dbPassword, opts);
