# A-Mere-Jest

A small Node.js and Express API for albums and reviews. The project demonstrates
dependency injection, service/repository separation, SQLite persistence, and
automated testing with Jest and Supertest.

## Requirements

- Node.js 22 or newer
- npm

`better-sqlite3@13` requires Node.js 22 or newer.

## Installation

Clone the repository and install its dependencies:

```powershell
npm install
```

Create a development environment file if you do not already have one:

```powershell
Copy-Item .env.example .env.development
```

The example configuration uses:

```env
DATABASE_NAME=jest_test
```

The SQLite database is created in `data/db/<DATABASE_NAME>.db`.

## Running the API

Start the development server:

```powershell
npm run dev
```

The API listens on:

```text
http://localhost:8000
```

In development mode, the database is recreated and seeded from
`data/seed.json` when the application starts.

To seed the configured database manually:

```powershell
npm run seed
```

## API endpoints

### Health check

```http
GET /health
```

Example response:

```json
{
  "uptime": 12.34,
  "message": "Ok",
  "date": "2026-10-13T21:00:00.000Z"
}
```

### List albums

```http
GET /albums
```

Each album includes its artist, review count, and average rating.

### Get an album

```http
GET /albums/:id
```

An individual album includes its review summary and reviews.

Example:

```http
GET /albums/1
```

### Create a review

```http
POST /reviews
Content-Type: application/json
```

Request body:

```json
{
  "album_id": 1,
  "user_id": 1,
  "rating": 5,
  "comment": "A great album."
}
```

Successful creation returns `201 Created`:

```json
{
  "message": "Review created successfully"
}
```

Ratings are clamped to the range `1` through `5` by the reviews service.

### Get a review

```http
GET /reviews/:id
```

Example:

```http
GET /reviews/1
```

### Delete a review

```http
DELETE /reviews/:id
```

Successful deletion returns `204 No Content`.

## Testing

Run the Jest test suite:

```powershell
npm test
```

Run tests serially:

```powershell
npm test -- --runInBand
```

Generate a coverage report:

```powershell
npm test -- --coverage
```

Integration tests use an in-memory SQLite database, so they do not modify the
development database.

## Project structure

```text
.
├── app.js                         # Express application and routes
├── index.js                       # Database, repository, service, and server wiring
├── data/
│   ├── database.js                # SQLite connection and schema
│   ├── seed.js                    # Database seeding
│   └── seed.json                  # Seed data
├── repositories/
│   ├── albums.repository.js       # Album SQL queries
│   └── reviews.repository.js      # Review SQL queries
├── services/
│   ├── albums.service.js          # Album business logic
│   └── reviews.service.js         # Review business logic
├── utils/
│   └── utils.js                   # Shared utility functions
└── __tests__/
    ├── integration/               # API and database integration tests
    └── unit/                      # Unit tests
```

The application follows this dependency flow:

```text
API → Service → Repository → SQLite database
```

Repositories handle persistence and SQL. Services contain business logic and
coordinate repositories. The Express application handles HTTP requests and
responses.