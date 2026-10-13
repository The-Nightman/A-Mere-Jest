const request = require("supertest");
const createApp = require("../../app");
const createDatabase = require("../../data/database");
const seedDatabase = require("../../data/seed");
const seed = require("../../data/seed.json");
const AlbumRepository = require("../../repositories/albums.repository");
const ReviewsRepository = require("../../repositories/reviews.repository");
const AlbumsService = require("../../services/albums.service");
const ReviewsService = require("../../services/reviews.service");

describe("API integration", () => {
  let db;
  let app;

  beforeEach(() => {
    db = createDatabase(":memory:");
    seedDatabase(db, seed);

    const albumRepository = new AlbumRepository(db);
    const reviewsRepository = new ReviewsRepository(db);

    app = createApp({
      albumsService: new AlbumsService(albumRepository),
      reviewsService: new ReviewsService(reviewsRepository),
    });
  });

  afterEach(() => {
    db.close();
  });

  describe("health endpoint", () => {
    test("returns a health response", async () => {
      const response = await request(app).get("/health");

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Ok");
      expect(response.body.uptime).toEqual(expect.any(Number));
      expect(Number.isNaN(new Date(response.body.date).getTime())).toBe(false);
    });
  });

  describe("album endpoints", () => {
    test("returns albums with their review averages", async () => {
      const response = await request(app).get("/albums");

      expect(response.statusCode).toBe(200);
      expect(response.body[0]).toMatchObject({
        id: 1,
        title: "Dirt (2022 Remaster)",
        artist_name: "Alice In Chains",
        review_count: 3,
        average_rating: 3.3,
      });
    });

    test("returns one album by id", async () => {
      const response = await request(app).get("/albums/1");

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        title: "Dirt (2022 Remaster)",
        average_rating: 3.3,
      });
    });

    test("returns 404 when an album does not exist", async () => {
      const response = await request(app).get("/albums/999");

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("Album with id 999 was not found");
    });
  });

  describe("review endpoints", () => {
    test("creates a review and clamps its rating", async () => {
      const createResponse = await request(app)
        .post("/reviews")
        .send({
          album_id: 1,
          user_id: 1,
          rating: 10,
          comment: "Excellent album.",
        });

      expect(createResponse.statusCode).toBe(201);
      expect(createResponse.body).toEqual({
        message: "Review created successfully",
      });

      const review = db
        .prepare("SELECT rating, comment FROM reviews ORDER BY id DESC LIMIT 1")
        .get();

      expect(review).toEqual({
        rating: 5,
        comment: "Excellent album.",
      });
    });

    test("returns a review by id", async () => {
      const response = await request(app).get("/reviews/1");

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        album_id: 1,
        user_id: 1,
        rating: 5,
        album_title: "Dirt (2022 Remaster)",
      });
    });

    test("deletes a review", async () => {
      const deleteResponse = await request(app).delete("/reviews/1");

      expect(deleteResponse.statusCode).toBe(204);
      expect(deleteResponse.body).toEqual({});

      const getResponse = await request(app).get("/reviews/1");
      expect(getResponse.statusCode).toBe(404);
    });

    test("returns 404 when a review does not exist", async () => {
      const response = await request(app).get("/reviews/999");

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("Review with id 999 was not found");
    });
  });
});
