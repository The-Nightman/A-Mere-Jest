const fs = require("node:fs");
const path = require("node:path");
const createDatabase = require("./database");

function seedDatabase(db, seed) {
  const insert = db.transaction(() => {
    const artistIds = new Map();
    const albumIds = new Map();

    const insertArtist = db.prepare(
      "INSERT INTO artists (name) VALUES (?)",
    );
    const insertAlbum = db.prepare(
      "INSERT INTO albums (title, artist_id) VALUES (?, ?)",
    );
    const insertReview = db.prepare(
      "INSERT INTO reviews (album_id, rating, comment) VALUES (?, ?, ?)",
    );

    for (const artist of seed.artists || []) {
      const result = insertArtist.run(artist.name);
      artistIds.set(artist.name, Number(result.lastInsertRowid));
    }

    for (const album of seed.albums || []) {
      const artistId = artistIds.get(album.artist);

      if (!artistId) {
        throw new Error(`Artist not found for album "${album.title}"`);
      }

      const result = insertAlbum.run(album.title, artistId);
      albumIds.set(album.title, Number(result.lastInsertRowid));
    }

    for (const review of seed.reviews || []) {
      const albumId = albumIds.get(review.album);

      if (!albumId) {
        throw new Error(`Album not found for review "${review.album}"`);
      }

      insertReview.run(albumId, review.rating, review.comment ?? null);
    }
  });

  insert();
}

if (require.main === module) {
  const seedPath = process.argv[2] || path.join(__dirname, "seed.json");
  const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
  const db = createDatabase();

  try {
    seedDatabase(db, seed);
    console.log(`Seeded database from ${seedPath}`);
  } finally {
    db.close();
  }
}

module.exports = seedDatabase;