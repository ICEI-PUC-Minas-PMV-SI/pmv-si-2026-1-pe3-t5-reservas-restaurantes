const form = document.getElementById("publicSearchForm");
const publicDate = document.getElementById("publicDate");

setMinDate();

function setMinDate() {
  const today = new Date().toISOString().split("T")[0];

  if (publicDate) {
    publicDate.min = today;
  }
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