const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  const lastVisited = req.session.lastVisited;
  req.logout();
  req.session.destroy();
  res.redirect(lastVisited || '/');
});

module.exports = router;