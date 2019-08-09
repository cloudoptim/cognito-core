/**
 * Authentication service
 */
const oauth2 = require('./providers/oauth2');
const jwt = require('./providers/jwt');

const providers = {
  jwt,
  cognito: oauth2('cognito', (profile) => {
    let { email, first_name, last_name, sub: id } = profile;
    return {
      ...profile,
      id,
      emails: [{ value: email }],
      name: { givenName: last_name, familyName: first_name },
    }
  }),
  auth0: oauth2('auth0'),
};

/**
 * Connect provider data to app
 * @param providerName
 */
const connect = (providerName, ...args) => {

  let provider = providers[providerName];
  if (typeof provider.connect === 'function') {
    return provider.connect(args)
  };

  // Last arguments is callback
  args.pop()({
    code: 'connect.not.supported',
    message: 'No connect support for this provider',
  });
};

module.exports = {
  providers,
  connect,
};
