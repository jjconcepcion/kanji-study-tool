--
-- USERS TABLE
--
CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(20) UNIQUE NOT NULL,
    "email" VARCHAR(50) UNIQUE NOT NULL,
    "password_hash" VARCHAR(128),
    "creation_date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

--
-- SESSION TABLE
-- 
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;


--
-- KANJI TABLE
--
CREATE TABLE IF NOT EXISTS "kanji" (
  "rtk_no" SMALLSERIAL PRIMARY KEY,
  "kanji" CHAR(1) NOT NULL,
  "keyword" VARCHAR(50) NOT NULL,
  "onyomi" VARCHAR(100),
  "kunyomi" VARCHAR(200),
	"meaning" VARCHAR(200)
);

--
-- NOTE TABLE
--
CREATE TABLE IF NOT EXISTS "note" (
  "kanji_id" SMALLINT REFERENCES kanji("rtk_no"),
  "user_id" INT REFERENCES users("id"),
  "text" VARCHAR(1500)
);
ALTER TABLE "note" ADD CONSTRAINT "note_pkey" PRIMARY KEY ("kanji_id", "user_id");
