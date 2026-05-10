import { getRestaurantById } from "../services/restaurantService.js";
import {
  saveReservation,
  getReservationByRestaurantDateTime,
  isPastReservationDateTime
} from "../services/reservationService.js";
import { getReviews, saveReview } from "../services/reviewService.js";
import { Review } from "../models/Review.js";
import { showToast } from "../utils/ui.js";

const user = JSON.parse(localStorage.getItem("loggedUser"));
const isLoggedClient = user && user.role === "client";

const params = new URLSearchParams(window.location.search);
const restaurantId = Number(params.get("id"));
const restaurant = getRestaurantById(restaurantId);

const app = document.getElementById("restaurantDetailsApp");

if (!app) {
  throw new Error("Elemento #restaurantDetailsApp não encontrado.");
}

if (!restaurant) {
  app.innerHTML = `<div class="empty-state">Restaurante não encontrado.</div>`;
} else {
  renderPage();
  bindEvents();
  renderDetailUserHeader();
}

function renderLoggedHeader() {
  return `
    <div class="client-navbar-actions client-navbar-actions-full">
      <button id="calendarReservationsBtn" class="notification-btn" type="button">
        <span class="nav-icon">📅</span>
        <span class="nav-text">Minhas reservas</span>
      </button>

      <button
        id="notificationBtn"
        class="notification-btn"
        type="button"
      >
        🔔 <span id="notificationCount">0</span>
      </button>

      <div class="profile-menu-wrapper">
        <button
          id="profileMenuBtn"
          class="profile-trigger"
          type="button"
        >
          <span id="userAvatarMini" class="profile-avatar-mini"></span>
          <span>Olá, <strong id="userName"></strong> ▾</span>
        </button>

        <div id="profileDropdown" class="profile-dropdown">
          <button id="openProfileEditBtn" type="button">
            Editar perfil
          </button>

          <a href="../pages/client.html#avaliacoes">
            Minhas avaliações
          </a>

          <button id="logoutBtn" type="button">
            Sair
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderPublicHeader() {
  return `
    <nav class="details-public-actions">
      <a href="../index.html" class="btn-secondary">Início</a>
      <a href="../auth/login.html" class="btn-secondary">Entrar</a>
      <a href="../auth/register.html" class="btn">Criar conta</a>
    </nav>
  `;
}

function renderPage() {
  const photos = [restaurant.dishImage, ...(restaurant.photos || [])].filter(Boolean);

  app.innerHTML = `
    <main class="restaurant-detail-page">
      <header class="client-public-topbar">
        <div class="details-navbar-container">
          <button
            class="brand brand-button"
            id="detailsGoHomeBtn"
            type="button"
          >
            <img
              src="../assets/img/logo-reserva-facil.png"
              alt="Reserva Fácil"
              class="system-logo"
            >
            <strong>Reserva Fácil</strong>
          </button>

          ${isLoggedClient ? renderLoggedHeader() : renderPublicHeader()}
        </div>
      </header>

      <section class="detail-hero">
        <img src="${restaurant.coverImage}" alt="${restaurant.name}">
      </section>

      <section class="detail-layout">
        <div class="detail-content">
          <h1>${restaurant.name}</h1>

          <p class="restaurant-meta">
            ⭐ ${restaurant.rating || "Novo"} • ${restaurant.priceRange} • ${restaurant.category}
          </p>

          <nav class="detail-tabs">
            <button data-target="overviewSection" class="active">Overview</button>
            <button data-target="experienceSection">Experiências</button>
            <button data-target="photosSection">Fotos</button>
            <button data-target="menuSection">Menu</button>
            <button data-target="reviewsSection">Avaliações</button>
          </nav>

          <section id="overviewSection" class="detail-section">
            <h2>Sobre este restaurante</h2>

            <div class="card-row">
              <span class="tag">${restaurant.category}</span>
              <span class="tag">${restaurant.city}</span>
              <span class="tag">${restaurant.priceRange}</span>
              <span class="tag">⭐ ${restaurant.rating || "Novo"}</span>
            </div>

            <p>${restaurant.description}</p>
          </section>

          <section id="experienceSection" class="detail-section">
            <h2>Experiências</h2>

            <div class="experience-card">
              <div>
                <h3>Experiência degustação especial</h3>
                <p>Uma experiência inspirada no melhor da casa, com foco em apresentação, sabor e um momento marcante para o cliente.</p>
                <span class="tag">Múltiplas datas disponíveis</span>
              </div>

              ${
                restaurant.dishImage
                  ? `<img src="${restaurant.dishImage}" alt="Experiência ${restaurant.name}">`
                  : ""
              }
            </div>
          </section>

          <section id="photosSection" class="detail-section">
            <h2>Fotos</h2>

            <div class="photo-gallery">
              ${
                photos.length
                  ? photos.slice(0, 4).map((photo) => `
                    <button class="photo-card" type="button" data-photo="${photo}">
                      <img src="${photo}" alt="Foto do restaurante">
                    </button>
                  `).join("")
                  : `<div class="empty-state">Nenhuma foto cadastrada.</div>`
              }
            </div>
          </section>

          <section id="menuSection" class="detail-section">
            <h2>Menu da casa</h2>
            <div class="card">
              <p>${restaurant.menu || "Menu não cadastrado."}</p>
            </div>
          </section>

          <section id="reviewsSection" class="detail-section">
            <h2>Avaliações</h2>

            <div id="reviewsContainer"></div>

            <h3 style="margin-top:28px;">Adicionar avaliação</h3>

            <form id="reviewForm" class="card">
              <input type="text" id="reviewRestaurantName" value="${restaurant.name}" readonly>

              <select id="reviewRating" required>
                <option value="">Selecione a nota</option>
                <option value="5">5 estrelas</option>
                <option value="4">4 estrelas</option>
                <option value="3">3 estrelas</option>
                <option value="2">2 estrelas</option>
                <option value="1">1 estrela</option>
              </select>

              <textarea id="reviewComment" rows="4" placeholder="Conte como foi sua experiência"></textarea>

              <button type="submit" class="btn">Enviar avaliação</button>
            </form>
          </section>
        </div>

        <aside class="reservation-sidebar">
          <h2>Fazer reserva</h2>

          <form id="detailReservationForm">
            <input type="number" id="detailPeople" min="1" value="2" required>
            <input type="date" id="detailDate" required>

            <div class="sidebar-divider"></div>

            <strong>Selecionar horário</strong>

            <div id="detailTimes" class="detail-times"></div>

            <input type="hidden" id="detailSelectedTime">

            <button type="submit" class="btn" style="width:100%; margin-top:20px;">
              ${isLoggedClient ? "Concluir reserva" : "Entrar para reservar"}
            </button>
          </form>
        </aside>
      </section>
    </main>
  `;

  setMinDate();
  renderTimes();
  renderReviews();
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const tab = event.target.closest(".detail-tabs button");

    if (tab) {
      const target = document.getElementById(tab.dataset.target);

      document.querySelectorAll(".detail-tabs button").forEach((item) => {
        item.classList.remove("active");
      });

      tab.classList.add("active");

      target?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    if (event.target.id === "calendarReservationsBtn" || event.target.closest("#calendarReservationsBtn")) {
      window.location.href = "./client.html#reservas";
    }

    if (event.target.id === "logoutBtn") {
      localStorage.removeItem("loggedUser");
      window.location.href = "../auth/login.html";
    }

    if (event.target.id === "detailsGoHomeBtn" || event.target.closest("#detailsGoHomeBtn")) {
      if (isLoggedClient) {
        window.location.href = "./client.html";
      } else {
        window.location.href = "./discover.html";
      }
    }

    if (event.target.id === "profileMenuBtn" || event.target.closest("#profileMenuBtn")) {
      document.getElementById("profileDropdown")?.classList.toggle("active");
    }

    if (event.target.classList.contains("detail-time-chip")) {
      document.querySelectorAll(".detail-time-chip").forEach((chip) => {
        chip.classList.remove("active");
      });

      event.target.classList.add("active");
      document.getElementById("detailSelectedTime").value = event.target.dataset.time;
    }

    if (event.target.id === "showMoreDetailTimes") {
      document.querySelectorAll(".hidden-detail-time").forEach((item) => {
        item.classList.toggle("show");
      });

      const hasHiddenTimes = document.querySelectorAll(".hidden-detail-time:not(.show)").length > 0;

      event.target.textContent = hasHiddenTimes
        ? "Ver mais horários"
        : "Ver menos horários";
    }

    if (event.target.closest(".photo-card")) {
      const photo = event.target.closest(".photo-card").dataset.photo;
      openImageModal(photo);
    }
  });

  document.addEventListener("input", handleDetailInputs);
  document.addEventListener("change", handleDetailInputs);

  document.addEventListener("submit", (event) => {
    if (event.target.id === "detailReservationForm") {
      event.preventDefault();
      createReservationFromDetails();
    }

    if (event.target.id === "reviewForm") {
      event.preventDefault();
      createReview();
    }
  });
}

function handleDetailInputs(event) {
  if (event.target.id === "detailDate" || event.target.id === "detailPeople") {
    document.getElementById("detailSelectedTime").value = "";
    renderTimes();
  }
}

function setMinDate() {
  const today = new Date().toISOString().split("T")[0];
  const dateInput = document.getElementById("detailDate");

  if (dateInput) {
    dateInput.min = today;
  }
}

function renderTimes() {
  const detailTimes = document.getElementById("detailTimes");
  const date = document.getElementById("detailDate")?.value;
  const people = Number(document.getElementById("detailPeople")?.value || 2);

  if (!detailTimes) return;

  const times = restaurant.availableTimes || [];

  detailTimes.innerHTML = times.map((time, index) => {
    const availableTable = date
      ? findAvailableTable(restaurant, date, time, people)
      : true;

    const disabled = date && !availableTable;
    const hidden = index >= 4;

    return `
      <button
        type="button"
        class="time-chip detail-time-chip ${hidden ? "hidden-detail-time" : ""} ${disabled ? "disabled" : ""}"
        data-time="${time}"
        ${disabled ? "disabled" : ""}
      >
        ${time}
      </button>
    `;
  }).join("");

  if (times.length > 4) {
    detailTimes.innerHTML += `
      <button type="button" id="showMoreDetailTimes" class="show-more-times-btn">
        Ver mais horários
      </button>
    `;
  }
}

function createReservationFromDetails() {
  const date = document.getElementById("detailDate").value;
  const people = Number(document.getElementById("detailPeople").value);
  const time = document.getElementById("detailSelectedTime").value;

  if (!isLoggedClient) {
    openLoginRequiredModal();
    return;
  }

  if (!date || !people || !time) {
    showToast("Selecione data, pessoas e horário.", "danger");
    return;
  }

  if (isPastReservationDateTime(date, time)) {
    showToast("Não é possível reservar para uma data ou horário que já passou.", "danger");
    return;
  }

  const table = findAvailableTable(restaurant, date, time, people);

  if (!table) {
    showToast("Nenhuma mesa disponível para esse horário.", "danger");
    return;
  }

  saveReservation({
    id: Date.now(),
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    userId: user.id,
    userName: `${user.firstName} ${user.lastName}`,
    userEmail: user.email,
    people,
    date,
    time,
    tableId: table.id,
    tableNumber: table.number,
    status: "pendente confirmação"
  });

  showToast("Reserva concluída com sucesso! Aguarde a confirmação do restaurante.", "success");

  showReservationSuccessModal();

  renderTimes();
}

function openLoginRequiredModal() {
  const oldModal = document.getElementById("loginRequiredModal");

  if (oldModal) {
    oldModal.remove();
  }

  const modal = document.createElement("div");
  modal.id = "loginRequiredModal";
  modal.className = "modal";
  modal.style.display = "flex";

  modal.innerHTML = `
    <div class="modal-content login-required-modal">
      <div class="login-required-icon">🔒</div>

      <h3>Entre para continuar</h3>

      <p>
        Para realizar uma reserva, você precisa acessar sua conta ou criar um cadastro gratuito.
      </p>

      <div class="modal-actions">
        <a href="../auth/login.html" class="btn">Fazer login</a>
        <a href="../auth/register.html" class="btn-secondary">Criar conta</a>
      </div>

      <button type="button" id="closeLoginRequiredModal" class="login-required-close">
        Agora não
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("closeLoginRequiredModal").addEventListener("click", () => {
    modal.remove();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  });
}

function showReservationSuccessModal() {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.style.display = "flex";

  modal.innerHTML = `
    <div class="modal-content success-reservation-modal">
      <div class="success-icon">✓</div>

      <h3>Reserva enviada!</h3>

      <p>
        Sua reserva foi concluída com sucesso e enviada para confirmação do restaurante.
      </p>

      <button type="button" class="btn" id="closeSuccessReservationModal">
        Entendi
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector("#closeSuccessReservationModal").addEventListener("click", () => {
    modal.remove();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  });
}

function createReview() {
  if (!isLoggedClient) {
    showToast("Faça login para avaliar.", "danger");
    return;
  }

  const rating = Number(document.getElementById("reviewRating").value);
  const comment = document.getElementById("reviewComment").value.trim();

  if (!rating) {
    showToast("Selecione uma nota.", "danger");
    return;
  }

  const review = new Review(
    user.id,
    `${user.firstName} ${user.lastName}`,
    restaurant.name,
    rating,
    comment
  );

  saveReview(review);

  document.getElementById("reviewForm").reset();
  document.getElementById("reviewRestaurantName").value = restaurant.name;

  renderReviews();

  showToast("Avaliação enviada com sucesso.", "success");
}

function renderReviews() {
  const container = document.getElementById("reviewsContainer");
  if (!container) return;

  const reviews = getReviews().filter(
    (review) => review.restaurant === restaurant.name
  );

  if (!reviews.length) {
    container.innerHTML = `
      <div class="empty-state">
        Ainda não há avaliações para este restaurante.
      </div>
    `;
    return;
  }

  container.innerHTML = reviews.map((review) => {
    const photo = getUserPhoto(review.userId);
    const initial = review.userName?.[0]?.toUpperCase() || "U";

    return `
      <div class="review-card">
        <div class="review-user-row">
          <span class="review-avatar">
            ${
              photo
                ? `<img src="${photo}" alt="Foto de ${review.userName}">`
                : initial
            }
          </span>

          <div>
            <strong>${review.userName}</strong>
            <div>${"⭐".repeat(review.rating)}</div>
          </div>
        </div>

        <p style="margin-top:12px;">${review.comment || "Sem comentário."}</p>
      </div>
    `;
  }).join("");
}

function renderDetailUserHeader() {
  if (!isLoggedClient) return;

  const userName = document.getElementById("userName");
  const avatar = document.getElementById("userAvatarMini");

  if (userName) {
    userName.textContent = user.firstName;
  }

  if (avatar) {
    if (user.photo) {
      avatar.innerHTML = `<img src="${user.photo}" alt="Foto de ${user.firstName}">`;
    } else {
      avatar.textContent = user.firstName?.[0]?.toUpperCase() || "U";
    }
  }
}

function openImageModal(photo) {
  const modal = document.createElement("div");
  modal.className = "image-preview-overlay";

  modal.innerHTML = `
    <div class="image-preview-box">
      <button class="close-preview" type="button">×</button>
      <img src="${photo}" alt="Foto ampliada">
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".close-preview").addEventListener("click", () => {
    modal.remove();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  });
}

function getUserPhoto(userId) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const foundUser = users.find((item) => Number(item.id) === Number(userId));

  return foundUser?.photo || "";
}

function findAvailableTable(restaurant, date, time, people) {
  const tables = (restaurant.tables || [])
    .filter((table) => Number(table.capacity) >= Number(people))
    .sort((a, b) => Number(a.capacity) - Number(b.capacity));

  const occupiedReservations = getReservationByRestaurantDateTime(
    restaurant.id,
    date,
    time
  );

  const occupiedTableIds = occupiedReservations.map((reservation) =>
    Number(reservation.tableId)
  );

  return tables.find((table) => !occupiedTableIds.includes(Number(table.id)));
}