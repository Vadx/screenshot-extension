// Content script for showing notifications
function showNotification(message, type = 'info') {
  // Remove any existing notifications
  const existing = document.getElementById('screenshot-notification');
  if (existing) {
    existing.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.id = 'screenshot-notification';
  notification.textContent = message;
  
  // Style the notification
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;

  // Add animation keyframes
  if (!document.getElementById('screenshot-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'screenshot-notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Add to page
  document.body.appendChild(notification);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 3000);
}

// Listen for keyboard shortcuts as backup
document.addEventListener('keydown', (event) => {
  // Check for Shift+Cmd+I (Mac) or Shift+Ctrl+I (Windows/Linux)
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const correctModifier = isMac ? event.metaKey : event.ctrlKey;
  
  if (event.shiftKey && correctModifier && event.code === 'KeyI') {
    event.preventDefault();
    // This will be handled by the background script through chrome.commands
  }
});

// Make showNotification available globally
window.showNotification = showNotification;