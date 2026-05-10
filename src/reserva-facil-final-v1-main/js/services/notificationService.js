const NOTIFICATIONS_KEY = "notifications";

export function getNotifications() {
  return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY)) || [];
}

export function saveNotifications(notifications) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

export function createNotification(notification) {
  const notifications = getNotifications();

  const newNotification = {
    id: Date.now(),
    read: false,
    createdAt: new Date().toISOString(),
    ...notification
  };

  notifications.push(newNotification);
  saveNotifications(notifications);

  return newNotification;
}