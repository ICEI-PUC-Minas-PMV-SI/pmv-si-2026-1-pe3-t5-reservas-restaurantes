export function isUserLogged() {
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  return Boolean(user && user.role === "client");
}

export function openLoginModal() {
  const modal = document.getElementById("loginRequiredModal");

  if (modal) {
    modal.style.display = "flex";
  }
}

export function closeLoginModal() {
  const modal = document.getElementById("loginRequiredModal");

  if (modal) {
    modal.style.display = "none";
  }
}

export function initLoginModalEvents() {
  document.addEventListener("click", (event) => {
    const modal = document.getElementById("loginRequiredModal");

    if (!modal) return;

    if (event.target.id === "closeLoginModal" || event.target === modal) {
      closeLoginModal();
    }
  });
}