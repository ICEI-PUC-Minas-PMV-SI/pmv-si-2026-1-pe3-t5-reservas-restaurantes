import { getUsers, saveUser } from "./storageService.js";

export function register(user) {
  const users = getUsers();

  const exists = users.find(u => u.email === user.email);
  if (exists) return { error: "Usuário já existe" };

  saveUser(user);
  return { success: true };
}

export function login(email, password) {
  const users = getUsers();

  return users.find(
    u => u.email === email && u.password === password
  );
}