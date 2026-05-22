import { saveReview } from "../services/reviewService.js";
import { Review } from "../models/Review.js";
import { showToast } from "../utils/ui.js";

const user = JSON.parse(localStorage.getItem("loggedUser"));

const notificationBtn = document.getElementById("notificationBtn");
const notificationCount = document.getElementById("notificationCount");

createNotificationDropdown();
createReviewModal();
renderNotifications();

function getNotifications() {
  return JSON.parse(localStorage.getItem("notifications")) || [];
}

function saveNotifications(notifications) {
  localStorage.setItem("notifications", JSON.stringify(notifications));
}

function getUserNotifications() {
  if (!user) return [];

  return getNotifications()
    .filter((notification) => Number(notification.userId) === Number(user.id))
    .sort((a, b) => b.id - a.id);
}

function createNotificationDropdown() {
  if (!notificationBtn) return;
  if (document.getElementById("notificationDropdown")) return;

  const wrapper = notificationBtn.parentElement;

  const dropdown = document.createElement("div");
  dropdown.id = "notificationDropdown";
  dropdown.className = "notification-dropdown";

  wrapper.appendChild(dropdown);
}

function createReviewModal() {
  if (document.getElementById("notificationReviewModal")) return;

  const modal = document.createElement("div");
  modal.id = "notificationReviewModal";
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal-content">
      <h3>Avaliar restaurante</h3>

      <form id="notificationReviewForm">
        <input type="hidden" id="reviewRestaurantId">
        <input type="text" id="reviewRestaurantName" readonly>

        <select id="reviewRating" required>
          <option value="">Selecione a nota</option>
          <option value="5">5 estrelas</option>
          <option value="4">4 estrelas</option>
          <option value="3">3 estrelas</option>
          <option value="2">2 estrelas</option>
          <option value="1">1 estrela</option>
        </select>

        <textarea
          id="reviewComment"
          placeholder="Conte como foi sua experiência"
          rows="4"
        ></textarea>

        <div class="modal-actions">
          <button type="submit" class="btn">Enviar avaliação</button>
          <button type="button" id="closeNotificationReviewModal" class="btn-secondary">Fechar</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("closeNotificationReviewModal").addEventListener("click", () => {
    modal.style.display = "none";
  });

  document.getElementById("notificationReviewForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const restaurantName = document.getElementById("reviewRestaurantName").value;
    const rating = Number(document.getElementById("reviewRating").value);
    const comment = document.getElementById("reviewComment").value.trim();

    if (!rating) {
      showToast("Selecione uma nota.", "danger");
      return;
    }

    const review = new Review(
      user.id,
      `${user.firstName} ${user.lastName}`,
      restaurantName,
      rating,
      comment
    );

    saveReview(review);

    modal.style.display = "none";
    e.target.reset();

    showToast("Avaliação enviada com sucesso.", "success");
  });
}

function renderNotifications() {
  const dropdown = document.getElementById("notificationDropdown");
  if (!dropdown || !notificationCount) return;

  const notifications = getUserNotifications();
  const unread = notifications.filter((item) => !item.read);

  notificationCount.textContent = unread.length;

  if (!notifications.length) {
    dropdown.innerHTML = `<p class="muted-text notification-empty">Nenhuma notificação.</p>`;
    return;
  }

  dropdown.innerHTML = notifications.map((notification) => `
    <div class="notification-item ${notification.read ? "" : "unread"}">
      <strong>${notification.title}</strong>
      <p>${notification.message}</p>

      <div class="card-row">
        ${
          notification.type === "review"
            ? `
              <button
                class="btn btn-review-notification"
                data-id="${notification.id}"
                data-restaurant-name="${notification.restaurantName}"
              >
                Avaliar
              </button>
            `
            : ""
        }

        <button class="btn-secondary btn-read-notification" data-id="${notification.id}">
          Marcar como lida
        </button>
      </div>
    </div>
  `).join("");

  bindNotificationEvents();
}

function markAsRead(id) {
  const updated = getNotifications().map((notification) => {
    if (Number(notification.id) !== Number(id)) return notification;
    return { ...notification, read: true };
  });

  saveNotifications(updated);
  renderNotifications();
}

function bindNotificationEvents() {
  document.querySelectorAll(".btn-read-notification").forEach((button) => {
    button.addEventListener("click", () => {
      markAsRead(button.dataset.id);
    });
  });

  document.querySelectorAll(".btn-review-notification").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);

      document.getElementById("reviewRestaurantName").value = button.dataset.restaurantName;
      document.getElementById("notificationReviewModal").style.display = "flex";

      markAsRead(id);
    });
  });
}

if (notificationBtn) {
  notificationBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("notificationDropdown")?.classList.toggle("active");
  });
}

document.addEventListener("click", () => {
  document.getElementById("notificationDropdown")?.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target.closest("#notificationDropdown")) {
    e.stopPropagation();
  }
});