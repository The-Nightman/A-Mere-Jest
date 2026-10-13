const createApp = require("./app.js");
const createDatabase = require("./data/database");
const seedDatabase = require("./data/seed.js");
const seed = require("./data/seed.json");
const AlbumRepository = require("./repositories/albums.repository");
const ReviewsRepository = require("./repositories/reviews.repository");
const AlbumsService = require("./services/albums.service");
const ReviewsService = require("./services/reviews.service");

const ENV = process.env.NODE_ENV || "development";
const port = 8000;

const db = createDatabase();

if (ENV === "development") {
  seedDatabase(db, seed);
}

const albumRepository = new AlbumRepository(db);
const reviewsRepository = new ReviewsRepository(db);
const albumsService = new AlbumsService(albumRepository);
const reviewsService = new ReviewsService(reviewsRepository);

const app = createApp({ albumsService, reviewsService });

app.listen(port, () => {
  console.log("Listening on port " + port);
});
