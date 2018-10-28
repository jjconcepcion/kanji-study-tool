const db = require('../database');

function upsert(kanjiId, userId, text) {
  const query = {
    text:`
    INSERT INTO note(kanji_id, user_id, text)
    VALUES($1, $2, $3)
    ON CONFLICT ON CONSTRAINT note_pkey
    DO UPDATE SET text = $3;
    `,
    values: [kanjiId, userId, text],
  };
  return db.query(query);
}

function getText(kanjiId, userId) {
  const query = {
    text:`
    SELECT * FROM note
    WHERE kanji_id = $1 AND
          user_id = $2;
    `,
    values: [kanjiId, userId],
  };
  return db.query(query);
}

module.exports = {
  upsert,
  getText,
};
