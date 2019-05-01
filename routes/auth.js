const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const router = express.Router();

const User = mongoose.model('user');

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/'
  }),
  (req, res) => {
    res.redirect('/dash');
  });

router.get('/verify', (req, res) => {
  if (req.user) {
    console.log(req.user);
  } else {
    console.log('no auth');
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
