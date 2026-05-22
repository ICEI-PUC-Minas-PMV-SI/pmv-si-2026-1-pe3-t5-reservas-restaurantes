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
const restaurantCreatePanel = document.getElementById("restaurantCreatePanel");
const openCreateRestaurantBtn = document.getElementById("openCreateRestaurantBtn");
const closeCreateRestaurantBtn = document.getElementById("closeCreateRestaurantBtn");

const tableRestaurantSelect = document.getElementById("tableRestaurantSelect");
const tableManagerArea = document.getElementById("tableManagerArea");

const tableEditModal = document.getElementById("tableEditModal");
const tableEditForm = document.getElementById("tableEditForm");
const closeTableEditModal = document.getElementById("closeTableEditModal");

const RESTAURANT_CATEGORIES = [
  "Brasileira",
  "Italiana",
  "Japonesa",
  "Mexicana",
  "Hamburgueria",
  "Pizzaria",
  "Vegetariana",
  "Contemporânea"
];

const PRICE_RANGE_OPTIONS = [
  { value: "$", label: "$ - Econômico" },
  { value: "$$", label: "$$ - Moderado" },
  { value: "$$$", label: "$$$ - Premium" },
  { value: "$$$$", label: "$$$$ - Especial" }
];

const TIME_OPTIONS = buildTimeOptions();

if (userName) {
  userName.innerText = user.firstName;
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedUser");
    window.location.href = "../auth/login.html";
  });
}

bindTimeSelects(document);
bindListEditors(document);
bindCreateRestaurantControls();

/* =========================
   REGISTER RESTAURANT
========================= */

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const availableTimes = sortTimes(parseListValue(getValue("restaurantAvailableTimes")));

    if (!availableTimes.length) {
      showToast("Adicione pelo menos um horário de reserva.", "danger");
      return;
    }

    const restaurantData = {
      id: Date.now(),
      ownerId: user.id,
      ownerName: `${user.firstName} ${user.lastName}`,
      ownerEmail: user.email,
      name: getValue("restaurantName"),
      category: getValue("restaurantCategory"),
      city: getValue("restaurantCity"),
      openingHours: buildOpeningHours(
        getValue("restaurantOpeningTime"),
        getValue("restaurantClosingTime")
      ),
      priceRange: getValue("restaurantPriceRange"),
      coverImage: getValue("restaurantCoverImage"),
      dishImage: getValue("restaurantDishImage"),
      description: getValue("restaurantDescription"),
      menu: getValue("restaurantMenu"),
      photos: parseListValue(getValue("restaurantPhotos")),
      availableTimes,
      tables: [],
      rating: "Novo"
    };

    saveRestaurant(restaurantData);

    form.reset();
    resetListEditors(form);
    hideCreateRestaurantPanel();

    renderRestaurants();
    renderTableRestaurantOptions();
    renderReviews();
    emitRestaurantUpdate();

    showToast("Restaurante cadastrado com sucesso.", "success");
  });
}

/* =========================
   RESTAURANTS
========================= */

function renderRestaurants() {
  const restaurants = getRestaurantsByOwner(user.id);

  if (!restaurantList) return;

  restaurantList.innerHTML = "";
  restaurantList.className = "admin-restaurant-grid";

  if (!restaurants.length) {
    restaurantList.innerHTML = `
      <div class="empty-state admin-empty-restaurant-state">
        <strong>Nenhum restaurante cadastrado.</strong>
        <p>Crie seu primeiro restaurante para começar a cadastrar mesas, receber reservas e acompanhar relatórios.</p>
        <button class="btn btn-open-create-restaurant" type="button">
          Criar restaurante
        </button>
      </div>
    `;
    bindCreateRestaurantButtons();
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

  bindTimeSelects(restaurantList);
  bindListEditors(restaurantList);
  bindRestaurantActions();
  bindCreateRestaurantButtons();
}

/**
 * Binds the static create restaurant controls.
 *
 * @returns {void}
 */
function bindCreateRestaurantControls() {
  openCreateRestaurantBtn?.addEventListener("click", showCreateRestaurantPanel);
  closeCreateRestaurantBtn?.addEventListener("click", hideCreateRestaurantPanel);
}

/**
 * Binds create restaurant buttons rendered inside dynamic content.
 *
 * @returns {void}
 */
function bindCreateRestaurantButtons() {
  document.querySelectorAll(".btn-open-create-restaurant").forEach((button) => {
    button.addEventListener("click", showCreateRestaurantPanel);
  });
}

/**
 * Shows the restaurant creation panel.
 *
 * @returns {void}
 */
function showCreateRestaurantPanel() {
  if (!restaurantCreatePanel) return;

  restaurantCreatePanel.classList.add("active");
  restaurantCreatePanel.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

/**
 * Hides the restaurant creation panel.
 *
 * @returns {void}
 */
function hideCreateRestaurantPanel() {
  restaurantCreatePanel?.classList.remove("active");
}

function buildRestaurantEditForm(restaurant) {
  const hours = parseOpeningHours(restaurant.openingHours);

  return `
    <form class="restaurantInlineEditForm" data-id="${restaurant.id}">
      <div class="admin-section-header" style="margin-bottom:16px;">
        <h2 style="font-size:22px;">Editar ${restaurant.name}</h2>
        <p>Atualize as informações principais deste restaurante.</p>
      </div>

      <div class="form-grid">
        <label class="form-field">
          <span>Nome do restaurante</span>
          <input type="text" name="name" value="${escapeValue(restaurant.name)}" placeholder="Nome do restaurante" required />
        </label>

        <label class="form-field">
          <span>Categoria</span>
          <select name="category" required>
            ${buildCategoryOptions(restaurant.category)}
          </select>
        </label>

        <label class="form-field">
          <span>Cidade</span>
          <input type="text" name="city" value="${escapeValue(restaurant.city)}" placeholder="Cidade" required />
        </label>

        <label class="form-field">
          <span>Faixa de preço</span>
          <select name="priceRange" required>
            ${buildPriceRangeOptions(restaurant.priceRange)}
          </select>
        </label>

        <label class="form-field">
          <span>Abertura</span>
          <select name="openingTime" data-time-select data-selected-time="${escapeValue(hours.openingTime)}" required>
            <option value="">Selecione a abertura</option>
          </select>
        </label>

        <label class="form-field">
          <span>Fechamento</span>
          <select name="closingTime" data-time-select data-selected-time="${escapeValue(hours.closingTime)}" required>
            <option value="">Selecione o fechamento</option>
          </select>
        </label>

        <label class="form-field">
          <span>Imagem de capa</span>
          <input type="url" name="coverImage" value="${escapeValue(restaurant.coverImage)}" placeholder="URL da imagem de capa" required />
        </label>

        <label class="form-field">
          <span>Imagem de prato ou experiência</span>
          <input type="url" name="dishImage" value="${escapeValue(restaurant.dishImage || "")}" placeholder="URL da imagem de prato/experiência" />
        </label>

        ${buildListEditor({
          label: "Fotos extras",
          fieldName: "photos",
          inputType: "url",
          placeholder: "Cole uma URL de foto por vez",
          values: restaurant.photos || [],
          addText: "Adicionar foto",
          emptyText: "Nenhuma foto extra adicionada."
        })}

        ${buildListEditor({
          label: "Horários de reserva",
          fieldName: "availableTimes",
          inputType: "time-select",
          values: restaurant.availableTimes || [],
          addText: "Adicionar horário",
          emptyText: "Adicione pelo menos um horário de reserva."
        })}
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

      const formFields = editForm.elements;
      const availableTimes = sortTimes(parseListValue(formFields.availableTimes.value));

      if (!availableTimes.length) {
        showToast("Adicione pelo menos um horário de reserva.", "danger");
        return;
      }

      const updatedRestaurant = {
        ...currentRestaurant,
        name: formFields.name.value.trim(),
        category: formFields.category.value,
        city: formFields.city.value.trim(),
        openingHours: buildOpeningHours(
          formFields.openingTime.value,
          formFields.closingTime.value
        ),
        priceRange: formFields.priceRange.value,
        coverImage: formFields.coverImage.value.trim(),
        dishImage: formFields.dishImage.value.trim(),
        description: formFields.description.value.trim(),
        menu: formFields.menu.value.trim(),
        photos: parseListValue(formFields.photos.value),
        availableTimes
      };

      updateRestaurant(updatedRestaurant);

      renderRestaurants();
      renderTableRestaurantOptions();
      renderReviews();
      emitRestaurantUpdate();

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
      emitRestaurantUpdate();

      showToast("Restaurante removido com sucesso.", "danger");
    });
  });
}

/* =========================
   TABLE MANAGEMENT
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
      emitRestaurantUpdate();

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
      emitRestaurantUpdate();

      showToast("Mesa excluída com sucesso.", "danger");
    });
  });
}

if (tableRestaurantSelect) {
  tableRestaurantSelect.addEventListener("change", renderTableManager);
}

/* =========================
   EDIT TABLE
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
    emitRestaurantUpdate();

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
   REVIEWS
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

/**
 * Reads and trims an input value by id.
 *
 * @param {string} id - Element id.
 * @returns {string} Trimmed input value.
 */
function getValue(id) {
  return document.getElementById(id)?.value.trim() || "";
}

/**
 * Sets an input value by id when the element exists.
 *
 * @param {string} id - Element id.
 * @param {string|number} value - Value to apply to the input.
 * @returns {void}
 */
function setValue(id, value) {
  const element = document.getElementById(id);
  if (element) element.value = value;
}

/**
 * Builds the display value for opening hours.
 *
 * @param {string} openingTime - Opening time in HH:mm format.
 * @param {string} closingTime - Closing time in HH:mm format.
 * @returns {string} Human-readable opening hours.
 */
function buildOpeningHours(openingTime, closingTime) {
  return `${openingTime} às ${closingTime}`;
}

/**
 * Extracts opening and closing times from a saved opening-hours string.
 *
 * @param {string} openingHours - Saved opening-hours label.
 * @returns {{openingTime: string, closingTime: string}} Parsed time values.
 */
function parseOpeningHours(openingHours = "") {
  const matches = String(openingHours).match(/(\d{2}:\d{2}).*?(\d{2}:\d{2})/);

  return {
    openingTime: matches?.[1] || "",
    closingTime: matches?.[2] || ""
  };
}

/**
 * Builds category option markup while preserving legacy custom values.
 *
 * @param {string} selectedValue - Current restaurant category.
 * @returns {string} Option elements for a category select.
 */
function buildCategoryOptions(selectedValue = "") {
  const hasKnownValue = RESTAURANT_CATEGORIES.includes(selectedValue);
  const legacyOption = selectedValue && !hasKnownValue
    ? `<option value="${escapeValue(selectedValue)}" selected>${selectedValue}</option>`
    : "";

  return `
    <option value="">Selecione uma categoria</option>
    ${legacyOption}
    ${RESTAURANT_CATEGORIES.map((category) => `
      <option value="${category}" ${category === selectedValue ? "selected" : ""}>
        ${category}
      </option>
    `).join("")}
  `;
}

/**
 * Builds price range option markup while preserving legacy values.
 *
 * @param {string} selectedValue - Current price range.
 * @returns {string} Option elements for a price-range select.
 */
function buildPriceRangeOptions(selectedValue = "") {
  const hasKnownValue = PRICE_RANGE_OPTIONS.some((option) => option.value === selectedValue);
  const legacyOption = selectedValue && !hasKnownValue
    ? `<option value="${escapeValue(selectedValue)}" selected>${selectedValue}</option>`
    : "";

  return `
    <option value="">Selecione a faixa</option>
    ${legacyOption}
    ${PRICE_RANGE_OPTIONS.map((option) => `
      <option value="${option.value}" ${option.value === selectedValue ? "selected" : ""}>
        ${option.label}
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
 * Fills time selects with 24-hour labels and keeps any selected value.
 *
 * @param {ParentNode} root - Root node containing time selects.
 * @returns {void}
 */
function bindTimeSelects(root) {
  root.querySelectorAll("[data-time-select]").forEach((select) => {
    const currentValue = select.dataset.selectedTime || select.value;
    const placeholder = select.querySelector("option[value='']")?.textContent || "Selecione um horário";

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

/**
 * Builds a reusable add-one-item list editor.
 *
 * @param {Object} config - List editor configuration.
 * @param {string} config.label - Field label.
 * @param {string} config.fieldName - Hidden input name.
 * @param {string} config.inputType - Input type for new items.
 * @param {string} [config.placeholder] - Placeholder for new items.
 * @param {Array<string>} [config.values] - Current list values.
 * @param {string} config.addText - Add button label.
 * @param {string} config.emptyText - Empty list message.
 * @returns {string} List editor markup.
 */
function buildListEditor({
  label,
  fieldName,
  inputType,
  placeholder = "",
  values = [],
  addText,
  emptyText
}) {
  const controlMarkup = inputType === "time-select"
    ? `
        <select data-list-input data-time-select>
          <option value="">Selecione um horário</option>
        </select>
      `
    : `<input type="${inputType}" data-list-input placeholder="${escapeValue(placeholder)}" />`;

  return `
    <div class="form-list-editor form-grid-full" data-list-editor data-empty-text="${escapeValue(emptyText)}">
      <label>${label}</label>

      <div class="inline-add-control">
        ${controlMarkup}
        <button type="button" class="btn-secondary" data-list-add>${addText}</button>
      </div>

      <input type="hidden" name="${fieldName}" data-list-hidden value="${escapeValue(JSON.stringify(values))}" />
      <div class="pill-list" data-list-output></div>
    </div>
  `;
}

/**
 * Binds add and remove behavior for every list editor inside a root element.
 *
 * @param {ParentNode} root - Root node containing list editors.
 * @returns {void}
 */
function bindListEditors(root) {
  root.querySelectorAll("[data-list-editor]").forEach((editor) => {
    if (editor.dataset.bound === "true") {
      renderListEditor(editor);
      return;
    }

    editor.dataset.bound = "true";

    editor.querySelector("[data-list-add]")?.addEventListener("click", () => {
      addListEditorValue(editor);
    });

    editor.querySelector("[data-list-input]")?.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;

      event.preventDefault();
      addListEditorValue(editor);
    });

    editor.addEventListener("click", (event) => {
      const removeButton = event.target.closest("[data-list-remove]");
      if (!removeButton) return;

      const values = getListEditorValues(editor);
      values.splice(Number(removeButton.dataset.listRemove), 1);
      setListEditorValues(editor, values);
    });

    renderListEditor(editor);
  });
}

/**
 * Adds the current input value to a list editor.
 *
 * @param {HTMLElement} editor - List editor element.
 * @returns {void}
 */
function addListEditorValue(editor) {
  const input = editor.querySelector("[data-list-input]");
  const value = input?.value.trim();

  if (!value) return;

  const values = getListEditorValues(editor);

  if (!values.includes(value)) {
    values.push(value);
  }

  input.value = "";
  setListEditorValues(editor, values);
}

/**
 * Reads list values from an editor hidden input.
 *
 * @param {HTMLElement} editor - List editor element.
 * @returns {Array<string>} Current editor values.
 */
function getListEditorValues(editor) {
  return parseListValue(editor.querySelector("[data-list-hidden]")?.value || "[]");
}

/**
 * Stores list values in an editor and refreshes its visible pills.
 *
 * @param {HTMLElement} editor - List editor element.
 * @param {Array<string>} values - Values to store.
 * @returns {void}
 */
function setListEditorValues(editor, values) {
  const hidden = editor.querySelector("[data-list-hidden]");
  const input = editor.querySelector("[data-list-input]");
  const normalizedValues = input?.dataset.timeSelect !== undefined ? sortTimes(values) : values;

  if (hidden) {
    hidden.value = JSON.stringify(normalizedValues);
  }

  renderListEditor(editor);
}

/**
 * Renders visible pills for a list editor.
 *
 * @param {HTMLElement} editor - List editor element.
 * @returns {void}
 */
function renderListEditor(editor) {
  const output = editor.querySelector("[data-list-output]");
  const values = getListEditorValues(editor);

  if (!output) return;

  if (!values.length) {
    output.innerHTML = `<span class="pill-list-empty">${editor.dataset.emptyText || "Nenhum item adicionado."}</span>`;
    return;
  }

  output.innerHTML = values.map((value, index) => `
    <span class="list-pill">
      <span>${escapeValue(value)}</span>
      <button type="button" data-list-remove="${index}" aria-label="Remover ${escapeValue(value)}">&times;</button>
    </span>
  `).join("");
}

/**
 * Clears every list editor inside a form.
 *
 * @param {ParentNode} root - Root node containing list editors.
 * @returns {void}
 */
function resetListEditors(root) {
  root.querySelectorAll("[data-list-editor]").forEach((editor) => {
    setListEditorValues(editor, []);
  });
}

/**
 * Parses list values stored as JSON, falling back to legacy comma text.
 *
 * @param {string} value - Serialized list value.
 * @returns {Array<string>} Parsed list values.
 */
function parseListValue(value) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => String(item).trim())
        .filter(Boolean);
    }
  } catch (error) {
    return splitList(value);
  }

  return splitList(value);
}

/**
 * Splits a legacy comma-separated list.
 *
 * @param {string} value - Comma-separated value.
 * @returns {Array<string>} Parsed list values.
 */
function splitList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Sorts time strings in ascending order.
 *
 * @param {Array<string>} values - Time values.
 * @returns {Array<string>} Sorted time values.
 */
function sortTimes(values) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

/**
 * Emits a page-level restaurant update event.
 *
 * @returns {void}
 */
function emitRestaurantUpdate() {
  window.dispatchEvent(new Event("restaurantsUpdated"));
}

/**
 * Escapes text for safe HTML interpolation.
 *
 * @param {string} [value=""] - Text to escape.
 * @returns {string} Escaped text.
 */
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
