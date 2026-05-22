import { getRestaurantsByOwner } from "../services/restaurantService.js";
import { getReservationsByRestaurantOwner } from "../services/reservationService.js";
import { getReviews } from "../services/reviewService.js";

const user = JSON.parse(localStorage.getItem("loggedUser"));

const navLinks = document.querySelectorAll(".admin-nav-link");
const panels = document.querySelectorAll(".admin-panel");
const sidebar = document.querySelector(".admin-sidebar");
const sidebarToggle = document.getElementById("adminSidebarToggle");
const pageTitle = document.getElementById("adminPageTitle");
const pageDescription = document.getElementById("adminPageDescription");

const SECTION_HEADERS = {
  sectionReports: {
    title: "Dashboard e relatórios",
    description: "Resumo operacional, cancelamentos, confirmações e ocupação."
  },
  sectionRestaurants: {
    title: "Meus restaurantes",
    description: "Visualize, crie, edite ou exclua os restaurantes cadastrados."
  },
  sectionTables: {
    title: "Gerenciar mesas",
    description: "Selecione um restaurante para cadastrar, editar ou excluir mesas."
  },
  sectionSchedule: {
    title: "Agenda semanal",
    description: "Acompanhe as reservas distribuídas por dia."
  },
  sectionReservations: {
    title: "Reservas recebidas",
    description: "Confirme, cancele, finalize ou crie reservas dos clientes."
  },
  sectionReviews: {
    title: "Avaliações recebidas",
    description: "Veja os comentários e notas deixados pelos clientes."
  }
};

initAdminLayout();
renderStats();
window.addEventListener("restaurantsUpdated", renderStats);
window.addEventListener("reservationsUpdated", renderStats);

function initAdminLayout() {
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const sectionId = link.dataset.section;

      navLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");

      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.id === sectionId);
      });

      updatePageHeader(sectionId);

      if (window.innerWidth <= 900) {
        sidebar.classList.remove("active");
      }
    });
  });

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }
}

/**
 * Updates the administrator topbar copy for the selected section.
 *
 * @param {string} sectionId - Active admin section id.
 * @returns {void}
 */
function updatePageHeader(sectionId) {
  const header = SECTION_HEADERS[sectionId];

  if (!header) return;

  if (pageTitle) {
    pageTitle.textContent = header.title;
  }

  if (pageDescription) {
    pageDescription.textContent = header.description;
  }
}

function renderStats() {
  if (!user) return;

  const restaurants = getRestaurantsByOwner(user.id);
  const reservations = getReservationsByRestaurantOwner(user.id, restaurants);

  const restaurantNames = restaurants.map((restaurant) => restaurant.name);
  const reviews = getReviews().filter((review) =>
    restaurantNames.includes(review.restaurant)
  );

  const tablesCount = restaurants.reduce((total, restaurant) => {
    return total + (restaurant.tables || []).length;
  }, 0);

  setText("statRestaurants", restaurants.length);
  setText("statReservations", reservations.length);
  setText("statTables", tablesCount);
  setText("statReviews", reviews.length);
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}
