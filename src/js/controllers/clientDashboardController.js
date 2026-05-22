import "../services/seedService.js";
import { getRestaurants, getRestaurantById } from "../services/restaurantService.js";
import {
  saveReservation,
  getReservationByRestaurantDateTime,
  isPastReservationDateTime
} from "../services/reservationService.js";
import { showToast } from "../utils/ui.js";

const user = JSON.parse(localStorage.getItem("loggedUser"));
const isLoggedUser = Boolean(user);

const userName = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");

const restaurantList = document.getElementById("restaurantList");
const searchRestaurant = document.getElementById("searchRestaurant");
const searchPeople = document.getElementById("searchPeople");
const searchDate = document.getElementById("searchDate");
const searchTime = document.getElementById("searchTime");
const searchCategory = document.getElementById("searchCategory");
const searchPrice = document.getElementById("searchPrice");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");
const filterChips = document.querySelectorAll(".filter-chip");
const searchBtn = document.getElementById("searchBtn");

const reservationModal = document.getElementById("reservationModal");
const reservationForm = document.getElementById("reservationForm");
const closeReservationModal = document.getElementById("closeReservationModal");

const reservationRestaurantId = document.getElementById("reservationRestaurantId");
const reservationRestaurantName = document.getElementById("reservationRestaurantName");
const reservationDate = document.getElementById("reservationDate");
const reservationTime = document.getElementById("reservationTime");
const reservationPeople = document.getElementById("reservationPeople");
const reservationTable = document.getElementById("reservationTable");

const reservationSuccessModal = document.getElementById("reservationSuccessModal");
const closeReservationSuccessModal = document.getElementById("closeReservationSuccessModal");

const TIME_OPTIONS = buildTimeOptions();

if (userName && user) {
  userName.textContent = user.firstName;
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedUser");
    window.location.href = "../auth/login.html";
  });
}

setTodayMinDate();
bindTimeSelects(document);
initLayout();
renderRestaurants();

function initLayout() {
  const navLinks = document.querySelectorAll(
    ".client-nav-link-horizontal, .client-nav-dropdown-link"
  );

  const panels = document.querySelectorAll(".client-panel");

  document.getElementById("goHomeRestaurants")?.addEventListener("click", () => {
    openSection("sectionSearch");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  function openSection(sectionId) {
    document.querySelectorAll(".client-nav-link-horizontal").forEach((item) => {
      item.classList.remove("active");
    });

    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === sectionId);
    });

    document.getElementById("profileDropdown")?.classList.remove("active");
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      openSection(link.dataset.section);
    });
  });

  document.getElementById("calendarReservationsBtn")?.addEventListener("click", () => {
    openSection("sectionReservations");
  });

  if (window.location.hash === "#reservas") {
    openSection("sectionReservations");
  }

  if (window.location.hash === "#avaliacoes") {
    openSection("sectionReviews");
  }

  if (window.location.hash === "#restaurantes" || window.location.hash === "") {
    openSection("sectionSearch");
  }
}

function setTodayMinDate() {
  const today = new Date().toISOString().split("T")[0];

  if (searchDate) searchDate.min = today;
  if (reservationDate) reservationDate.min = today;
}

function renderRestaurants() {
  if (!restaurantList) return;

  let restaurants = getRestaurants();

  const nameFilter = normalize(searchRestaurant?.value);
  const peopleFilter = Number(searchPeople?.value);
  const dateFilter = searchDate?.value;
  const timeFilter = searchTime?.value;
  const categoryFilter = normalize(searchCategory?.value);
  const priceFilter = searchPrice?.value;

  restaurants = restaurants.filter((restaurant) => {
    const matchName =
      normalize(restaurant.name).includes(nameFilter) ||
      normalize(restaurant.category).includes(nameFilter);

    const matchCategory = categoryFilter
      ? normalize(restaurant.category).includes(categoryFilter)
      : true;

    const matchPrice = priceFilter
      ? restaurant.priceRange === priceFilter
      : true;

    const matchAvailability =
      peopleFilter && dateFilter && timeFilter
        ? hasAvailability(restaurant, dateFilter, timeFilter, peopleFilter)
        : true;

    return matchName && matchCategory && matchPrice && matchAvailability;
  });

  if (!restaurants.length) {
    restaurantList.innerHTML = `
      <div class="empty-state">
        Nenhum restaurante encontrado com esses filtros.
      </div>
    `;
    return;
  }

  restaurantList.innerHTML = restaurants.map((restaurant) => {
    const availableTimes = restaurant.availableTimes || [];
    const visibleTimes = availableTimes.slice(0, 4);
    const hasMoreTimes = availableTimes.length > 4;

    return `
      <div class="client-restaurant-card">
        <div class="client-restaurant-image-wrap">
          <img src="${restaurant.coverImage}" alt="${restaurant.name}" class="client-restaurant-image">
          <span class="client-restaurant-badge">${restaurant.priceRange || "Novo"}</span>
        </div>

        <div class="client-restaurant-content">
          <div class="client-restaurant-heading">
            <div>
              <h3>${restaurant.name}</h3>
              <p>${restaurant.category} • ${restaurant.city}</p>
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
                  ${visibleTimes.map((time) => `<span class="time-chip">${time}</span>`).join("")}
                  ${hasMoreTimes ? `<span class="time-chip more-time-chip">+ horários</span>` : ""}
                `
                : `<span class="tag">Sem horários</span>`
            }
          </div>

          <div class="card-row client-card-actions">
            <a class="btn" href="./restaurant-details.html?id=${restaurant.id}">
              Ver detalhes
            </a>

            <button class="btn-secondary btn-open-reservation" data-id="${restaurant.id}" type="button">
              Reservar
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  bindRestaurantButtons();
}

function bindRestaurantButtons() {
  document.querySelectorAll(".btn-open-reservation").forEach((button) => {
    button.addEventListener("click", () => {
      const restaurant = getRestaurantById(Number(button.dataset.id));

      if (!restaurant) {
        showToast("Restaurante não encontrado.", "danger");
        return;
      }

      if (!isLoggedUser) {
        openLoginRequiredModal();
        return;
      }

      reservationRestaurantId.value = restaurant.id;
      reservationRestaurantName.value = restaurant.name;
      reservationDate.value = searchDate?.value || "";
      reservationPeople.value = searchPeople?.value || 2;
      renderReservationTimeOptions(restaurant, searchTime?.value || "");
      renderReservationTableOptions(restaurant);

      reservationModal.style.display = "flex";
    });
  });
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
        <a href="./auth/login.html" class="btn">Fazer login</a>
        <a href="./auth/register.html" class="btn-secondary">Criar conta</a>
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

function openGuestReservationModalFromList(restaurant) {
  const oldModal = document.getElementById("guestReservationModal");

  if (oldModal) {
    oldModal.remove();
  }

  const modal = document.createElement("div");
  modal.id = "guestReservationModal";
  modal.className = "modal";
  modal.style.display = "flex";

  modal.innerHTML = `
    <div class="modal-content guest-reservation-modal">
      <div class="guest-modal-header">
        <span class="guest-modal-icon">🍽️</span>

        <div>
          <h3>Reservar como visitante</h3>
          <p>
            Informe seus dados para o restaurante conseguir identificar sua reserva
            e entrar em contato, se necessário.
          </p>
        </div>
      </div>

      <div class="guest-reservation-summary">
        <strong>${restaurant.name}</strong>
        <span>Escolha data, horário e quantidade de pessoas para concluir.</span>
      </div>

      <form id="guestReservationForm">
        <div class="form-grid">
          <input type="text" id="guestFirstName" placeholder="Nome" required />
          <input type="text" id="guestLastName" placeholder="Sobrenome" required />
        </div>

        <input type="text" id="guestContact" placeholder="Celular ou e-mail" required />

        <input type="date" id="guestDate" required />
        <select id="guestTime" required>
          <option value="">Selecione um horário</option>
        </select>
        <input type="number" id="guestPeople" min="1" value="2" required />
        <select id="guestTable" required>
          <option value="">Selecione data, horário e pessoas</option>
        </select>

        <div class="modal-actions">
          <button type="submit" class="btn">Confirmar reserva</button>
          <button type="button" id="closeGuestReservationModal" class="btn-secondary">Fechar</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const today = new Date().toISOString().split("T")[0];

  document.getElementById("guestDate").min = today;
  document.getElementById("guestDate").value = searchDate?.value || "";
  document.getElementById("guestPeople").value = searchPeople?.value || 2;
  renderGuestTimeOptions(restaurant, searchTime?.value || "");
  renderGuestTableOptions(restaurant);

  document.getElementById("closeGuestReservationModal").addEventListener("click", () => {
    modal.remove();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  });

  ["guestDate", "guestPeople"].forEach((id) => {
    document.getElementById(id).addEventListener("change", () => {
      renderGuestTimeOptions(restaurant, document.getElementById("guestTime").value);
      renderGuestTableOptions(restaurant);
    });
  });

  document.getElementById("guestTime").addEventListener("change", () => {
    renderGuestTableOptions(restaurant);
  });

  document.getElementById("guestReservationForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const firstName = document.getElementById("guestFirstName").value.trim();
    const lastName = document.getElementById("guestLastName").value.trim();
    const contact = document.getElementById("guestContact").value.trim();
    const date = document.getElementById("guestDate").value;
    const time = document.getElementById("guestTime").value;
    const people = Number(document.getElementById("guestPeople").value);
    const tableId = Number(document.getElementById("guestTable").value);

    if (!firstName || !lastName || !contact || !date || !time || !people || !tableId) {
      showToast("Preencha todos os campos.", "danger");
      return;
    }

    if (isPastReservationDateTime(date, time)) {
      showToast("Não é possível reservar para uma data ou horário que já passou.", "danger");
      return;
    }

    if (!(restaurant.availableTimes || []).includes(time)) {
      showToast("Esse horário não está disponível para o restaurante.", "danger");
      return;
    }

    const table = findAvailableTableById(restaurant, date, time, people, tableId);

    if (!table) {
      showToast("Selecione uma mesa disponível para essa quantidade de pessoas nesse horário.", "danger");
      return;
    }

    saveReservation({
      id: Date.now(),
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      userId: null,
      userName: `${firstName} ${lastName}`,
      userEmail: contact.includes("@") ? contact : "",
      userPhone: contact.includes("@") ? "" : contact,
      customerFirstName: firstName,
      customerLastName: lastName,
      customerContact: contact,
      customerType: "guest",
      people,
      date,
      time,
      tableId: table.id,
      tableNumber: table.number,
      status: "pendente confirmação"
    });

    modal.remove();

    if (reservationSuccessModal) {
      reservationSuccessModal.style.display = "flex";
    }

    showToast("Reserva enviada como visitante! Aguarde a confirmação do restaurante.", "success");

    window.dispatchEvent(new Event("reservationsUpdated"));
  });
}

if (reservationForm) {
  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const restaurant = getRestaurantById(Number(reservationRestaurantId.value));

    if (!restaurant) {
      showToast("Restaurante não encontrado.", "danger");
      return;
    }

    const date = reservationDate.value;
    const time = reservationTime.value;
    const people = Number(reservationPeople.value);
    const tableId = Number(reservationTable.value);

    if (!date || !time || !people || !tableId) {
      showToast("Preencha data, horário, quantidade de pessoas e mesa.", "danger");
      return;
    }

    if (isPastReservationDateTime(date, time)) {
      showToast("Não é possível reservar para uma data ou horário que já passou.", "danger");
      return;
    }

    if (!(restaurant.availableTimes || []).includes(time)) {
      showToast("Esse horário não está disponível para o restaurante.", "danger");
      return;
    }

    const table = findAvailableTableById(restaurant, date, time, people, tableId);

    if (!table) {
      showToast("Selecione uma mesa disponível para essa quantidade de pessoas nesse horário.", "danger");
      return;
    }

    saveReservation({
      id: Date.now(),
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
      userPhone: user.phone || "",
      customerType: user.role === "admin" ? "admin" : "registered",
      customerContact: user.email || user.phone || "",
      people,
      date,
      time,
      tableId: table.id,
      tableNumber: table.number,
      status: "pendente confirmação"
    });

    reservationModal.style.display = "none";
    reservationForm.reset();

    if (reservationSuccessModal) {
      reservationSuccessModal.style.display = "flex";
    }

    window.dispatchEvent(new Event("reservationsUpdated"));
  });
}

if (reservationDate) {
  reservationDate.addEventListener("change", () => {
    const restaurant = getRestaurantById(Number(reservationRestaurantId.value));
    if (restaurant) {
      renderReservationTimeOptions(restaurant, reservationTime.value);
      renderReservationTableOptions(restaurant);
    }
  });
}

if (reservationPeople) {
  reservationPeople.addEventListener("change", () => {
    const restaurant = getRestaurantById(Number(reservationRestaurantId.value));
    if (restaurant) {
      renderReservationTimeOptions(restaurant, reservationTime.value);
      renderReservationTableOptions(restaurant);
    }
  });
}

if (reservationTime) {
  reservationTime.addEventListener("change", () => {
    const restaurant = getRestaurantById(Number(reservationRestaurantId.value));
    if (restaurant) {
      renderReservationTableOptions(restaurant);
    }
  });
}

if (closeReservationModal) {
  closeReservationModal.addEventListener("click", () => {
    reservationModal.style.display = "none";
  });
}

if (reservationModal) {
  reservationModal.addEventListener("click", (event) => {
    if (event.target === reservationModal) {
      reservationModal.style.display = "none";
    }
  });
}

if (closeReservationSuccessModal) {
  closeReservationSuccessModal.addEventListener("click", () => {
    reservationSuccessModal.style.display = "none";
  });
}

if (reservationSuccessModal) {
  reservationSuccessModal.addEventListener("click", (event) => {
    if (event.target === reservationSuccessModal) {
      reservationSuccessModal.style.display = "none";
    }
  });
}

[searchRestaurant, searchPeople, searchDate, searchTime, searchCategory, searchPrice].forEach((input) => {
  input?.addEventListener("input", renderRestaurants);
  input?.addEventListener("change", renderRestaurants);
});

clearFiltersBtn?.addEventListener("click", clearAllFilters);

filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    if (chip.id === "clearFiltersBtn" || chip.classList.contains("clear-chip")) {
      clearAllFilters();
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

if (searchBtn) {
  searchBtn.addEventListener("click", renderRestaurants);
}

function clearAllFilters() {
  if (searchRestaurant) searchRestaurant.value = "";
  if (searchPeople) searchPeople.value = "";
  if (searchDate) searchDate.value = "";
  if (searchTime) searchTime.value = "";
  if (searchCategory) searchCategory.value = "";
  if (searchPrice) searchPrice.value = "";

  filterChips.forEach((item) => item.classList.remove("active"));

  renderRestaurants();
}

function hasAvailability(restaurant, date, time, people) {
  return Boolean(findAvailableTable(restaurant, date, time, people));
}

function findAvailableTable(restaurant, date, time, people) {
  return getAvailableTables(restaurant, date, time, people)[0];
}

/**
 * Finds a specific available table by id.
 *
 * @param {Object} restaurant - Restaurant data.
 * @param {string} date - Reservation date.
 * @param {string} time - Reservation time.
 * @param {number} people - Number of people in the reservation.
 * @param {number} tableId - Selected table id.
 * @returns {Object|undefined} Selected table when it is available.
 */
function findAvailableTableById(restaurant, date, time, people, tableId) {
  return getAvailableTables(restaurant, date, time, people).find(
    (table) => Number(table.id) === Number(tableId)
  );
}

/**
 * Gets all tables that fit the group and are free at the selected time.
 *
 * @param {Object} restaurant - Restaurant data.
 * @param {string} date - Reservation date.
 * @param {string} time - Reservation time.
 * @param {number} people - Number of people in the reservation.
 * @returns {Array<Object>} Available tables sorted by capacity.
 */
function getAvailableTables(restaurant, date, time, people) {
  const tables = (restaurant.tables || [])
    .filter((table) => Number(table.capacity) >= Number(people))
    .sort((a, b) => Number(a.capacity) - Number(b.capacity));

  if (!date || !time || !people) {
    return tables;
  }

  const occupiedReservations = getReservationByRestaurantDateTime(
    restaurant.id,
    date,
    time
  );

  const occupiedTableIds = occupiedReservations.map((reservation) =>
    Number(reservation.tableId)
  );

  return tables.filter((table) => !occupiedTableIds.includes(Number(table.id)));
}

/**
 * Renders selectable reservation times in the logged user reservation modal.
 *
 * @param {Object} restaurant - Restaurant selected for the reservation.
 * @param {string} selectedTime - Time that should stay selected when available.
 * @returns {void}
 */
function renderReservationTimeOptions(restaurant, selectedTime = "") {
  if (!reservationTime) return;

  const date = reservationDate?.value || "";
  const people = Number(reservationPeople?.value || 0);
  const availableTimes = getAvailableTimesForSelection(restaurant, date, people);

  reservationTime.innerHTML = buildTimeOptionsMarkup(availableTimes, selectedTime);
}

/**
 * Renders selectable tables in the logged user reservation modal.
 *
 * @param {Object} restaurant - Restaurant selected for the reservation.
 * @param {string} selectedTableId - Table id that should stay selected when available.
 * @returns {void}
 */
function renderReservationTableOptions(restaurant, selectedTableId = "") {
  if (!reservationTable) return;

  const date = reservationDate?.value || "";
  const time = reservationTime?.value || "";
  const people = Number(reservationPeople?.value || 0);

  if (!date || !time || !people) {
    reservationTable.innerHTML = `<option value="">Selecione data, horário e pessoas</option>`;
    return;
  }

  const tables = getAvailableTables(restaurant, date, time, people);

  reservationTable.innerHTML = buildTableOptionsMarkup(tables, selectedTableId);
}

/**
 * Renders selectable reservation times in the guest reservation modal.
 *
 * @param {Object} restaurant - Restaurant selected for the reservation.
 * @param {string} selectedTime - Time that should stay selected when available.
 * @returns {void}
 */
function renderGuestTimeOptions(restaurant, selectedTime = "") {
  const guestTime = document.getElementById("guestTime");
  const guestDate = document.getElementById("guestDate");
  const guestPeople = document.getElementById("guestPeople");

  if (!guestTime) return;

  const date = guestDate?.value || "";
  const people = Number(guestPeople?.value || 0);
  const availableTimes = getAvailableTimesForSelection(restaurant, date, people);

  guestTime.innerHTML = buildTimeOptionsMarkup(availableTimes, selectedTime);
}

/**
 * Renders selectable tables in the guest reservation modal.
 *
 * @param {Object} restaurant - Restaurant selected for the reservation.
 * @param {string} selectedTableId - Table id that should stay selected when available.
 * @returns {void}
 */
function renderGuestTableOptions(restaurant, selectedTableId = "") {
  const guestTable = document.getElementById("guestTable");
  const guestDate = document.getElementById("guestDate");
  const guestTime = document.getElementById("guestTime");
  const guestPeople = document.getElementById("guestPeople");

  if (!guestTable) return;

  const date = guestDate?.value || "";
  const time = guestTime?.value || "";
  const people = Number(guestPeople?.value || 0);

  if (!date || !time || !people) {
    guestTable.innerHTML = `<option value="">Selecione data, horário e pessoas</option>`;
    return;
  }

  const tables = getAvailableTables(restaurant, date, time, people);

  guestTable.innerHTML = buildTableOptionsMarkup(tables, selectedTableId);
}

/**
 * Gets restaurant times that can still receive the requested party.
 *
 * @param {Object} restaurant - Restaurant data.
 * @param {string} date - Reservation date.
 * @param {number} people - Number of people requested.
 * @returns {Array<string>} Times available for the current selection.
 */
function getAvailableTimesForSelection(restaurant, date, people) {
  const times = restaurant.availableTimes || [];

  if (!date || !people) {
    return times;
  }

  return times.filter((time) => findAvailableTable(restaurant, date, time, people));
}

/**
 * Builds option markup for a reservation time select.
 *
 * @param {Array<string>} availableTimes - Times available for selection.
 * @param {string} selectedTime - Time that should be preselected.
 * @returns {string} Select option markup.
 */
function buildTimeOptionsMarkup(availableTimes, selectedTime = "") {
  if (!availableTimes.length) {
    return `<option value="">Nenhum horário disponível</option>`;
  }

  return `
    <option value="">Selecione um horário</option>
    ${availableTimes.map((time) => `
      <option value="${time}" ${time === selectedTime ? "selected" : ""}>
        ${time}
      </option>
    `).join("")}
  `;
}

/**
 * Builds option markup for a reservation table select.
 *
 * @param {Array<Object>} tables - Tables available for selection.
 * @param {string} selectedTableId - Table id that should be preselected.
 * @returns {string} Select option markup.
 */
function buildTableOptionsMarkup(tables, selectedTableId = "") {
  if (!tables.length) {
    return `<option value="">Nenhuma mesa disponível</option>`;
  }

  return `
    <option value="">Selecione uma mesa</option>
    ${tables.map((table) => `
      <option value="${table.id}" ${Number(table.id) === Number(selectedTableId) ? "selected" : ""}>
        Mesa ${table.number} - até ${table.capacity} pessoas${table.location ? ` - ${table.location}` : ""}
      </option>
    `).join("")}
  `;
}

/**
 * Builds standardized 24-hour time options.
 *
 * @returns {Array<string>} Time values in HH:mm format.
 */
function buildTimeOptions() {
  const options = [];

  for (let hour = 0; hour < 24; hour += 1) {
    ["00", "30"].forEach((minute) => {
      options.push(`${String(hour).padStart(2, "0")}:${minute}`);
    });
  }

  return options;
}

/**
 * Fills time selects with consistent 24-hour labels.
 *
 * @param {ParentNode} root - Root node containing time selects.
 * @returns {void}
 */
function bindTimeSelects(root) {
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

function normalize(value = "") {
  return value
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
