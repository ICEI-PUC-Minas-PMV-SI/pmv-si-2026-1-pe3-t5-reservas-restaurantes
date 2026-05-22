const accordionButtons = document.querySelectorAll(".accordion-toggle");

accordionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".accordion-card");
    if (!card) return;

    card.classList.toggle("active");
  });
});