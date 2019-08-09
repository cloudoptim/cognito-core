/**
 * JWT authenticate object
 */
const { User } = require('../../models');

module.exports.verify = ({ email }, done) => {
  if (!email) {
    return done(null, false, { status: 401, message: 'Missing user email' });
  }

  User.findOne({ where: { email: { $iLike: email.toLowerCase() } } }).then(user => {
    if (!user) {
      return next({ status: 401, message: 'User not found' });
    }

    done(null, user.toJSON());
  }).catch(err => done(err, false));
};
