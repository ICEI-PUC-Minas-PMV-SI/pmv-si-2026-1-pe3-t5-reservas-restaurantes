import {
  getUserReservations,
  cancelReservation
} from "../services/reservationService.js";
import { confirmAction, showToast } from "../utils/ui.js";

const user = JSON.parse(localStorage.getItem("loggedUser"));
const listContainer = document.getElementById("myReservations");
const reservationStatusFilter = document.getElementById("reservationStatusFilter");

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

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`);
  });
}

/**
 * Renders the logged user's reservations.
 *
 * @returns {void}
 */
function renderReservations() {
  if (!listContainer || !user) return;

  let reservations = getUserReservations(user.id);
  const filter = reservationStatusFilter?.value || "";

  if (filter) {
    reservations = reservations.filter(
      (reservation) => reservation.status === filter
    );
  }

  reservations = sortReservations(reservations);

  if (!reservations.length) {
    listContainer.innerHTML = `
      <div class="empty-state">
        Nenhuma reserva encontrada.
      </div>
    `;
    return;
  }

  const groups = [
    { title: "Pendentes", status: "pendente confirmação" },
    { title: "Confirmadas", status: "confirmada" },
    { title: "Concluídas", status: "concluida" },
    { title: "Canceladas", status: "cancelada" }
  ];

  listContainer.innerHTML = groups
    .map((group) => {
      const items = reservations.filter(
        (reservation) => reservation.status === group.status
      );

      if (!items.length) return "";

      return `
        <section class="client-reservation-group">
          <div class="client-reservation-group-header">
            <h3>${group.title}</h3>
          </div>

          <div class="client-reservation-grid">
            ${items
              .map(
                (reservation) => `
                  <div class="client-reservation-card">
                    <div class="client-reservation-card-header">
                      <div>
                        <h4>${reservation.restaurantName}</h4>

                        <p>
                          ${reservation.date} às ${reservation.time}
                          • ${reservation.people} pessoas
                        </p>

                        <p>
                          Mesa ${reservation.tableNumber || "não definida"}
                        </p>
                      </div>

                      <span class="status-badge ${getStatusClass(reservation.status)}">
                        ${reservation.status}
                      </span>
                    </div>

                    ${
                      reservation.status === "confirmada" ||
                      reservation.status === "pendente confirmação"
                        ? `
                          <div class="client-reservation-actions">
                            <button
                              class="btn-secondary btn-cancel-client-reservation"
                              data-id="${reservation.id}"
                              type="button"
                            >
                              Cancelar reserva
                            </button>
                          </div>
                        `
                        : ""
                    }
                  </div>
                `
              )
              .join("")}
          </div>
        </section>
      `;
    })
    .join("");

  bindCancelReservationButtons();
}

/**
 * Attaches confirmation behavior to client cancellation buttons.
 *
 * @returns {void}
 */
function bindCancelReservationButtons() {
  document.querySelectorAll(".btn-cancel-client-reservation").forEach((button) => {
    button.addEventListener("click", async () => {
      const reservationId = Number(button.dataset.id);

      const confirmed = await confirmAction({
        title: "Cancelar reserva",
        message: "Tem certeza que deseja cancelar esta reserva? O restaurante será informado da alteração.",
        confirmText: "Sim, cancelar",
        cancelText: "Voltar",
        danger: true
      });

      if (!confirmed) return;

      cancelReservation(reservationId);
      renderReservations();
      showToast("Reserva cancelada com sucesso.", "danger");
      window.dispatchEvent(new Event("reservationsUpdated"));
    });
  });
}

/**
 * Attaches cancellation behavior to legacy reservation buttons.
 *
 * @returns {void}
 */
function bindCancelButtons() {
  document.querySelectorAll(".btn-cancel-reservation").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = Number(button.dataset.id);
      const confirmed = await confirmAction({
        title: "Cancelar reserva",
        message: "Tem certeza que deseja cancelar esta reserva?",
        confirmText: "Sim, cancelar",
        cancelText: "Voltar",
        danger: true
      });

      if (!confirmed) return;

      cancelReservation(id);
      renderReservations();
      showToast("Reserva cancelada com sucesso.", "danger");
      window.dispatchEvent(new Event("reservationsUpdated"));
    });
  });
}

if (reservationStatusFilter) {
  reservationStatusFilter.addEventListener("change", renderReservations);
}

renderReservations();
