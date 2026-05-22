const RESERVATIONS_KEY = "reservations";

export function getReservations() {
  return JSON.parse(localStorage.getItem(RESERVATIONS_KEY)) || [];
}

export function saveReservations(reservations) {
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
}

export function saveReservation(reservation) {
  const reservations = getReservations();

  const newReservation = {
    ...reservation,
    id: reservation.id || Date.now(),
    status: reservation.status || "pendente confirmação"
  };

  reservations.push(newReservation);
  saveReservations(reservations);

  return newReservation;
}

export function getUserReservations(userId) {
  return getReservations().filter((reservation) => reservation.userId === userId);
}

export function getReservationsByRestaurantOwner(ownerId, restaurants) {
  const restaurantIds = restaurants.map((restaurant) => restaurant.id);

  return getReservations().filter((reservation) =>
    restaurantIds.includes(reservation.restaurantId)
  );
}

export function updateReservationStatus(id, status) {
  const reservations = getReservations();

  const updatedReservations = reservations.map((reservation) => {
    if (Number(reservation.id) !== Number(id)) return reservation;

    return {
      ...reservation,
      status
    };
  });

  saveReservations(updatedReservations);

  return updatedReservations.find((reservation) => Number(reservation.id) === Number(id));
}

export function cancelReservation(id) {
  return updateReservationStatus(id, "cancelada");
}

export function getReservationByRestaurantDateTime(restaurantId, date, time) {
  return getReservations().filter((reservation) => {
    const sameRestaurant = Number(reservation.restaurantId) === Number(restaurantId);
    const sameDate = reservation.date === date;
    const sameTime = time ? reservation.time === time : true;

    const occupiesTable =
      reservation.status === "pendente confirmação" ||
      reservation.status === "confirmada";

    return sameRestaurant && sameDate && sameTime && occupiesTable;
  });
}

export function isPastReservationDateTime(date, time) {
  if (!date || !time) return false;

  const selectedDateTime = new Date(`${date}T${time}`);
  const now = new Date();

  return selectedDateTime < now;
}