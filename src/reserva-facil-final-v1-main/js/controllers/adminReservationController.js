import {
  getReservationsByRestaurantOwner,
  updateReservationStatus
} from "../services/reservationService.js";

import { getRestaurantsByOwner } from "../services/restaurantService.js";
import { createNotification } from "../services/notificationService.js";
import { showToast } from "../utils/ui.js";

const user = JSON.parse(localStorage.getItem("loggedUser"));

if (!user || user.role !== "admin") {
  window.location.href = "../auth/login.html";
}

const reservationList = document.getElementById("adminReservations");
const adminReservationStatusFilter = document.getElementById("adminReservationStatusFilter");

function getStatusClass(status) {
  if (status === "confirmada") return "status-confirmada";
  if (status === "cancelada") return "status-cancelada";
  if (status === "concluida") return "status-confirmada";
  return "status-ativa";
}

function buildReservationCard(reservation) {
  const isCanceled = reservation.status === "cancelada";
  const isConfirmed = reservation.status === "confirmada";
  const isFinished = reservation.status === "concluida";

  return `
    <div class="card">
      <div class="restaurant-title">${reservation.restaurantName}</div>

      <div class="restaurant-meta"><strong>Cliente:</strong> ${reservation.userName}</div>
      <div class="restaurant-meta"><strong>E-mail:</strong> ${reservation.userEmail}</div>
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

function bindStatusEvents() {
  document.querySelectorAll(".btn-status").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      const status = button.dataset.status;

      const ownedRestaurants = getRestaurantsByOwner(user.id);
      const reservations = getReservationsByRestaurantOwner(user.id, ownedRestaurants);
      const reservation = reservations.find((item) => Number(item.id) === id);

      if (!reservation) {
        showToast("Reserva não encontrada.", "danger");
        return;
      }

      updateReservationStatus(id, status);

      if (status === "confirmada") {
        createNotification({
          userId: reservation.userId,
          title: "Reserva confirmada",
          message: `Sua reserva no restaurante ${reservation.restaurantName} foi confirmada.`
        });
      }

      if (status === "cancelada") {
        createNotification({
          userId: reservation.userId,
          title: "Reserva cancelada",
          message: `Sua reserva no restaurante ${reservation.restaurantName} foi cancelada.`
        });
      }

      if (status === "concluida") {
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
      showToast(`Reserva atualizada para: ${status}.`, "success");
    });
  });
}

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

if (adminReservationStatusFilter) {
  adminReservationStatusFilter.addEventListener("change", renderAdminReservations);
}

renderAdminReservations();