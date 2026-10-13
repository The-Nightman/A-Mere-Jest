class AlbumsService {
  constructor(albumRepository) {
    this.albumRepository = albumRepository;
  }

  getAlbums() {
    return this.albumRepository.findAll();
  }

  getAlbumById(id) {
    const album = this.albumRepository.findById(id);

    if (!album) {
      const error = new Error(`Album with id ${id} was not found`);
      error.statusCode = 404;
      throw error;
    }

    return album;
  }
}

module.exports = AlbumsService;
