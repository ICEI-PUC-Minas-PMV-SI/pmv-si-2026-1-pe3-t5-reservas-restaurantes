import { getReviews } from "../services/reviewService.js";

const user = JSON.parse(localStorage.getItem("loggedUser"));
const myReviews = document.getElementById("myReviews");

renderMyReviews();

function getUserPhoto(userId) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const foundUser = users.find((item) => Number(item.id) === Number(userId));

  return foundUser?.photo || "";
}

function renderMyReviews() {
  if (!myReviews || !user) return;

  const reviews = getReviews().filter(
    (review) => Number(review.userId) === Number(user.id)
  );

  if (!reviews.length) {
    myReviews.innerHTML = `
      <div class="empty-state">
        Você ainda não enviou avaliações.
      </div>
    `;
    return;
  }

  myReviews.innerHTML = reviews.map((review) => {
    const photo = getUserPhoto(review.userId);
    const initial = review.userName?.[0]?.toUpperCase() || "U";

    return `
      <div class="review-card">
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
            <div>${"⭐".repeat(review.rating)}</div>
          </div>
        </div>

        <p style="margin-top:12px;">
          <strong>Restaurante:</strong> ${review.restaurant}
        </p>

        <p>${review.comment || "Sem comentário."}</p>
      </div>
    `;
  }).join("");
}