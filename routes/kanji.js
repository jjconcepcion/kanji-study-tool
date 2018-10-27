const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  const kanjiData = {
    rtk_no: 1701,
    kanji: '漢',
    keyword: 'Sino-',
    onyomi: 'カン',
    kunyomi: null,
    meaning: 'Sino-,China',
    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin elit enim, tempor eget nunc vel, eleifend condimentum ipsum. Pellentesque pharetra.'
  };
  res.render('kanji', { kanjiData });
});

module.exports = router;
