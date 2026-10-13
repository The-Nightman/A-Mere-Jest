const Database = require("better-sqlite3");
const fs = require("node:fs");
const path = require("node:path");

const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

function createDatabase(
  filename = path.join(
    __dirname,
    "..",
    "data/db",
    `${process.env.DATABASE_NAME || "jest_test"}.db`,
  ),
) {
  if (filename !== ":memory:") {
    fs.mkdirSync(path.dirname(path.resolve(filename)), { recursive: true });
  }

  const db = new Database(filename);
  db.pragma("foreign_keys = ON");

  if (ENV === "development") {
    db.exec(`
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS albums;
      DROP TABLE IF EXISTS artists;
      DROP TABLE IF EXISTS users;
      `);
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS artists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS albums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist_id INTEGER NOT NULL,
      FOREIGN KEY (artist_id) REFERENCES artists(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      album_id INTEGER NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      FOREIGN KEY (album_id) REFERENCES albums(id)
    );
  `);

  return db;
}

module.exports = createDatabase;
