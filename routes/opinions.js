const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const router = express.Router();

const User = mongoose.model('user');
const Opinion = mongoose.model('opinion');

router.get('/index', (req, res) => { // >>=Get to READ public opinions page=<<
  Opinion.find({ status: 'public' })
   .populate('user')
   .sort({ date: 'desc' })
   .then(opinions => {
    res.render('opinions/index', {
      pageLabel: 'Records index',
      opinions: opinions
    });
   });
});

router.get('/read/:id', (req, res) => { // >>=Get to READ opinion page=<<
  Opinion.findOne({ _id: req.params.id })
   .populate('user')
   .populate('comments.commentUser')
   .then(opinion => {
    if (opinion.status === 'public') {
      res.render('opinions/read', {
        opinion: opinion
      });
    } else {
      if (req.user) {
        if (req.user.id === opinion.user._id) {
          res.render('opinions/read', {
            opinion: opinion
          });
        } else {
          res.redirect('/opinions');
        }
      } else {
        res.redirect('/opinions');
      }
    }
   });
});

router.get('/user/:userId', (req, res) => { // >>=READ opinions from a particular user=<<
  Opinion.find({
      user: req.params.userId,
      status: 'public'
    })
    .populate('user')
    .then(opinions => {
      res.render('opinions/index', {
        opinions: opinions,
        pageLabel: 'Individual Index'
      });
    })
});

router.get('/my', (req, res) => { // >>=Logged in user's opinions=<<
  Opinion.find({ user: req.user.id })
    .populate('user')
    .then(opinions => {
      res.render('opinions/index', {
        opinions: opinions,
        pageLabel: 'Your Personal Index'
      });
    })
});

router.get('/create', (req, res) => { // >>=Get to Create opinions form=<<
  res.render('opinions/create', {
    pageLabel: 'Record Opinion'
  });
});

router.get('/update/:id', (req, res) => { // >>=Get to Update opinions form=<<
  Opinion.findOne({ _id: req.params.id })
    .then(opinion => {
      if (opinion.user != req.user.id) {
        res.redirect('opinions');
      } else {
        res.render('opinions/update', {
          pageLabel: 'Update Opinion',
          opinion: opinion
        });
      }
    });
});

router.post('/', ensureAuthenticated, (req, res) => { // >>=Create Opinion process=<<
  let allowComments;

  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newOpinion = { // <=< builds new opinion object
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  }

  new Opinion(newOpinion) // <=< saves the opinion object
    .save()
    .then(opinion => {
      res.redirect(`opinions/read/${opinion.id}`);
    });
});

router.put('/:id', (req, res) => { // >>=UPDATE opinion process=<<
  Opinion.findOne({ _id: req.params.id })
    .then(opinion => {
      let allowComments;

      if (req.body.allowComments) {
        allowComments = true;
      } else {
        allowComments = false;
      }

      opinion.title = req.body.title; // <=< New values for the opinion
      opinion.body = req.body.body;
      opinion.status = req.body.status;
      opinion.allowComments = allowComments;

      opinion.save()
        .then(opinion => {
          res.redirect('/dash');
        });
    });
});

router.delete('/:id', (req, res) => { // >>=DELETE opinion process=<<
  Opinion.remove({ _id: req.params.id })
    .then(() => {
      res.redirect('/dash');
    });
});

router.post('/comment/:id', (req, res) => { // >>=POST Comment=<<
  Opinion.findOne({ _id: req.params.id })
    .then(opinion => {
      const newComment = {
        commentBody: req.body.commentBody,
        commentUser: req.user.id
      }
      opinion.comments.unshift(newComment); // <=< add comment at index 0 of comments array

      opinion.save() // <=< save comment and display READ page with the new content
        .then(opinion => {
          res.redirect(`/opinions/read/${opinion.id}`);
        });
    });
});

module.exports = router;
