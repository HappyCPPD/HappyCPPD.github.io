// Projects management system
import projectsPromise from '../data/projects.js';

let projects = [];

// Load projects when the module initializes
projectsPromise.then(loadedProjects => {
    projects = loadedProjects;
    populateProjects(); // Populate projects after they are loaded
});
import { focusWindow } from './windowManager.js';

function setupProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      populateProjects(btn.getAttribute('data-filter'));
    });
  });
}

function populateProjects(filter = 'all') {
  const container = document.getElementById('project-list');
  container.innerHTML = '';
  
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);
    
  filteredProjects.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card animate-in';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="project-info">
        <h4>${p.name}</h4>
        <p>${p.summary}</p>
        <span class="project-tag">${p.category}</span>
      </div>
    `;
    card.onclick = () => openProjectWindow(p);
    container.appendChild(card);
  });
}

function openProjectWindow(project) {
  const existingWindow = document.getElementById(`win-proj-${project.id}`);
  
  if (existingWindow) {
    existingWindow.style.display = 'block';
    focusWindow(existingWindow);
    return;
  }
  
  const win = document.createElement('div');
  win.id = `win-proj-${project.id}`;
  win.className = 'app-window';
  win.innerHTML = `
    <div class="title-bar" onmousedown="window.startDrag(event, this)">
      <div class="window-icon"><i class="fas fa-laptop-code"></i></div>
      <span>${project.name}</span>
      <div class="window-controls">
        <button onclick="window.minimizeApp('win-proj-${project.id}')"><i class="fas fa-window-minimize"></i></button>
        <button onclick="window.maximizeApp('win-proj-${project.id}')"><i class="fas fa-window-maximize"></i></button>
        <button onclick="window.closeApp('win-proj-${project.id}')"><i class="fas fa-times"></i></button>
      </div>
    </div>
    <div class="content">
      <div class="project-detail-container">
        <div class="project-detail-header">
          <img src="${project.img}" alt="${project.name}">
          <div>
            <h2>${project.name}</h2>
            <p class="subtitle">Category: ${project.category}</p>
            ${project.github_link ? `<a href="${project.github_link}" target="_blank" class="github-link"><i class="fab fa-github"></i> View on GitHub</a>` : ''}
          </div>
        </div>
        <div class="project-detail-content">
          <p>${project.details}</p>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(win);
  
  // Position the window and add it to the taskbar
  win.style.left = `${window.innerWidth / 2 - 350}px`;
  win.style.top = `${window.innerHeight / 2 - 250}px`;
  win.style.display = 'block';
  
  // Create taskbar button
  const taskBtn = document.createElement('button');
  taskBtn.id = `task-win-proj-${project.id}`;
  taskBtn.className = 'task-btn active';
  taskBtn.innerHTML = `<i class="fas fa-laptop-code"></i> ${project.name}`;
  taskBtn.onclick = () => window.toggleApp(`win-proj-${project.id}`);
  document.getElementById('task-items').appendChild(taskBtn);
  
  focusWindow(win);
}

export { setupProjectFilters, populateProjects, openProjectWindow }; 