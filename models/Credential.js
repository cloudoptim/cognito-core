/**
 * Credential model
 */
const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const Credential = sequelize.define('credential', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  type: {
    type: Sequelize.STRING(128),
    allowNull: false
  },
  password: {
    type: Sequelize.STRING(64)
  },
  provider: {
    type: Sequelize.STRING(64)
  },
  identifier: {
    type: Sequelize.STRING(64),
    unique: true
  },
  token: {
    type: Sequelize.STRING(2048),
  },
  raw: {
    type: Sequelize.JSON,
  }
});

module.exports = Credential;
