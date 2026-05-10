export function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

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