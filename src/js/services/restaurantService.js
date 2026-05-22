const KEY = "restaurants";

export function getRestaurants() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function saveRestaurants(restaurants) {
  localStorage.setItem(KEY, JSON.stringify(restaurants));
}

export function saveRestaurant(restaurant) {
  const restaurants = getRestaurants();
  restaurants.push(restaurant);
  saveRestaurants(restaurants);
}

export function updateRestaurant(updatedRestaurant) {
  const restaurants = getRestaurants().map((restaurant) =>
    restaurant.id === updatedRestaurant.id ? updatedRestaurant : restaurant
  );

  saveRestaurants(restaurants);
}

export function deleteRestaurant(id) {
  const restaurants = getRestaurants().filter((restaurant) => restaurant.id !== id);
  saveRestaurants(restaurants);
}

export function getRestaurantById(id) {
  return getRestaurants().find((restaurant) => restaurant.id === id);
}

export function getRestaurantsByOwner(ownerId) {
  return getRestaurants().filter((restaurant) => restaurant.ownerId === ownerId);
}