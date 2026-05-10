import { getRestaurantsByOwner } from "../services/restaurantService.js";
import { getReservationsByRestaurantOwner } from "../services/reservationService.js";
import { getReviews } from "../services/reviewService.js";

const user = JSON.parse(localStorage.getItem("loggedUser"));

const navLinks = document.querySelectorAll(".admin-nav-link");
const panels = document.querySelectorAll(".admin-panel");
const sidebar = document.querySelector(".admin-sidebar");
const sidebarToggle = document.getElementById("adminSidebarToggle");

initAdminLayout();
renderStats();

function initAdminLayout() {
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const sectionId = link.dataset.section;

      navLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");

      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.id === sectionId);
      });

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