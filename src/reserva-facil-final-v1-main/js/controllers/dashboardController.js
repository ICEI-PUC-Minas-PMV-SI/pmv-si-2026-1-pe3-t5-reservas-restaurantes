const user = JSON.parse(localStorage.getItem("loggedUser"));

if (!user) {
  window.location.href = "../auth/login.html";
}

document.getElementById("userName").innerText = user.firstName;

// Redireciona conforme role
if (user.role === "admin") {
  window.location.href = "./admin.html";
} else {
  window.location.href = "./client.html";
}