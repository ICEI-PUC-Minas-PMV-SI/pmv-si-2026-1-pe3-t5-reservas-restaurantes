export function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

export function validateAge(age) {
  return age >= 18;
}

export function validatePassword(password) {
  return password.length >= 6;
}