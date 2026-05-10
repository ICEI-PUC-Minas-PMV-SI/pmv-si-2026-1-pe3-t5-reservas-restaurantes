import {
  getUserReservations,
  cancelReservation
} from "../services/reservationService.js";

const user = JSON.parse(localStorage.getItem("loggedUser"));
const listContainer = document.getElementById("myReservations");
const reservationStatusFilter = document.getElementById("reservationStatusFilter");

function getStatusClass(status) {
  if (status === "confirmada") return "status-confirmada";
  if (status === "cancelada") return "status-cancelada";
  if (status === "concluida") return "status-confirmada";
  return "status-ativa";
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

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`);
  });
}

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

function bindCancelReservationButtons() {
  document.querySelectorAll(".btn-cancel-client-reservation").forEach((button) => {
    button.addEventListener("click", () => {
      const reservationId = Number(button.dataset.id);

      const reservations = JSON.parse(localStorage.getItem("reservations")) || [];

      const updatedReservations = reservations.map((reservation) => {
        if (Number(reservation.id) === reservationId) {
          return {
            ...reservation,
            status: "cancelada"
          };
        }

        return reservation;
      });

      localStorage.setItem("reservations", JSON.stringify(updatedReservations));

      renderReservations();
      window.dispatchEvent(new Event("reservationsUpdated"));
    });
  });
}

function bindCancelButtons() {
  document.querySelectorAll(".btn-cancel-reservation").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      cancelReservation(id);
      renderReservations();
    });
  });
}

if (reservationStatusFilter) {
  reservationStatusFilter.addEventListener("change", renderReservations);
}

renderReservations();