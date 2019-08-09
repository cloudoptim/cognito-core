const passport = require('passport');
const { Router } = require('express');
const AuthController = require('../controllers/AuthController');

const wrap = fn => (req, res, next) => {
  fn(req, res, next).catch(next);
};

/**
 * Ensure authenticaticated middleware
 */
const ensureAuth = passport.authenticate('jwt', { session: false });
const router = Router();

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method && req.method.toUpperCase() === 'OPTIONS') {
    return res.status(201).end();
  }
  next();
});

// Authentication/Registration routes
router.get('/profile', ensureAuth, wrap(async (req, res) => {
  res.json({ me: req.user });
}));
router.post('/connect/:provider', wrap(AuthController.connect));
router.get('/auth/:provider/callback', wrap(AuthController.callback));
router.get('/auth/:provider', AuthController.provider);

module.exports = router;
