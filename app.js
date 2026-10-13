const express = require("express");

function createApp({ albumsService, reviewsService } = {}) {
  const app = express();

  app.get("/health", (req, res) => {
    const data = {
      uptime: process.uptime(),
      message: "Ok",
      date: new Date(),
    };

    res.status(200).send(data);
  });

  if (albumsService) {
    app.get("/albums", (req, res) => {
      res.status(200).json(albumsService.getAlbums());
    });

    app.get("/albums/:id", (req, res, next) => {
      try {
        res.status(200).json(albumsService.getAlbumById(req.params.id));
      } catch (error) {
        next(error);
      }
    });
  }

  if (reviewsService) {

    app.post("/reviews", express.json(), (req, res, next) => {
      try {
        const created = reviewsService.createReview(req.body);
        if (created) {
          res.status(201).json({ message: "Review created successfully" });
        } else {
          res.status(500).json({ error: "Failed to create review" });
        }
      } catch (error) {
        next(error);
      }
    });

    app.get("/reviews/:id", (req, res, next) => {
      try {
        res.status(200).json(reviewsService.getReviewById(req.params.id));
      } catch (error) {
        next(error);
      }
    });

    app.delete("/reviews/:id", (req, res, next) => {
      try {
        const deleted = reviewsService.deleteReviewById(req.params.id);
        if (deleted) {
          res.status(204).send();
        } else {
          res.status(404).json({ error: "Review not found" });
        }
      } catch (error) {
        next(error);
      }
    });
  }

  app.use((error, req, res, next) => {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    next(error);
  });

  return app;
}

module.exports = createApp;
