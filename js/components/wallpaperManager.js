// Wallpaper manager
const WALLPAPER_KEY = 'portfolio-wallpaper-preference';

// Collection of wallpapers
const wallpapers = [
  {
    id: 'default',
    name: 'Default',
    url: 'https://images.unsplash.com/photo-1621947081720-86970823b77a?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1621947081720-86970823b77a?auto=format&fit=crop&w=300&q=80',
    darkTheme: true
  },
  {
    id: 'light',
    name: 'Rainbow Clouds',
    url: 'https://images.unsplash.com/photo-1558470598-a5dda9640f68?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1558470598-a5dda9640f68?auto=format&fit=crop&w=300&q=80',
    darkTheme: false
  },
  {
    id: 'space',
    name: 'Space',
    url: 'https://images.unsplash.com/photo-1501862700950-18382cd41497?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1501862700950-18382cd41497?auto=format&fit=crop&w=300&q=80',
    darkTheme: true
  },
  {
    id: 'city',
    name: 'City',
    url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=300&q=80',
    darkTheme: true
  },
  {
    id: 'forest',
    name: 'Forest',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=80',
    darkTheme: true
  }
];

// Initialize wallpaper from localStorage
function initWallpaper() {
  // Check localStorage for saved preference
  const savedWallpaperId = localStorage.getItem(WALLPAPER_KEY);
  
  if (savedWallpaperId) {
    const wallpaper = wallpapers.find(w => w.id === savedWallpaperId);
    if (wallpaper) {
      setWallpaper(wallpaper);
    }
  }
}

// Set wallpaper
function setWallpaper(wallpaper) {
  document.body.style.backgroundImage = `url('${wallpaper.url}')`;
  localStorage.setItem(WALLPAPER_KEY, wallpaper.id);
}

// Create wallpaper selector window
function createWallpaperSelector() {
  // Check if a wallpaper window already exists
  if (document.getElementById('wallpaper-selector')) {
    document.getElementById('wallpaper-selector').style.display = 'block';
    return;
  }
  
  const wallpaperWindow = document.createElement('div');
  wallpaperWindow.id = 'wallpaper-selector';
  wallpaperWindow.className = 'app-window';
  wallpaperWindow.innerHTML = `
    <div class="title-bar" onmousedown="window.startDrag(event, this)">
      <div class="window-icon"><i class="fas fa-image"></i></div>
      <span>Wallpaper Selector</span>
      <div class="window-controls">
        <button onclick="window.minimizeApp('wallpaper-selector')"><i class="fas fa-window-minimize"></i></button>
        <button onclick="window.maximizeApp('wallpaper-selector')"><i class="fas fa-window-maximize"></i></button>
        <button onclick="window.closeApp('wallpaper-selector')"><i class="fas fa-times"></i></button>
      </div>
    </div>
    <div class="content">
      <h3>Choose a Wallpaper</h3>
      <div class="wallpaper-grid"></div>
    </div>
  `;
  
  document.body.appendChild(wallpaperWindow);
  
  // Position the window
  wallpaperWindow.style.left = `${window.innerWidth / 2 - 350}px`;
  wallpaperWindow.style.top = `${window.innerHeight / 2 - 250}px`;
  wallpaperWindow.style.display = 'block';
  wallpaperWindow.style.width = '700px';
  wallpaperWindow.style.height = '500px';
  
  // Create taskbar button
  const taskBtn = document.createElement('button');
  taskBtn.id = `task-wallpaper-selector`;
  taskBtn.className = 'task-btn active';
  taskBtn.innerHTML = `<i class="fas fa-image"></i> Wallpapers`;
  taskBtn.onclick = () => window.toggleApp('wallpaper-selector');
  document.getElementById('task-items').appendChild(taskBtn);
  
  // Populate wallpapers
  populateWallpapers();
  
  // Focus the window
  window.focusWindow(wallpaperWindow);
}

// Populate wallpaper grid
function populateWallpapers() {
  const grid = document.querySelector('.wallpaper-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  
  wallpapers.forEach(wallpaper => {
    const item = document.createElement('div');
    item.className = 'wallpaper-item';
    item.innerHTML = `
      <div class="wallpaper-preview">
        <img src="${wallpaper.thumbnail}" alt="${wallpaper.name}">
      </div>
      <div class="wallpaper-name">${wallpaper.name}</div>
    `;
    
    // Click handler
    item.addEventListener('click', () => {
      setWallpaper(wallpaper);
      
      // Set active class on selected wallpaper
      document.querySelectorAll('.wallpaper-item').forEach(el => {
        el.classList.remove('active');
      });
      item.classList.add('active');
    });
    
    // Check if current wallpaper
    const currentWallpaperId = localStorage.getItem(WALLPAPER_KEY);
    if (currentWallpaperId === wallpaper.id) {
      item.classList.add('active');
    }
    
    grid.appendChild(item);
  });
}

export { initWallpaper, createWallpaperSelector }; 