const profileMenuBtn = document.getElementById("profileMenuBtn");
const profileDropdown = document.getElementById("profileDropdown");

if (profileMenuBtn && profileDropdown) {
  profileMenuBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    profileDropdown.classList.toggle("active");
  });

  profileDropdown.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    profileDropdown.classList.remove("active");
  });
}