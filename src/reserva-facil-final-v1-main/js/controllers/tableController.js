import { getTables, saveTable, deleteTable } from "../services/tableService.js";

const form = document.getElementById("tableForm");
const list = document.getElementById("adminTables");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const table = {
      id: Date.now(),
      number: document.getElementById("tableNumber").value.trim(),
      capacity: document.getElementById("tableCapacity").value.trim(),
      location: document.getElementById("tableLocation").value.trim()
    };

    saveTable(table);
    form.reset();
    alert("Mesa cadastrada com sucesso.");
    renderTables();
  });
}

function renderTables() {
  if (!list) return;

  const tables = getTables();
  list.innerHTML = "";

  if (tables.length === 0) {
    list.innerHTML = "<p class='muted-text'>Nenhuma mesa cadastrada.</p>";
    return;
  }

  tables.forEach(table => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="restaurant-title">Mesa ${table.number}</div>
      <div class="restaurant-meta">Capacidade: ${table.capacity} pessoas</div>
      <div class="restaurant-meta">Localização: ${table.location}</div>

      <div class="card-row">
        <button class="btn-secondary btn-delete-table" data-id="${table.id}">
          Excluir mesa
        </button>
      </div>
    `;

    list.appendChild(card);
  });

  bindDeleteButtons();
}

function bindDeleteButtons() {
  const buttons = document.querySelectorAll(".btn-delete-table");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      deleteTable(id);
      renderTables();
      alert("Mesa removida com sucesso.");
    });
  });
}

renderTables();