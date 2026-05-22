import "../services/seedService.js";
import { getRestaurants } from "../services/restaurantService.js";
import { getReservationByRestaurantDateTime } from "../services/reservationService.js";

const params = new URLSearchParams(window.location.search);

const searchLocation = document.getElementById("searchLocation");
const searchDate = document.getElementById("searchDate");
const searchTime = document.getElementById("searchTime");
const searchPeople = document.getElementById("searchPeople");
const searchCategory = document.getElementById("searchCategory");
const searchPrice = document.getElementById("searchPrice");
const searchAgainBtn = document.getElementById("searchAgainBtn");
const publicRestaurantList = document.getElementById("publicRestaurantList");
const filterChips = document.querySelectorAll(".filter-chip");

const authRequiredModal = document.getElementById("authRequiredModal");
const closeAuthRequiredModal = document.getElementById("closeAuthRequiredModal");
const TIME_OPTIONS = buildTimeOptions();

init();

/**
 * Initializes the public discover page.
 *
 * @returns {void}
 */
function init() {
  bindTimeSelects(document);
  fillInputs();
  setMinDate();
  renderRestaurants();
  bindEvents();
}

/**
 * Fills search fields using URL parameters from the home page.
 *
 * @returns {void}
 */
function fillInputs() {
  searchLocation.value = params.get("location") || "";
  searchDate.value = params.get("date") || "";
  searchTime.value = params.get("time") || "";
  searchPeople.value = params.get("people") || "";
}

/**
 * Prevents searching for dates before today.
 *
 * @returns {void}
 */
function setMinDate() {
  const today = new Date().toISOString().split("T")[0];
  searchDate.min = today;
}

/**
 * Binds search, filter and modal interactions.
 *
 * @returns {void}
 */
function bindEvents() {
  searchAgainBtn.addEventListener("click", renderRestaurants);

  [searchLocation, searchDate, searchTime, searchPeople, searchCategory].forEach((input) => {
    input?.addEventListener("input", renderRestaurants);
    input?.addEventListener("change", renderRestaurants);
  });

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

  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      if (chip.dataset.clearFilters !== undefined) {
        clearFilters();
        return;
      }

      if (chip.dataset.price !== undefined) {
        searchPrice.value = chip.dataset.price;

        document.querySelectorAll("[data-price]").forEach((item) => {
          item.classList.remove("active");
        });

        chip.classList.add("active");
      }

      renderRestaurants();
    });
  });
}

/**
 * Clears all public discover filters.
 *
 * @returns {void}
 */
function clearFilters() {
  searchLocation.value = "";
  searchDate.value = "";
  searchTime.value = "";
  searchPeople.value = "";
  searchCategory.value = "";
  searchPrice.value = "";

  filterChips.forEach((chip) => chip.classList.remove("active"));

  renderRestaurants();
}

/**
 * Opens the authentication required modal.
 *
 * @returns {void}
 */
function openAuthRequiredModal() {
  if (authRequiredModal) {
    authRequiredModal.style.display = "flex";
  }
}

/**
 * Closes the authentication required modal.
 *
 * @returns {void}
 */
function closeAuthModal() {
  if (authRequiredModal) {
    authRequiredModal.style.display = "none";
  }
}

/**
 * Counts available tables for a date, time and party size.
 *
 * @param {Object} restaurant - Restaurant data.
 * @param {number|string} people - Number of people in the reservation.
 * @param {string} date - Reservation date.
 * @param {string} time - Reservation time.
 * @returns {number|null} Number of free tables, or null when availability filters are incomplete.
 */
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

/**
 * Renders public restaurant cards based on active filters.
 *
 * @returns {void}
 */
function renderRestaurants() {
  const location = normalize(searchLocation.value);
  const date = searchDate.value;
  const time = searchTime.value;
  const people = searchPeople.value;
  const category = normalize(searchCategory.value);
  const price = searchPrice.value;

  let restaurants = getRestaurants();

  if (location) {
    restaurants = restaurants.filter(r =>
      normalize(r.name).includes(location) ||
      normalize(r.category).includes(location) ||
      normalize(r.city).includes(location)
    );
  }

  if (category) {
    restaurants = restaurants.filter(r =>
      normalize(r.category).includes(category)
    );
  }

  if (price) {
    restaurants = restaurants.filter(r => r.priceRange === price);
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
      <div class="client-restaurant-image-wrap">
        <img
          src="${restaurant.coverImage}"
          alt="${restaurant.name}"
          class="client-restaurant-image"
        >
        <span class="client-restaurant-badge">${restaurant.priceRange || "Novo"}</span>
      </div>

      <div class="client-restaurant-content">
        <div class="client-restaurant-heading">
          <div>
            <h3>${restaurant.name}</h3>
            <p>${restaurant.category || "Restaurante"} • ${restaurant.city || "Belo Horizonte"}</p>
          </div>

          <span class="rating-badge">⭐ ${restaurant.rating || "Novo"}</span>
        </div>

        <p class="restaurant-meta">
          ${restaurant.openingHours || "Horário não informado"}
        </p>

        <strong class="small-label">Horários disponíveis</strong>

        <div class="card-row client-time-row">
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

        <div class="card-row client-card-actions">
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

/**
 * Builds standardized 24-hour time options.
 *
 * @returns {string[]} Available time values.
 */
function buildTimeOptions() {
  const options = [];

  for (let hour = 6; hour <= 23; hour += 1) {
    ["00", "30"].forEach((minute) => {
      options.push(`${String(hour).padStart(2, "0")}:${minute}`);
    });
  }

  return options;
}

/**
 * Replaces time input/select contents with the standardized time options.
 *
 * @param {Document|HTMLElement} root - Scope where time selects are searched.
 * @returns {void}
 */
function bindTimeSelects(root = document) {
  root.querySelectorAll("[data-time-select]").forEach((select) => {
    const currentValue = select.value;
    const placeholder = select.querySelector("option[value='']")?.textContent || "Qualquer horário";

    select.innerHTML = `
      <option value="">${placeholder}</option>
      ${TIME_OPTIONS.map((time) => `
        <option value="${time}" ${time === currentValue ? "selected" : ""}>
          ${time}
        </option>
      `).join("")}
    `;
  });
}

/**
 * Normalizes text for accent-insensitive filtering.
 *
 * @param {string} value - Text to normalize.
 * @returns {string} Lowercase text without accent marks.
 */
function normalize(value = "") {
  return value
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
