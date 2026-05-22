/**
 * Shows a transient feedback message in a fixed toast container.
 *
 * @param {string} message - Message displayed to the user.
 * @param {string} [type="success"] - Visual style applied to the toast.
 * @returns {void}
 */
export function showToast(message, type = "success") {
  const container = getToastContainer();
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

/**
 * Returns the shared toast container, creating it when needed.
 *
 * @returns {HTMLElement} Fixed toast container element.
 */
function getToastContainer() {
  let container = document.querySelector(".toast-container");

  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  return container;
}

/**
 * Opens a confirmation modal and resolves with the user's choice.
 *
 * @param {Object} options - Modal copy and visual configuration.
 * @param {string} [options.title="Confirmar ação"] - Modal title.
 * @param {string} [options.message="Tem certeza que deseja continuar?"] - Modal message.
 * @param {string} [options.confirmText="Confirmar"] - Confirm button label.
 * @param {string} [options.cancelText="Cancelar"] - Cancel button label.
 * @param {boolean} [options.danger=false] - Whether the action is destructive.
 * @returns {Promise<boolean>} Whether the user confirmed the action.
 */
export function confirmAction({
  title = "Confirmar ação",
  message = "Tem certeza que deseja continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  danger = false
}) {
  return new Promise((resolve) => {
    const modal = document.createElement("div");
    modal.className = `modal ${danger ? "confirm-modal-danger" : ""}`;
    modal.style.display = "flex";

    modal.innerHTML = `
      <div class="modal-content">
        <h3>${title}</h3>

        <p class="muted-text" style="margin: 12px 0 22px;">
          ${message}
        </p>

        <div class="modal-actions">
          <button id="confirmActionBtn" class="${danger ? "btn-danger-solid" : "btn"}">
            ${confirmText}
          </button>

          <button id="cancelActionBtn" class="btn-secondary">
            ${cancelText}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector("#confirmActionBtn").addEventListener("click", () => {
      modal.remove();
      resolve(true);
    });

    modal.querySelector("#cancelActionBtn").addEventListener("click", () => {
      modal.remove();
      resolve(false);
    });

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.remove();
        resolve(false);
      }
    });
  });
}
