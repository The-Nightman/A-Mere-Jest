const express = require("express");

function createApp({ albumsService } = {}) {
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

  app.use((error, req, res, next) => {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    next(error);
  });

  return app;
}

module.exports = createApp;
