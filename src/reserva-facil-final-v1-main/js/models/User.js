export class User {
  constructor(firstName, lastName, age, email, password, role, phone = "", photo = "") {
    this.id = Date.now();
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.email = email;
    this.password = password;
    this.role = role;
    this.phone = phone;
    this.photo = photo;
  }
}