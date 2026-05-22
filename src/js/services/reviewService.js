const KEY = "reviews";

export function getReviews() {
  const reviews = JSON.parse(localStorage.getItem(KEY)) || [];

  return removeDuplicatedReviews(reviews);
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

function removeDuplicatedReviews(reviews) {
  const seenKeys = new Set();

  return reviews.filter((review) => {
    const key = review.id
      ? String(review.id)
      : [
          review.userId,
          review.userName,
          review.restaurant,
          review.rating,
          review.comment,
          review.createdAt
        ].join("|");

    if (seenKeys.has(key)) {
      return false;
    }

    seenKeys.add(key);
    return true;
  });
}
