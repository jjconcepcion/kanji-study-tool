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
module.exports = {
  findByCharacter,
} 