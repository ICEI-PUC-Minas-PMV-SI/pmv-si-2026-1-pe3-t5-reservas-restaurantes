const USERS_KEY = "users";

export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

export function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}