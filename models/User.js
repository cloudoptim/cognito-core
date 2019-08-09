/**
 * User model
 */
const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');
const userRoles = require('nconf').get('userRoles') || {};

const User = sequelize.define('user', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  role: {
    type: Sequelize.STRING(20),
    values: userRoles.roles || ['ADMIN', 'USER'],
    defaultValue: userRoles.defaultsTo || 'USER'
  },
  emailVerified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  enabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
});

module.exports = User;
