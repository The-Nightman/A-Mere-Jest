class AlbumsService {
  constructor(albumRepository, reviewsRepository) {
    this.albumRepository = albumRepository;
    this.reviewsRepository = reviewsRepository;
  }

  getAlbums() {
    return this.albumRepository.findAll();
  }

  getAlbumById(id) {
    const album = this.albumRepository.findById(id);
    const reviews = this.reviewsRepository.findByAlbumId(id);

    if (!album) {
      const error = new Error(`Album with id ${id} was not found`);
      error.statusCode = 404;
      throw error;
    }

    return { ...album, reviews: reviews || [] };
  }
}

module.exports = AlbumsService;
