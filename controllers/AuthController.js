/**
 * AuthController
 */
const passport = require('passport');
const { promisify } = require('util');
const AuthService = require('../services/AuthService');
const passportConf = require('../config/passport');

/**
 * Callback
 * route: /auth/:provider/callback
 */
const callback = async (req, res, next) => {
  let provider = passportConf[req.params.provider];

  passport.authenticate(provider.name, {
    session: false,
    failureRedirect: '/login'
  })(req, res, (err) => {
    if (err) {
      return next(err);
    }
    let user = req.user;
    res.json({
      user,
      token: 'not-supported-as-we-dont-have-session',
    });
  });
};

/**
 * Authentication provider
 * Route: /auth/:provider
 */
const provider = async (req, res, next) => {
  let providerName = req.params.provider;
  let provider = passportConf[providerName];

  if (!['oauth', 'oauth2'].includes(provider.protocol)) {
    return next();
  }

  passport.authenticate(provider.name, { session: false, scope: provider.scope })(req, res, next);
}

const connect = async (req, res) => {
  let { name: providerName } = passportConf[req.params.provider];
  let provider = AuthService.providers[req.params.provider];
  let strategy = passport._strategy(providerName);
  let getProfile = promisify(strategy.userProfile).bind(strategy);

  let { accessToken, role, idToken } = req.body;
  let profile = await getProfile(accessToken);
  let user = await provider.connect(req.user, accessToken, { role, ...profile });

  res.json({
    user,
    token: idToken,
  });
};

module.exports = {
  callback,
  provider,
  connect,
}
