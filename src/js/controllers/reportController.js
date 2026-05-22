import { getRestaurantsByOwner } from "../services/restaurantService.js";
import { getReservationsByRestaurantOwner } from "../services/reservationService.js";

const user = JSON.parse(localStorage.getItem("loggedUser"));
const reportContainer = document.getElementById("reservationReport");

if (reportContainer && user) {
  renderReport();
  window.addEventListener("restaurantsUpdated", renderReport);
  window.addEventListener("reservationsUpdated", renderReport);
}

function renderReport() {
  const restaurants = getRestaurantsByOwner(user.id);
  const reservations = getReservationsByRestaurantOwner(user.id, restaurants);

  const totalReservations = reservations.length;
  const pendingReservations = reservations.filter(r => r.status === "pendente confirmação").length;
  const confirmedReservations = reservations.filter(r => r.status === "confirmada").length;
  const canceledReservations = reservations.filter(r => r.status === "cancelada").length;
  const finishedReservations = reservations.filter(r => r.status === "concluida").length;

  const totalTables = restaurants.reduce((total, restaurant) => {
    return total + (restaurant.tables || []).length;
  }, 0);

  const occupiedReservations = pendingReservations + confirmedReservations;

  const occupancyRate = totalTables
    ? Math.round((occupiedReservations / totalTables) * 100)
    : 0;

  const maxValue = Math.max(
    totalReservations,
    pendingReservations,
    confirmedReservations,
    canceledReservations,
    finishedReservations,
    1
  );

  reportContainer.innerHTML = `
    <div class="report-stats-grid">
      ${buildStatCard("Total de reservas", totalReservations, "Solicitações recebidas", "stat-red")}
      ${buildStatCard("Pendentes", pendingReservations, "Aguardando confirmação", "stat-yellow")}
      ${buildStatCard("Confirmadas", confirmedReservations, "Reservas ativas", "stat-green")}
      ${buildStatCard("Canceladas", canceledReservations, "Reservas encerradas", "stat-blue")}
    </div>

    <div class="report-layout">
      <div class="card report-chart-card">
        <div class="report-card-header">
          <div>
            <h3>Resumo por status</h3>
            <p>Distribuição visual das reservas cadastradas.</p>
          </div>
        </div>

        <div class="bar-chart">
          ${buildBar("Pendentes", pendingReservations, maxValue, "bar-yellow")}
          ${buildBar("Confirmadas", confirmedReservations, maxValue, "bar-green")}
          ${buildBar("Concluídas", finishedReservations, maxValue, "bar-blue")}
          ${buildBar("Canceladas", canceledReservations, maxValue, "bar-red")}
        </div>
      </div>

      <div class="card report-chart-card">
        <div class="report-card-header">
          <div>
            <h3>Ocupação das mesas</h3>
            <p>Baseado nas reservas confirmadas e concluídas.</p>
          </div>
        </div>

        <div class="donut-wrapper">
          <div
            class="donut-chart"
            style="--value:${Math.min(occupancyRate, 100)};"
          >
            <span>${Math.min(occupancyRate, 100)}%</span>
          </div>

          <div class="donut-info">
            <strong>${totalTables}</strong>
            <span>mesa(s) cadastrada(s)</span>
            <p>${occupiedReservations} reserva(s) ocupando mesa no momento.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="card report-table-card">
      <div class="report-card-header">
        <div>
          <h3>Restaurantes cadastrados</h3>
          <p>Visão rápida por restaurante.</p>
        </div>
      </div>

      <div class="report-table">
        <div class="report-table-head">
          <span>Restaurante</span>
          <span>Mesas</span>
          <span>Horários</span>
          <span>Reservas</span>
        </div>

        ${
          restaurants.length
            ? restaurants.map((restaurant) => {
                const restaurantReservations = reservations.filter(
                  r => Number(r.restaurantId) === Number(restaurant.id)
                );

                return `
                  <div class="report-table-row">
                    <span>${restaurant.name}</span>
                    <span>${(restaurant.tables || []).length}</span>
                    <span>${(restaurant.availableTimes || []).length}</span>
                    <span>${restaurantReservations.length}</span>
                  </div>
                `;
              }).join("")
            : `<div class="empty-state">Nenhum restaurante cadastrado.</div>`
        }
      </div>
    </div>
  `;
}

function buildStatCard(title, value, description, colorClass) {
  return `
    <div class="admin-stat-card ${colorClass}">
      <span>${title}</span>
      <strong>${value}</strong>
      <small>${description}</small>
    </div>
  `;
}

function buildBar(label, value, maxValue, colorClass) {
  const width = Math.max((value / maxValue) * 100, value > 0 ? 8 : 0);

  return `
    <div class="bar-chart-item">
      <div class="bar-chart-label">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>

      <div class="bar-chart-track">
        <div
          class="bar-chart-fill ${colorClass}"
          style="width:${width}%"
        ></div>
      </div>
    </div>
  `;
}
