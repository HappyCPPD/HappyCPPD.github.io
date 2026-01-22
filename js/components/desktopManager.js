// Desktop initialization and management
import projects from '../data/projects.js';
import { showNotification } from './notifications.js';
import { setupProjectFilters, populateProjects, openProjectWindow } from './projectsManager.js';
import { setupResizeHandles } from './windowManager.js';

function initDesktop() {
  populateProjects('all');
  
  updateDateTime();
  setInterval(updateDateTime, 1000);
  
  setupProjectFilters();
  
  setTimeout(() => showNotification(), 1500);
  
  setupResizeHandles();
  
  positionWindows();
}

function updateDateTime() {
  const now = new Date();
  const datetimeElement = document.getElementById('datetime');
  
  // Date formatter
  const dateOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric'
  };
  
  // Time formatter
  const timeOptions = { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit', 
    hour12: true 
  };
  
  const dateStr = now.toLocaleDateString('en-SG', dateOptions);
  const timeStr = now.toLocaleTimeString('en-SG', timeOptions);
  
  // Create a more detailed view with HTML
  datetimeElement.innerHTML = `
    <div class="datetime-container">
      <div class="time">${timeStr}</div>
      <div class="date">${dateStr}</div>
    </div>
  `;
}

function positionWindows() {
  document.querySelectorAll('.app-window').forEach(win => {
    if (!win.style.left) {
      win.style.left = `${window.innerWidth / 2 - 350}px`;
      win.style.top = `${window.innerHeight / 2 - 250}px`;
    }
  });
}

export { initDesktop, updateDateTime, positionWindows }; 