import {
  getRestaurantsByOwner,
  saveRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantById
} from "../services/restaurantService.js";

import { getReviews } from "../services/reviewService.js";
import { showToast, confirmAction } from "../utils/ui.js";

const user = JSON.parse(localStorage.getItem("loggedUser"));

if (!user || user.role !== "admin") {
  window.location.href = "../auth/login.html";
}

const userName = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");
const form = document.getElementById("restaurantForm");
const restaurantList = document.getElementById("adminRestaurants");
const reviewList = document.getElementById("adminReviews");

const tableRestaurantSelect = document.getElementById("tableRestaurantSelect");
const tableManagerArea = document.getElementById("tableManagerArea");

const tableEditModal = document.getElementById("tableEditModal");
const tableEditForm = document.getElementById("tableEditForm");
const closeTableEditModal = document.getElementById("closeTableEditModal");

if (userName) {
  userName.innerText = user.firstName;
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedUser");
    window.location.href = "../auth/login.html";
  });
}

/* =========================
   CADASTRAR RESTAURANTE
========================= */

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const restaurantData = {
      id: Date.now(),
      ownerId: user.id,
      ownerName: `${user.firstName} ${user.lastName}`,
      ownerEmail: user.email,
      name: getValue("restaurantName"),
      category: getValue("restaurantCategory"),
      city: getValue("restaurantCity"),
      openingHours: getValue("restaurantHours"),
      priceRange: getValue("restaurantPriceRange"),
      coverImage: getValue("restaurantCoverImage"),
      dishImage: getValue("restaurantDishImage"),
      description: getValue("restaurantDescription"),
      menu: getValue("restaurantMenu"),
      photos: splitList(getValue("restaurantPhotos")),
      availableTimes: splitList(getValue("restaurantAvailableTimes")),
      tables: [],
      rating: "Novo"
    };

    saveRestaurant(restaurantData);

    form.reset();

    renderRestaurants();
    renderTableRestaurantOptions();
    renderReviews();

    showToast("Restaurante cadastrado com sucesso.", "success");
  });
}

/* =========================
   RESTAURANTES
========================= */

function renderRestaurants() {
  const restaurants = getRestaurantsByOwner(user.id);

  if (!restaurantList) return;

  restaurantList.innerHTML = "";
  restaurantList.className = "admin-restaurant-grid";

  if (!restaurants.length) {
    restaurantList.innerHTML = `
      <div class="empty-state">
        Nenhum restaurante cadastrado.
      </div>
    `;
    return;
  }

  restaurants.forEach((restaurant) => {
    const card = document.createElement("div");
    card.className = "admin-restaurant-compact-card";

    card.innerHTML = `
      <div class="admin-restaurant-card-main">
        <img
          src="${restaurant.coverImage}"
          alt="Capa do restaurante ${restaurant.name}"
          class="admin-restaurant-cover"
        >

        <div class="admin-restaurant-card-content">
          <div class="restaurant-title">${restaurant.name}</div>

          <div class="restaurant-meta">
            ${restaurant.category} • ${restaurant.city} • ${restaurant.openingHours}
          </div>

          <div class="card-row">
            <span class="tag">${restaurant.priceRange}</span>
            <span class="tag">${(restaurant.tables || []).length} mesa(s)</span>
            <span class="tag">${(restaurant.availableTimes || []).length} horário(s)</span>
          </div>

          <p class="muted-text admin-restaurant-preview">
            ${restaurant.description || "Sem descrição cadastrada."}
          </p>

          <div class="card-row admin-restaurant-actions">
            <button class="btn-secondary btn-toggle-edit-restaurant" data-id="${restaurant.id}">
              Editar restaurante
            </button>

            <button class="btn-danger-outline btn-delete-restaurant" data-id="${restaurant.id}">
              Excluir restaurante
            </button>
          </div>
        </div>
      </div>

      <div class="restaurant-inline-editor" id="restaurant-editor-${restaurant.id}">
        ${buildRestaurantEditForm(restaurant)}
      </div>
    `;

    restaurantList.appendChild(card);
  });

  bindRestaurantActions();
}

function buildRestaurantEditForm(restaurant) {
  return `
    <form class="restaurantInlineEditForm" data-id="${restaurant.id}">
      <div class="admin-section-header" style="margin-bottom:16px;">
        <h2 style="font-size:22px;">Editar ${restaurant.name}</h2>
        <p>Atualize as informações principais deste restaurante.</p>
      </div>

      <div class="form-grid">
        <input type="text" name="name" value="${escapeValue(restaurant.name)}" placeholder="Nome do restaurante" required />
        <input type="text" name="category" value="${escapeValue(restaurant.category)}" placeholder="Categoria" required />
        <input type="text" name="city" value="${escapeValue(restaurant.city)}" placeholder="Cidade" required />
        <input type="text" name="openingHours" value="${escapeValue(restaurant.openingHours)}" placeholder="Horário de funcionamento" required />
        <input type="text" name="priceRange" value="${escapeValue(restaurant.priceRange)}" placeholder="Faixa de preço" required />
        <input type="text" name="coverImage" value="${escapeValue(restaurant.coverImage)}" placeholder="URL da imagem de capa" required />
        <input type="text" name="dishImage" value="${escapeValue(restaurant.dishImage || "")}" placeholder="URL da imagem de prato/experiência" />
        <input type="text" name="photos" value="${escapeValue((restaurant.photos || []).join(", "))}" placeholder="Fotos extras separadas por vírgula" />
        <input type="text" name="availableTimes" value="${escapeValue((restaurant.availableTimes || []).join(", "))}" placeholder="Horários separados por vírgula" required />
      </div>

      <textarea name="description" rows="5" placeholder="Descrição da experiência" required>${restaurant.description || ""}</textarea>
      <textarea name="menu" rows="5" placeholder="Descrição do menu" required>${restaurant.menu || ""}</textarea>

      <div class="card-row" style="margin-top:18px;">
        <button type="submit" class="btn">Salvar alterações</button>
        <button type="button" class="btn-secondary btn-close-inline-editor" data-id="${restaurant.id}">Fechar edição</button>
      </div>
    </form>
  `;
}

function bindRestaurantActions() {
  document.querySelectorAll(".btn-toggle-edit-restaurant").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      const editor = document.getElementById(`restaurant-editor-${id}`);

      if (!editor) return;

      document.querySelectorAll(".restaurant-inline-editor").forEach((item) => {
        if (item !== editor) item.classList.remove("active");
      });

      editor.classList.toggle("active");
    });
  });

  document.querySelectorAll(".btn-close-inline-editor").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      document.getElementById(`restaurant-editor-${id}`)?.classList.remove("active");
    });
  });

  document.querySelectorAll(".restaurantInlineEditForm").forEach((editForm) => {
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const restaurantId = Number(editForm.dataset.id);
      const currentRestaurant = getRestaurantById(restaurantId);

      if (!currentRestaurant || Number(currentRestaurant.ownerId) !== Number(user.id)) return;

      const updatedRestaurant = {
        ...currentRestaurant,
        name: editForm.name.value.trim(),
        category: editForm.category.value.trim(),
        city: editForm.city.value.trim(),
        openingHours: editForm.openingHours.value.trim(),
        priceRange: editForm.priceRange.value.trim(),
        coverImage: editForm.coverImage.value.trim(),
        dishImage: editForm.dishImage.value.trim(),
        description: editForm.description.value.trim(),
        menu: editForm.menu.value.trim(),
        photos: splitList(editForm.photos.value),
        availableTimes: splitList(editForm.availableTimes.value)
      };

      updateRestaurant(updatedRestaurant);

      renderRestaurants();
      renderTableRestaurantOptions();
      renderReviews();

      showToast("Restaurante atualizado com sucesso.", "success");
    });
  });

  document.querySelectorAll(".btn-delete-restaurant").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = Number(button.dataset.id);

      const confirmed = await confirmAction({
        title: "Danger zone: excluir restaurante",
        message: "Tem certeza que deseja excluir este restaurante? Essa ação não poderá ser desfeita.",
        confirmText: "Excluir definitivamente",
        cancelText: "Cancelar",
        danger: true
      });

      if (!confirmed) return;

      deleteRestaurant(id);

      renderRestaurants();
      renderTableRestaurantOptions();
      renderTableManager();
      renderReviews();

      showToast("Restaurante removido com sucesso.", "danger");
    });
  });
}

/* =========================
   GERENCIAR MESAS
========================= */

function renderTableRestaurantOptions() {
  if (!tableRestaurantSelect) return;

  const restaurants = getRestaurantsByOwner(user.id);
  const currentValue = tableRestaurantSelect.value;

  tableRestaurantSelect.innerHTML = `
    <option value="">Selecione um restaurante</option>
    ${restaurants.map((restaurant) => `
      <option value="${restaurant.id}">
        ${restaurant.name}
      </option>
    `).join("")}
  `;

  if (currentValue && restaurants.some((restaurant) => Number(restaurant.id) === Number(currentValue))) {
    tableRestaurantSelect.value = currentValue;
  }
}

function renderTableManager() {
  if (!tableManagerArea || !tableRestaurantSelect) return;

  const restaurantId = Number(tableRestaurantSelect.value);

  if (!restaurantId) {
    tableManagerArea.innerHTML = `
      <div class="empty-state">
        Selecione um restaurante para gerenciar as mesas.
      </div>
    `;
    return;
  }

  const restaurant = getRestaurantById(restaurantId);

  if (!restaurant || Number(restaurant.ownerId) !== Number(user.id)) {
    tableManagerArea.innerHTML = `
      <div class="empty-state">
        Restaurante não encontrado.
      </div>
    `;
    return;
  }

  tableManagerArea.innerHTML = `
    <div class="table-manager-layout">
      <div class="card">
        <h3>Cadastrar nova mesa</h3>

        <form id="tableCreateForm">
          <div class="form-grid">
            <input type="text" id="tableNumber" placeholder="Número da mesa" required />
            <input type="number" id="tableCapacity" placeholder="Capacidade" min="1" required />
            <input type="text" id="tableLocation" placeholder="Localização" required />
          </div>

          <button type="submit" class="btn" style="margin-top:14px;">
            Adicionar mesa
          </button>
        </form>
      </div>

      <div class="card">
        <h3>Mesas cadastradas - ${restaurant.name}</h3>

        <div id="tableList" class="table-manager-list">
          ${buildTablesList(restaurant)}
        </div>
      </div>
    </div>
  `;

  bindTableManagerActions(restaurant);
}

function buildTablesList(restaurant) {
  if (!(restaurant.tables || []).length) {
    return `
      <div class="empty-state">
        Nenhuma mesa cadastrada.
      </div>
    `;
  }

  return restaurant.tables.map((table) => `
    <div class="table-manager-card">
      <div>
        <strong>Mesa ${table.number}</strong>
        <p>Capacidade: ${table.capacity} pessoas</p>
        <p>Localização: ${table.location}</p>
      </div>

      <div class="card-row">
        <button
          class="btn-secondary btn-edit-table"
          data-restaurant-id="${restaurant.id}"
          data-table-id="${table.id}"
        >
          Editar
        </button>

        <button
          class="btn-danger-outline btn-delete-table"
          data-restaurant-id="${restaurant.id}"
          data-table-id="${table.id}"
        >
          Excluir
        </button>
      </div>
    </div>
  `).join("");
}

function bindTableManagerActions(restaurant) {
  const tableCreateForm = document.getElementById("tableCreateForm");

  if (tableCreateForm) {
    tableCreateForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const updatedRestaurant = getRestaurantById(restaurant.id);

      const table = {
        id: Date.now(),
        number: getValue("tableNumber"),
        capacity: Number(getValue("tableCapacity")),
        location: getValue("tableLocation")
      };

      updatedRestaurant.tables = [...(updatedRestaurant.tables || []), table];

      updateRestaurant(updatedRestaurant);

      renderRestaurants();
      renderTableManager();

      showToast("Mesa cadastrada com sucesso.", "success");
    });
  }

  document.querySelectorAll(".btn-edit-table").forEach((button) => {
    button.addEventListener("click", () => {
      openEditTableModal(
        Number(button.dataset.restaurantId),
        Number(button.dataset.tableId)
      );
    });
  });

  document.querySelectorAll(".btn-delete-table").forEach((button) => {
    button.addEventListener("click", async () => {
      const restaurantId = Number(button.dataset.restaurantId);
      const tableId = Number(button.dataset.tableId);

      const restaurant = getRestaurantById(restaurantId);

      const confirmed = await confirmAction({
        title: "Excluir mesa",
        message: "Tem certeza que deseja excluir esta mesa?",
        confirmText: "Excluir",
        cancelText: "Cancelar",
        danger: true
      });

      if (!confirmed) return;

      restaurant.tables = (restaurant.tables || []).filter(
        (table) => Number(table.id) !== Number(tableId)
      );

      updateRestaurant(restaurant);

      renderRestaurants();
      renderTableManager();

      showToast("Mesa excluída com sucesso.", "danger");
    });
  });
}

if (tableRestaurantSelect) {
  tableRestaurantSelect.addEventListener("change", renderTableManager);
}

/* =========================
   EDITAR MESA
========================= */

if (closeTableEditModal) {
  closeTableEditModal.addEventListener("click", () => {
    tableEditModal.style.display = "none";
  });
}

if (tableEditForm) {
  tableEditForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const restaurantId = Number(getValue("editTableRestaurantId"));
    const tableId = Number(getValue("editTableId"));
    const restaurant = getRestaurantById(restaurantId);

    if (!restaurant || Number(restaurant.ownerId) !== Number(user.id)) return;

    restaurant.tables = (restaurant.tables || []).map((table) => {
      if (Number(table.id) !== Number(tableId)) return table;

      return {
        ...table,
        capacity: Number(getValue("editTableCapacity")),
        location: getValue("editTableLocation")
      };
    });

    updateRestaurant(restaurant);

    tableEditModal.style.display = "none";

    renderRestaurants();
    renderTableManager();

    showToast("Mesa atualizada com sucesso.", "success");
  });
}

function openEditTableModal(restaurantId, tableId) {
  const restaurant = getRestaurantById(restaurantId);

  if (!restaurant || Number(restaurant.ownerId) !== Number(user.id)) return;

  const table = (restaurant.tables || []).find(
    (item) => Number(item.id) === Number(tableId)
  );

  if (!table) return;

  setValue("editTableRestaurantId", restaurantId);
  setValue("editTableId", tableId);
  setValue("editTableNumber", table.number);
  setValue("editTableCapacity", table.capacity);
  setValue("editTableLocation", table.location);

  tableEditModal.style.display = "flex";
}

/* =========================
   AVALIAÇÕES
========================= */

function getUserPhoto(userId) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const foundUser = users.find((item) => Number(item.id) === Number(userId));

  return foundUser?.photo || "";
}

function renderReviews() {
  if (!reviewList) return;

  const ownerRestaurants = getRestaurantsByOwner(user.id);
  const ownerRestaurantNames = ownerRestaurants.map((restaurant) => restaurant.name);

  const reviews = getReviews().filter((review) =>
    ownerRestaurantNames.includes(review.restaurant)
  );

  reviewList.innerHTML = "";

  if (!reviews.length) {
    reviewList.innerHTML = `
      <div class="empty-state">
        Nenhuma avaliação recebida.
      </div>
    `;
    return;
  }

  reviews.forEach((review) => {
    const card = document.createElement("div");
    card.className = "review-card";

    const initial = review.userName?.[0]?.toUpperCase() || "U";
    const photo = getUserPhoto(review.userId);

    card.innerHTML = `
      <div class="review-user-row">
        <span class="review-avatar">
          ${
            photo
              ? `<img src="${photo}" alt="Foto de ${review.userName}">`
              : initial
          }
        </span>

        <div>
          <strong>${review.userName}</strong>
          <div style="margin-top:4px;">${"⭐".repeat(review.rating)}</div>
        </div>
      </div>

      <p style="margin-top:12px;">
        <strong>Restaurante:</strong> ${review.restaurant}
      </p>

      <p>${review.comment || "Sem comentário."}</p>
    `;

    reviewList.appendChild(card);
  });
}

/* =========================
   UTILS
========================= */

function getValue(id) {
  return document.getElementById(id)?.value.trim() || "";
}

function setValue(id, value) {
  const element = document.getElementById(id);
  if (element) element.value = value;
}

function splitList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function escapeValue(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

renderRestaurants();
renderTableRestaurantOptions();
renderTableManager();
renderReviews();