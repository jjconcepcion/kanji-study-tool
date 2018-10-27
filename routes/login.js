const express = require('express');
const passport = require('passport')
const router = express.Router();

router.get('/', function(req, res) {
  if (req.user) {
    res.redirect('/')
  } else {
    res.render('login');
  }
});

router.post('/',
  passport.authenticate('local', { failureRedirect: '/login' }), 
  (req, res) => {
    const lastVisited = req.session.lastVisited;
    res.redirect(lastVisited || '/');
  });

module.exports = router;