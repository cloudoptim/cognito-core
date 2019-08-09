const sequelize = require('../config/sequelize');
const User = require('./User');
const Credential = require('./Credential');

User.hasMany(Credential, { onDelete: 'CASCADE', onUpdate: 'CASCADE', hooks: true });
Credential.belongsTo(User, { onDelete: 'CASCADE', onUpdate: 'CASCADE', hooks: true });

module.exports = {
  User,
  Credential,
  db: sequelize,
}