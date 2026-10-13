class ReviewsRepository {
  constructor(db) {
    this.db = db;
  }

  create(review) {
    const result = this.db
      .prepare(
        `
      INSERT INTO reviews (album_id, user_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `,
      )
      .run(review.album_id, review.user_id, review.rating, review.comment);
    return result.changes > 0;
  }

  findById(id) {
    return this.db
      .prepare(
        `
      SELECT
        r.id,
        r.album_id,
        r.user_id,
        r.rating,
        r.comment,
        u.name AS user_name,
        a.title AS album_title,
        ar.name AS artist_name
      FROM reviews AS r
      JOIN users AS u
        ON r.user_id = u.id
      JOIN albums AS a
        ON r.album_id = a.id
      JOIN artists AS ar
        ON a.artist_id = ar.id
      WHERE r.id = ?
    `,
      )
      .get(id);
  }

  findByAlbumId(albumId) {
    return this.db
      .prepare(
        `
      SELECT
        r.id,
        r.user_id,
        r.rating,
        r.comment,
        u.name AS user_name
      FROM reviews AS r
      JOIN users AS u
        ON r.user_id = u.id
      WHERE r.album_id = ?
    `,
      )
      .all(albumId);
  }

  deleteById(id) {
    const result = this.db.prepare("DELETE FROM reviews WHERE id = ?").run(id);
    return result.changes > 0;
  }
}

module.exports = ReviewsRepository;
