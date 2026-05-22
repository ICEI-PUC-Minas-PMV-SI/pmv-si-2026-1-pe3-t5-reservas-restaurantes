import {
  getReservationsByRestaurantOwner,
  getReservationByRestaurantDateTime,
  isPastReservationDateTime,
  saveReservation,
  updateReservationStatus
} from "../services/reservationService.js";

import { getRestaurantsByOwner } from "../services/restaurantService.js";
import { createNotification } from "../services/notificationService.js";
import { confirmAction, showToast } from "../utils/ui.js";

const user = JSON.parse(localStorage.getItem("loggedUser"));

if (!user || user.role !== "admin") {
  window.location.href = "../auth/login.html";
}

const reservationList = document.getElementById("adminReservations");
const adminReservationStatusFilter = document.getElementById("adminReservationStatusFilter");
const adminCreateReservationForm = document.getElementById("adminCreateReservationForm");
const adminReservationRestaurantSelect = document.getElementById("adminReservationRestaurantSelect");
const adminReservationDate = document.getElementById("adminReservationDate");
const adminReservationTimeSelect = document.getElementById("adminReservationTimeSelect");
const adminReservationPeople = document.getElementById("adminReservationPeople");
const adminReservationCustomerName = document.getElementById("adminReservationCustomerName");
const adminReservationCustomerContact = document.getElementById("adminReservationCustomerContact");

/**
 * Gets the visual class for a reservation status badge.
 *
 * @param {string} status - Reservation status.
 * @returns {string} CSS class for the status badge.
 */
function getStatusClass(status) {
  if (status === "confirmada") return "status-confirmada";
  if (status === "cancelada") return "status-cancelada";
  if (status === "concluida") return "status-confirmada";
  return "status-ativa";
}

/**
 * Builds the reservation card shown in the administrator list.
 *
 * @param {Object} reservation - Reservation data.
 * @returns {string} Reservation card markup.
 */
function buildReservationCard(reservation) {
  const isCanceled = reservation.status === "cancelada";
  const isConfirmed = reservation.status === "confirmada";
  const isFinished = reservation.status === "concluida";
  const customerContact = reservation.userEmail || reservation.userPhone || reservation.customerContact || "Não informado";

  return `
    <div class="card">
      <div class="restaurant-title">${reservation.restaurantName}</div>

      <div class="restaurant-meta"><strong>Cliente:</strong> ${reservation.userName}</div>
      <div class="restaurant-meta"><strong>Contato:</strong> ${customerContact}</div>
      <div class="restaurant-meta">${reservation.date} às ${reservation.time} • ${reservation.people} pessoas</div>
      <div class="restaurant-meta">Mesa: ${reservation.tableNumber || "Não vinculada"}</div>

      <span class="status-badge ${getStatusClass(reservation.status)}">
        ${reservation.status}
      </span>

      <div class="card-row">
        ${
          !isCanceled && !isConfirmed && !isFinished
            ? `<button class="btn btn-status" data-id="${reservation.id}" data-status="confirmada">Confirmar</button>`
            : ""
        }

        ${
          isConfirmed
            ? `<button class="btn btn-status" data-id="${reservation.id}" data-status="concluida">Finalizar experiência</button>`
            : ""
        }

        ${
          !isCanceled && !isFinished
            ? `<button class="btn-secondary btn-status" data-id="${reservation.id}" data-status="cancelada">Cancelar</button>`
            : ""
        }
      </div>
    </div>
  `;
}

/**
 * Sorts reservations by operational priority and date.
 *
 * @param {Array<Object>} reservations - Reservations to sort.
 * @returns {Array<Object>} Sorted reservation list.
 */
function sortReservations(reservations) {
  return [...reservations].sort((a, b) => {
    const priority = {
      "pendente confirmação": 1,
      confirmada: 2,
      concluida: 3,
      cancelada: 4
    };

    const priorityA = priority[a.status] || 99;
    const priorityB = priority[b.status] || 99;

    if (priorityA !== priorityB) return priorityA - priorityB;

    return new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`);
  });
}

/**
 * Attaches status update actions to reservation cards.
 *
 * @returns {void}
 */
function bindStatusEvents() {
  document.querySelectorAll(".btn-status").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = Number(button.dataset.id);
      const status = button.dataset.status;

      const ownedRestaurants = getRestaurantsByOwner(user.id);
      const reservations = getReservationsByRestaurantOwner(user.id, ownedRestaurants);
      const reservation = reservations.find((item) => Number(item.id) === id);

      if (!reservation) {
        showToast("Reserva não encontrada.", "danger");
        return;
      }

      if (status === "cancelada") {
        const confirmed = await confirmAction({
          title: "Cancelar reserva",
          message: "Tem certeza que deseja cancelar esta reserva? A mesa voltará a ficar disponível.",
          confirmText: "Sim, cancelar",
          cancelText: "Voltar",
          danger: true
        });

        if (!confirmed) return;
      }

      updateReservationStatus(id, status);

      if (reservation.userId && status === "confirmada") {
        createNotification({
          userId: reservation.userId,
          title: "Reserva confirmada",
          message: `Sua reserva no restaurante ${reservation.restaurantName} foi confirmada.`
        });
      }

      if (reservation.userId && status === "cancelada") {
        createNotification({
          userId: reservation.userId,
          title: "Reserva cancelada",
          message: `Sua reserva no restaurante ${reservation.restaurantName} foi cancelada.`
        });
      }

      if (reservation.userId && status === "concluida") {
        createNotification({
          userId: reservation.userId,
          title: "Como foi sua experiência?",
          message: `Sua experiência no restaurante ${reservation.restaurantName} foi finalizada. Que tal deixar uma avaliação?`,
          type: "review",
          restaurantId: reservation.restaurantId,
          restaurantName: reservation.restaurantName
        });
      }

      renderAdminReservations();
      window.dispatchEvent(new Event("reservationsUpdated"));
      showToast(`Reserva atualizada para: ${status}.`, "success");
    });
  });
}

/**
 * Renders reservations owned by the logged administrator.
 *
 * @returns {void}
 */
function renderAdminReservations() {
  if (!reservationList) return;

  const ownedRestaurants = getRestaurantsByOwner(user.id);
  let reservations = getReservationsByRestaurantOwner(user.id, ownedRestaurants);
  const selectedStatus = adminReservationStatusFilter?.value || "";

  reservationList.innerHTML = "";

  if (!reservations.length) {
    reservationList.innerHTML = `<div class="empty-state">Nenhuma reserva encontrada.</div>`;
    return;
  }

  reservations = sortReservations(reservations);

  if (selectedStatus) {
    reservations = reservations.filter((reservation) => reservation.status === selectedStatus);
  }

  if (!reservations.length) {
    reservationList.innerHTML = `<div class="empty-state">Nenhuma reserva encontrada para este filtro.</div>`;
    return;
  }

  const groups = {
    "pendente confirmação": reservations.filter(r => r.status === "pendente confirmação"),
    confirmada: reservations.filter(r => r.status === "confirmada"),
    concluida: reservations.filter(r => r.status === "concluida"),
    cancelada: reservations.filter(r => r.status === "cancelada")
  };

  reservationList.innerHTML = Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([status, items]) => `
      <div class="detail-section">
        <h3 style="margin-bottom: 12px; text-transform: capitalize;">${status}</h3>
        <div class="cards">
          ${items.map(buildReservationCard).join("")}
        </div>
      </div>
    `)
    .join("");

  bindStatusEvents();
}

/**
 * Sets the minimum reservation date to today.
 *
 * @returns {void}
 */
function setAdminReservationMinDate() {
  if (!adminReservationDate) return;

  adminReservationDate.min = new Date().toISOString().split("T")[0];
}

/**
 * Renders restaurant options in the administrator reservation form.
 *
 * @returns {void}
 */
function renderAdminReservationRestaurantOptions() {
  if (!adminReservationRestaurantSelect) return;

  const restaurants = getRestaurantsByOwner(user.id);
  const currentValue = adminReservationRestaurantSelect.value;

  adminReservationRestaurantSelect.innerHTML = `
    <option value="">Selecione um restaurante</option>
    ${restaurants.map((restaurant) => `
      <option value="${restaurant.id}">${restaurant.name}</option>
    `).join("")}
  `;

  if (currentValue && restaurants.some((restaurant) => Number(restaurant.id) === Number(currentValue))) {
    adminReservationRestaurantSelect.value = currentValue;
  }

  renderAdminReservationTimeOptions();
}

/**
 * Renders available reservation times for the selected restaurant.
 *
 * @returns {void}
 */
function renderAdminReservationTimeOptions() {
  if (!adminReservationRestaurantSelect || !adminReservationTimeSelect) return;

  const restaurants = getRestaurantsByOwner(user.id);
  const restaurant = restaurants.find(
    (item) => Number(item.id) === Number(adminReservationRestaurantSelect.value)
  );

  if (!restaurant) {
    adminReservationTimeSelect.innerHTML = `
      <option value="">Selecione um restaurante primeiro</option>
    `;
    return;
  }

  const times = restaurant.availableTimes || [];

  adminReservationTimeSelect.innerHTML = `
    <option value="">Selecione um horário</option>
    ${
      times.length
        ? times.map((time) => `<option value="${time}">${time}</option>`).join("")
        : `<option value="">Nenhum horário cadastrado</option>`
    }
  `;
}

/**
 * Handles reservation creation by an administrator.
 *
 * @param {SubmitEvent} event - Form submit event.
 * @returns {void}
 */
function handleAdminReservationSubmit(event) {
  event.preventDefault();

  const restaurants = getRestaurantsByOwner(user.id);
  const restaurant = restaurants.find(
    (item) => Number(item.id) === Number(adminReservationRestaurantSelect.value)
  );

  if (!restaurant) {
    showToast("Selecione um restaurante válido.", "danger");
    return;
  }

  const date = adminReservationDate.value;
  const time = adminReservationTimeSelect.value;
  const people = Number(adminReservationPeople.value);
  const customerName = adminReservationCustomerName.value.trim();
  const customerContact = adminReservationCustomerContact.value.trim();

  if (!date || !time || !people || !customerName || !customerContact) {
    showToast("Preencha todos os dados da reserva.", "danger");
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

  const table = findAvailableTable(restaurant, date, time, people);

  if (!table) {
    showToast("Nenhuma mesa disponível para essa quantidade de pessoas nesse horário.", "danger");
    return;
  }

  saveReservation({
    id: Date.now(),
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    userId: null,
    userName: customerName,
    userEmail: customerContact.includes("@") ? customerContact : "",
    userPhone: customerContact.includes("@") ? "" : customerContact,
    customerType: "admin-created",
    customerContact,
    people,
    date,
    time,
    tableId: table.id,
    tableNumber: table.number,
    status: "confirmada"
  });

  adminCreateReservationForm.reset();
  renderAdminReservationTimeOptions();
  renderAdminReservations();
  window.dispatchEvent(new Event("reservationsUpdated"));
  showToast("Reserva criada e confirmada com sucesso.", "success");
}

/**
 * Finds the smallest available table that fits the requested party size.
 *
 * @param {Object} restaurant - Restaurant data.
 * @param {string} date - Reservation date.
 * @param {string} time - Reservation time.
 * @param {number} people - Number of people in the reservation.
 * @returns {Object|undefined} Available table, when one exists.
 */
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

if (adminReservationStatusFilter) {
  adminReservationStatusFilter.addEventListener("change", renderAdminReservations);
}

if (adminReservationRestaurantSelect) {
  adminReservationRestaurantSelect.addEventListener("change", renderAdminReservationTimeOptions);
}

if (adminCreateReservationForm) {
  adminCreateReservationForm.addEventListener("submit", handleAdminReservationSubmit);
}

window.addEventListener("restaurantsUpdated", () => {
  renderAdminReservationRestaurantOptions();
  renderAdminReservations();
});

window.addEventListener("reservationsUpdated", renderAdminReservations);

setAdminReservationMinDate();
renderAdminReservationRestaurantOptions();
renderAdminReservations();
