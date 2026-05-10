import { getRestaurants } from "../services/restaurantService.js";
import { getReservationByRestaurantDateTime } from "../services/reservationService.js";

const params = new URLSearchParams(window.location.search);

const searchLocation = document.getElementById("searchLocation");
const searchDate = document.getElementById("searchDate");
const searchTime = document.getElementById("searchTime");
const searchPeople = document.getElementById("searchPeople");
const searchAgainBtn = document.getElementById("searchAgainBtn");
const publicRestaurantList = document.getElementById("publicRestaurantList");

const authRequiredModal = document.getElementById("authRequiredModal");
const closeAuthRequiredModal = document.getElementById("closeAuthRequiredModal");

init();

function init() {
  fillInputs();
  setMinDate();
  renderRestaurants();
  bindEvents();
}

function fillInputs() {
  searchLocation.value = "";
  searchDate.value = params.get("date") || "";
  searchTime.value = params.get("time") || "";
  searchPeople.value = params.get("people") || "";
}

function setMinDate() {
  const today = new Date().toISOString().split("T")[0];
  searchDate.min = today;
}

function bindEvents() {
  searchAgainBtn.addEventListener("click", renderRestaurants);

  document.addEventListener("click", (event) => {
    const reserveButton = event.target.closest(".btn-auth-required");

    if (reserveButton) {
      openAuthRequiredModal();
    }
  });

  if (closeAuthRequiredModal) {
    closeAuthRequiredModal.addEventListener("click", closeAuthModal);
  }

  if (authRequiredModal) {
    authRequiredModal.addEventListener("click", (event) => {
      if (event.target === authRequiredModal) {
        closeAuthModal();
      }
    });
  }
}

function openAuthRequiredModal() {
  if (authRequiredModal) {
    authRequiredModal.style.display = "flex";
  }
}

function closeAuthModal() {
  if (authRequiredModal) {
    authRequiredModal.style.display = "none";
  }
}

function getFreeTablesCount(restaurant, people, date, time) {
  if (!people || !date || !time) return null;

  const tables = (restaurant.tables || []).filter(
    table => Number(table.capacity) >= Number(people)
  );

  if (!tables.length) return 0;

  const reservations = getReservationByRestaurantDateTime(
    restaurant.id,
    date,
    time
  );

  const reservedIds = reservations.map(r => r.tableId);

  const free = tables.filter(
    table => !reservedIds.includes(table.id)
  );

  return free.length;
}

function renderRestaurants() {
  const location = searchLocation.value.toLowerCase().trim();
  const date = searchDate.value;
  const time = searchTime.value;
  const people = searchPeople.value;

  let restaurants = getRestaurants();

  if (location) {
    restaurants = restaurants.filter(r =>
      (r.name || "").toLowerCase().includes(location) ||
      (r.category || "").toLowerCase().includes(location) ||
      (r.city || "").toLowerCase().includes(location)
    );
  }

  if (date && time && people) {
    restaurants = restaurants.filter(r =>
      getFreeTablesCount(r, people, date, time) > 0
    );
  }

  publicRestaurantList.innerHTML = "";

  if (!restaurants.length) {
    publicRestaurantList.innerHTML = `
      <div class="card">
        <div class="empty-state">
          Nenhum restaurante encontrado.
        </div>
      </div>
    `;
    return;
  }

  restaurants.forEach(restaurant => {
    const availableTimes = restaurant.availableTimes || [];
    const visibleTimes = availableTimes.slice(0, 4);
    const hasMoreTimes = availableTimes.length > 4;

    const card = document.createElement("div");
    card.className = "client-restaurant-card";

    card.innerHTML = `
      <img
        src="${restaurant.coverImage}"
        alt="${restaurant.name}"
        class="client-restaurant-image"
      >

      <div class="client-restaurant-content">
        <h3>${restaurant.name}</h3>

        <p class="restaurant-meta">
          ⭐ Novo • ${restaurant.priceRange || "$$$"} •
          ${restaurant.category || "Restaurante"} •
          ${restaurant.city || "Belo Horizonte - MG"}
        </p>

        <strong class="small-label">Horários disponíveis</strong>

        <div class="card-row">
          ${
            visibleTimes.length
              ? `
                ${visibleTimes.map(t => `
                  <span class="time-chip">${t}</span>
                `).join("")}

                ${
                  hasMoreTimes
                    ? `<span class="time-chip more-time-chip">+ horários</span>`
                    : ""
                }
              `
              : `<span class="tag">Sem horários</span>`
          }
        </div>

        <div class="card-row" style="margin-top:18px;">
          <a
            href="./restaurant-details.html?id=${restaurant.id}"
            class="btn"
          >
            Ver detalhes
          </a>

          <button class="btn-secondary btn-auth-required" type="button">
            Reservar
          </button>
        </div>
      </div>
    `;

    publicRestaurantList.appendChild(card);
  });
}