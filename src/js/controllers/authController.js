import "../services/seedService.js";
import { User } from "../models/User.js";
import { register, login } from "../services/authService.js";
import { validateEmail, validateAge, validatePassword } from "../utils/validators.js";

let selectedRole = "client";

document.querySelectorAll(".role-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".role-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedRole = btn.dataset.role;
  });
});

// REGISTER
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const age = parseInt(document.getElementById("age").value);
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!validateEmail(email)) return alert("Email inválido");
    if (!validateAge(age)) return alert("Você deve ter mais de 18 anos");
    if (!validatePassword(password)) return alert("Senha mínima de 6 caracteres");

    const user = new User(firstName, lastName, age, email, password, selectedRole);

    const result = register(user);

    if (result.error) return alert(result.error);

    alert("Cadastro realizado com sucesso!");
    window.location.href = "./login.html";
  });
}

// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user = login(email, password);

    if (!user) return alert("Credenciais inválidas");

    localStorage.setItem("loggedUser", JSON.stringify(user));

    if (user.role === "admin") {
      window.location.href = "../pages/admin.html";
    } else {
      window.location.href = "../pages/client.html";
    }
  });
}
