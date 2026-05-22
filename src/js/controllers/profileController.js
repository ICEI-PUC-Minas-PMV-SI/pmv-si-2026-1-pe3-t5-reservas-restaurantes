import {
  getLoggedUser,
  updateUserProfile
} from "../services/profileService.js";

const profileModal = document.getElementById("profileModal");
const openProfileEditBtn = document.getElementById("openProfileEditBtn");
const closeProfileModal = document.getElementById("closeProfileModal");
const profileForm = document.getElementById("profileForm");

const profileFirstName = document.getElementById("profileFirstName");
const profileLastName = document.getElementById("profileLastName");
const profileEmail = document.getElementById("profileEmail");
const profileAge = document.getElementById("profileAge");
const profilePhone = document.getElementById("profilePhone");
const profilePhoto = document.getElementById("profilePhoto");

const userName = document.getElementById("userName");
const userAvatarMini = document.getElementById("userAvatarMini");

renderNavbar();

openProfileEditBtn?.addEventListener("click", openModal);
closeProfileModal?.addEventListener("click", closeModal);

profileForm?.addEventListener("submit", saveProfile);

function openModal() {
  const user = getLoggedUser();

  profileFirstName.value = user.firstName;
  profileLastName.value = user.lastName;
  profileEmail.value = user.email;
  profileAge.value = user.age;
  profilePhone.value = user.phone || "";
  profilePhoto.value = user.photo || "";

  profileModal.style.display = "flex";
}

function closeModal() {
  profileModal.style.display = "none";
}

function saveProfile(e) {
  e.preventDefault();

  const updated = updateUserProfile({
    phone: profilePhone.value.trim(),
    photo: profilePhoto.value.trim()
  });

  renderNavbar();
  closeModal();
}

function renderNavbar() {
  const user = getLoggedUser();

  if (!user) return;

  userName.textContent = user.firstName;

  if (user.photo) {
    userAvatarMini.innerHTML =
      `<img src="${user.photo}" alt="avatar">`;
  } else {
    userAvatarMini.textContent =
      user.firstName[0].toUpperCase();
  }
}