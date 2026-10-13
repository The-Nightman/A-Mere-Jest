const clampRating = require("../utils/utils.js");

class ReviewsService {
  constructor(reviewsRepository) {
    this.reviewsRepository = reviewsRepository;
  }

  createReview(review) {
    const validatedReview = { ...review, rating: clampRating(parseInt(review.rating, 10)) };

    const created = this.reviewsRepository.create(validatedReview);
    if (!created) {
      const error = new Error("Failed to create review");
      error.statusCode = 500;
      throw error;
    }
    return created;
  }

  getReviewById(id) {
    const review = this.reviewsRepository.findById(id);

    if (!review) {
      const error = new Error(`Review with id ${id} was not found`);
      error.statusCode = 404;
      throw error;
    }

    return review;
  }

  getReviewsByAlbumId(albumId) {
    const reviews = this.reviewsRepository.findByAlbumId(albumId);
    if (!reviews) {
      const error = new Error(`Reviews for album with id ${albumId} were not found`);
      error.statusCode = 404;
      throw error;
    }
    return reviews;
  }

  deleteReviewById(id) {
    const deleted = this.reviewsRepository.deleteById(id);

    if (!deleted) {
      const error = new Error(`Review with id ${id} was not found`);
      error.statusCode = 404;
      throw error;
    }
    return deleted;
  }
}

module.exports = ReviewsService;
