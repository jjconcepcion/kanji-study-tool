const express = require('express');
const Kanji = require('../models/kanji');

const router = express.Router();

router.get('/:character', (req, res) => {
  const renderOptions = {
    loggedIn: req.user,
    navSearchBar: true,
  }
  const { character } = req.params;
  const { search } = req.session
  let previouslySearched = false
  // check if requested character saved from previous search
  if (search && search.results) {
    const kanjiData = search.results.filter(row => row.kanji === character);
    if (kanjiData) {
      previouslySearched = true;
      renderOptions.kanjiData = kanjiData[0];
      res.render('kanji', renderOptions);
    }
  }
  if (!previouslySearched) {
    Kanji.findByCharacter(character)
      .then(results => {
        const { rowCount, rows } = results;
        if (rowCount == 1) {
          renderOptions.kanjiData = rows[0];
          res.render('kanji', renderOptions);
        } else {
          renderOptions.title = 'Not Found';
          renderOptions.message = 'The requested kanji was not found';
          res.status(404).render('404', renderOptions)
        }
      })
      .catch(err => console.log(err));
  }
});

module.exports = router;
