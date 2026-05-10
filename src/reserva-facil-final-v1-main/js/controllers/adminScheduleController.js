import { getRestaurantsByOwner } from "../services/restaurantService.js";
import { getReservationsByRestaurantOwner } from "../services/reservationService.js";

const user = JSON.parse(localStorage.getItem("loggedUser"));
const scheduleContainer = document.getElementById("adminSchedule");

if (scheduleContainer && user) {
  renderWeeklySchedule();
}

function renderWeeklySchedule() {
  const restaurants = getRestaurantsByOwner(user.id);
  const reservations = getReservationsByRestaurantOwner(user.id, restaurants);

  const weekDays = getCurrentWeekDays();

  scheduleContainer.innerHTML = `
    <div class="admin-week-calendar">
      <div class="week-calendar-header">
        ${weekDays.map((day) => `
          <div class="week-day-title">
            <strong>${day.weekName}</strong>
            <span>${day.shortDate}</span>
          </div>
        `).join("")}
      </div>

      <div class="week-calendar-body">
        ${weekDays.map((day) => {
          const dayReservations = reservations
            .filter((reservation) => reservation.date === day.iso)
            .sort((a, b) => a.time.localeCompare(b.time));

          return `
            <div class="week-day-column ${day.isToday ? "today" : ""}">
              ${
                dayReservations.length
                  ? dayReservations.map(buildReservationCard).join("")
                  : `<div class="week-empty">Nenhuma reserva neste dia.</div>`
              }
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function buildReservationCard(reservation) {
  return `
    <div class="week-reservation-card">
      <strong>${reservation.restaurantName}</strong>

      <p>${reservation.time} • ${reservation.people} pessoa(s)</p>
      <p>Cliente: ${reservation.userName}</p>
      <p>Mesa: ${reservation.tableNumber || "Não definida"}</p>

      <span class="status-badge ${getStatusClass(reservation.status)}">
        ${reservation.status}
      </span>
    </div>
  `;
}

function getStatusClass(status) {
  if (status === "confirmada") return "status-confirmada";
  if (status === "cancelada") return "status-cancelada";
  if (status === "concluida") return "status-confirmada";
  return "status-ativa";
}

function getCurrentWeekDays() {
  const today = new Date();

  const firstDay = new Date(today);
  const day = today.getDay();

  const diffToMonday = day === 0 ? -6 : 1 - day;
  firstDay.setDate(today.getDate() + diffToMonday);

  return Array.from({ length: 7 }).map((_, index) => {
    const current = new Date(firstDay);
    current.setDate(firstDay.getDate() + index);

    const iso = current.toISOString().split("T")[0];

    return {
      iso,
      weekName: current.toLocaleDateString("pt-BR", {
        weekday: "short"
      }),
      shortDate: current.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit"
      }),
      isToday: iso === today.toISOString().split("T")[0]
    };
  });
}