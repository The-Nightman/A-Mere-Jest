class ReviewsService {
  constructor(reviewsRepository) {
    this.reviewsRepository = reviewsRepository;
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
