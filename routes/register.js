const express = require('express');
const dbError = require('../database/errorCodes');
const User = require('../models/users');
const validate = require('../models/validation');
const router = express.Router();

router.get('/', function(req, res) {
  if (req.user) {
    res.redirect('/');
  } else {
    res.render('register');
  }
});

router.post('/', function(req, res, next) {
  const { error } = validate['registerUser'](req.body);

  if (error) {
    res.render('register', { message: error.details[0].message })
  } else {
    const { email, username, password } = req.body;
    
    User.generatePasswordHash(password)
      .then(passwordHash => User.createUser(email, username, passwordHash))
      .then(results => results.rows[0])
      .then(user => {
        req.login(user, (err) => {
          if (err) {
            return next(err);
          } else {
            res.redirect('/');
          }
        })
      })
      .catch(error => {
        if (error.code = dbError.unique_violation) {
          const fieldName = (error.detail.match(/email/)) ? 'email' : 'username';
          res.render('register', { message: `${fieldName} is already registered`});
        }
      });
  }
});

module.exports = router;