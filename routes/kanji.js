const express = require('express');
const Kanji = require('../models/kanji');
const Note = require('../models/note');

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
        return renderOptions.kanjiData.rtk_no;
      } else {
        renderOptions.title = 'Not Found';
        renderOptions.message = 'The requested kanji was not found';
        res.status(404).render('404', renderOptions)
      }
    })
    .then(kanjiId => {
      const userId = (req.user) ? req.user.id : undefined;
      if (userId) {
        Note.getText(kanjiId, userId)
          .then(results => {
            const note = (results.rows[0])? results.rows[0].text : undefined;
            renderOptions.kanjiData.note = note;
            res.render('kanji', renderOptions)
          })
          .catch(err => console.log(err));
      } else {
        res.render('kanji', renderOptions)
      }
    })
    .catch(err => console.log(err));
});

module.exports = router;
