class AlbumRepository {
  constructor(db) {
    this.db = db;
  }

  findById(id) {
    return this.db
      .prepare(
        `
      SELECT
        a.id,
        a.title,
        ar.name AS artist_name,
        COUNT(r.id) AS review_count,
        COALESCE(ROUND(AVG(r.rating), 1), 0) AS average_rating
      FROM albums AS a
      JOIN artists AS ar
        ON a.artist_id = ar.id
      LEFT JOIN reviews AS r
        ON r.album_id = a.id
      WHERE a.id = ?
      GROUP BY a.id, a.title, ar.name
    `,
      )
      .get(id);
  }

  findAll() {
    return this.db
      .prepare(
        `
      SELECT
        a.id,
        a.title,
        ar.name AS artist_name,
        COUNT(r.id) AS review_count,
        COALESCE(ROUND(AVG(r.rating), 1), 0) AS average_rating
      FROM albums AS a
      JOIN artists AS ar
        ON a.artist_id = ar.id
      LEFT JOIN reviews AS r
        ON r.album_id = a.id
      GROUP BY a.id, a.title, ar.name
    `,
      )
      .all();
  }
}

module.exports = AlbumRepository;
