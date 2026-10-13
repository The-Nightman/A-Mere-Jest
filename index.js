const app = require("./app.js");
const createDatabase = require("./data/database");
const seedDatabase = require("./data/seed.js");
const seed = require("./data/seed.json");

const ENV = process.env.NODE_ENV || "development";
const port = 8000;

const db = createDatabase();

if (ENV === "development") {
  seedDatabase(db, seed);
}

app.listen(port, () => {
  console.log("Listening on port " + port);
});
