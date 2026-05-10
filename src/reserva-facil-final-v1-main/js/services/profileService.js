const USERS_KEY = "users";
const LOGGED_USER_KEY = "loggedUser";

export function getAllUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

export function saveAllUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getLoggedUser() {
  return JSON.parse(localStorage.getItem(LOGGED_USER_KEY));
}

export function saveLoggedUser(user) {
  localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(user));
}

export function updateUserProfile(data) {
  const users = getAllUsers();
  const logged = getLoggedUser();

  if (!logged) return null;

  const updatedUsers = users.map((user) => {
    if (user.id !== logged.id) return user;

    return {
      ...user,
      phone: data.phone,
      photo: data.photo
    };
  });

  saveAllUsers(updatedUsers);

  const updatedLogged = updatedUsers.find(
    (user) => user.id === logged.id
  );

  if (!updatedLogged) return null;

  saveLoggedUser(updatedLogged);

  return updatedLogged;
}