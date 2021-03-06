const express = require('express');
const Kanji = require('../models/kanji');

const router = express.Router();

router.get('/', (req, res) => {
  if (!req.query.keyword) {
    return res.redirect('/');
  }

  const keyword  = req.query.keyword.trim();
  const renderOptions = {
    loggedIn: req.user,
    navSearchBar: true,
    searchTerm: keyword,
  }

  Kanji.search(keyword)
    .then(results => {
      const { rowCount, rows } = results;
      if (rowCount > 0) {
        renderOptions.searchResults = rows;
      }
      res.render('search', renderOptions);
    })
    .catch(err => console.log(err));
});

module.exports = router;