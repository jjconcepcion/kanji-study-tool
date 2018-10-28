const express = require('express');
const Kanji = require('../models/kanji');

const router = express.Router();

router.get('/', (req, res) => {
  const { keyword } = req.query;
  const renderOptions = {
    loggedIn: req.user,
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