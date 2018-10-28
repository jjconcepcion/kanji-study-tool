const db = require('../database');

function findByCharacter(character) {
  const query = {
    text: `
    SELECT * FROM kanji
    WHERE kanji = $1
    `,
    values: [character],
  };
  return db.query(query)
}

function search(term) {
  const query = {
    text: `
    SELECT * FROM kanji
    WHERE keyword like $1
    ORDER BY char_length(keyword);
    `,
    values: [`%${term}%`],
  };
  return db.query(query)
}

module.exports = {
  findByCharacter,
  search,
} 