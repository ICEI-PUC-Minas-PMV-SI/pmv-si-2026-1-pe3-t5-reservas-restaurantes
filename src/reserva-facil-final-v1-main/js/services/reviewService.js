const KEY = "reviews";

export function getReviews() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function saveReview(review) {
  const reviews = getReviews();
  reviews.push(review);
  localStorage.setItem(KEY, JSON.stringify(reviews));
}

export function getReviewsByUser(userId) {
  return getReviews().filter((review) => review.userId === userId);
}

export function getReviewsByRestaurant(restaurant) {
  return getReviews().filter((review) => review.restaurant === restaurant);
}