class ReviewsRepository {
  constructor(db) {
    this.db = db;
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

  deleteById(id) {
    const result = this.db.prepare("DELETE FROM reviews WHERE id = ?").run(id);
    return result.changes > 0;
  }
}

module.exports = ReviewsRepository;
