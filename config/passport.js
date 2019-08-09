const nconf = require('nconf');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: Auth0Strategy } = require('passport-auth0');
const OAuth2CognitoStrategy = require('passport-oauth2-cognito');
const baseUrl = nconf.get('baseUrl');

module.exports = {
  jwt: {
    Strategy: JwtStrategy,
    options: {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: (req, rawJwtToken, done) => {

        let { iss } = jwt.decode(rawJwtToken);

        const jwksUri = `${iss.replace(/\/$/, '')}/.well-known/jwks.json`;
        logger.info(`Fetching issuer jwks: ${jwksUri}`);

        fetch(jwksUri).then(r => r.json())
          .then(({ keys }) => {
            if (!keys || !keys.length) {
              return done(new Error('The JWKS endpoint did not contain any keys'));
            }

            const signingKeys = keys
              .filter(key => key.use === 'sig' && key.kty === 'RSA' && key.kid && ((key.x5c && key.x5c.length) || (key.n && key.e)))
              .map(key => jwkToPem(key));


            if (!signingKeys.length) {
              return done(new Error('The JWKS endpoint did not contain any signing keys'));
            }

            done(null, signingKeys[0]);
          })
          .catch(err => {
            logger.error('Error fetching jwk keys', err);
            done(err);
          });
      },
      algorithms: ['RS256'],
    }
  },
  auth0: {
    name: 'auth0',
    protocol: 'oauth2',
    Strategy: Auth0Strategy,
    scope: ['openid', 'profile', 'email'],
    options: Object.assign({
      callbackURL: `${baseUrl}/auth/auth0/callback`,
    }, nconf.get('auth0')),
  },
  cognito: {
    name: 'oauth2-cognito',
    protocol: 'oauth2',
    Strategy: OAuth2CognitoStrategy,
    scope: ['openid', 'email', 'profile', 'aws.cognito.signin.user.admin'],
    options: Object.assign({
      callbackURL: `${baseUrl}/auth/cognito/callback`,
    }, nconf.get('cognito')),
  },
};
