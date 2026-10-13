function clampRating(rating) {
  return Math.min(Math.max(rating, 1), 5);
}

module.exports = clampRating;