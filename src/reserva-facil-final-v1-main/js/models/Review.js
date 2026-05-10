export class Review {
  constructor(userId, userName, restaurant, rating, comment) {
    this.id = Date.now();
    this.userId = userId;
    this.userName = userName;
    this.restaurant = restaurant;
    this.rating = Number(rating);
    this.comment = comment.trim();
    this.createdAt = new Date().toISOString();
  }
}