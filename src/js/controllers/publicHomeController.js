const form = document.getElementById("publicSearchForm");
const publicDate = document.getElementById("publicDate");
const TIME_OPTIONS = buildTimeOptions();

bindTimeSelects(document);
setMinDate();

/**
 * Prevents home searches for dates before today.
 *
 * @returns {void}
 */
function setMinDate() {
  const today = new Date().toISOString().split("T")[0];

  if (publicDate) {
    publicDate.min = today;
  }
}

/**
 * Builds standardized 24-hour time options.
 *
 * @returns {string[]} Available time values.
 */
function buildTimeOptions() {
  const options = [];

  for (let hour = 6; hour <= 23; hour += 1) {
    ["00", "30"].forEach((minute) => {
      options.push(`${String(hour).padStart(2, "0")}:${minute}`);
    });
  }

  return options;
}

/**
 * Replaces time select contents with the standardized time options.
 *
 * @param {Document|HTMLElement} root - Scope where time selects are searched.
 * @returns {void}
 */
function bindTimeSelects(root = document) {
  root.querySelectorAll("[data-time-select]").forEach((select) => {
    const currentValue = select.value;
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

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const location = document.getElementById("publicLocation").value.trim();
    const date = document.getElementById("publicDate").value;
    const time = document.getElementById("publicTime").value;
    const people = document.getElementById("publicPeople").value;

    const params = new URLSearchParams({
      location,
      date,
      time,
      people
    });

    window.location.href = `./pages/discover.html?${params.toString()}`;
  });
}
