const express = require('express');
const Kanji = require('../models/kanji');

const router = express.Router();

router.get('/:character', (req, res) => {
  const renderOptions = {
    loggedIn: req.user,
    navSearchBar: true,
  }

  const { character } = req.params;
  Kanji.findByCharacter(character)
    .then(results => {
      const { rowCount, rows } = results;
      if (rowCount == 1) {
        renderOptions.kanjiData = rows[0];
        res.render('kanji', renderOptions);
      } else {
        renderOptions.message = 'Kanji Not Found';
        res.render('error', renderOptions)
      }
    })
    .catch(err => console.log(err));
});

module.exports = router;
