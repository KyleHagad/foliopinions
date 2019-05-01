const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const router = express.Router();

const User = mongoose.model('user');
const Opinion = mongoose.model('opinion');

router.get('/', (req, res) => { // <=< to Welcome page
  res.render('index/welcome', {
    pageLabel: 'Welcome',
  });
});

router.get('/dash', (req, res) => { // <=< to Dash
  Opinion.find({
      user: req.user.id
    })
    .then(opinions => {
      res.render('index/dash', {
        pageLabel: 'Dash',
        opinions: opinions
      });
    });
});

router.get('/about', (req, res) => { // <=< to About
  res.render('index/about', {
    pageLabel: 'Index',
  });
});

module.exports = router;
