export class Reservation {
  constructor({
    userId = null,
    userName,
    userEmail = "",
    userPhone = "",
    customerFirstName = "",
    customerLastName = "",
    customerContact = "",
    customerType = "registered",
    restaurantId,
    restaurantName,
    tableId,
    tableNumber,
    date,
    time,
    people
  }) {
    this.id = Date.now();

    this.userId = userId;
    this.userName = userName;
    this.userEmail = userEmail;
    this.userPhone = userPhone;

    this.customerFirstName = customerFirstName;
    this.customerLastName = customerLastName;
    this.customerContact = customerContact;
    this.customerType = customerType;

    this.restaurantId = restaurantId;
    this.restaurantName = restaurantName;
    this.tableId = tableId;
    this.tableNumber = tableNumber;

    this.date = date;
    this.time = time;
    this.people = Number(people);

    this.status = "pendente confirmação";
    this.createdAt = new Date().toISOString();
  }
}