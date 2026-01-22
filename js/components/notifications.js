// Notification system
function showNotification(message = 'Welcome to my portfolio!', icon = 'info-circle') {
  const notification = document.getElementById('notification');
  const text = notification.querySelector('.notification-text');
  const iconEl = notification.querySelector('.notification-icon');
  
  text.textContent = message;
  iconEl.className = `notification-icon fas fa-${icon}`;
  
  notification.style.display = 'flex';
  
  setTimeout(() => {
    closeNotification();
  }, 5000);
}

function closeNotification() {
  const notification = document.getElementById('notification');
  notification.style.display = 'none';
}

export { showNotification, closeNotification }; 