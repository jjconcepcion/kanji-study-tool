const express = require('express');
const Note = require('../models/note');

const router = express.Router();

router.post('/', (req, res) => {
  const { kanjiId, kanjiChar, text } = req.body;
  const userId = req.user.id;

  Note.upsert(kanjiId, userId, text)
    .then(res.redirect(`/kanji/${kanjiChar}`))
    .catch(err => res.json(err));
});
module.exports = router;