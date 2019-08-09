const { Credential, User } = require('../../models')
/**
 * Social Auth
 * @param {*} type
 * @param {*} provider
 * @param {*} token
 * @param {*} profile
 */
const socialOauth = async (type, provider, token, profile, user) => {
  // Require either type is oauth or oauth2
  if (type !== 'oauth' && type !== 'oauth2') {
    throw { status: 400, message: 'Invalid type' };
  }

  // Create the user OAuth profile
  let email = profile.emails[0].value;
  let identifier = profile.id;

  let credential = await Credential.findOne({ where: { type, provider, identifier } });
  if (credential) {
    logger.debug('Found credential', identifier, 'from', provider, 'returning user');
    return await credential.getUser();
  }

  if (user) {
    let userId = user.id;
    await Credential.create({ type, provider, identifier, token, userId, raw: profile });
    return user;
  }

  let [usr, created] = await User.findOrCreate({
    where: { email },
    defaults: {
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      role: profile.role,
      emailVerified: true,
    }
  });

  logger.info('User is created:', { created, email });
  await usr.createCredential({ type, provider, identifier, token, raw: profile });

  return { firstLogin: created, ...usr.toJSON() };
}

module.exports = (provider, profileModifier = (profile => profile)) => ({
  verify(token, refreshToken, profile, done) {
    socialOauth('oauth2', provider, null, profileModifier(profile)).then(user => done(null, user)).catch(done);
  },

  async connect(user, token, profile) {
    return socialOauth('oauth2', provider, null, profileModifier(profile), user);
  }
});
