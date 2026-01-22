// Window management system
let dragOffsetX, dragOffsetY, activeWindow;

function startDrag(e, el) {
  activeWindow = el.closest('.app-window');
  const rect = activeWindow.getBoundingClientRect();
  dragOffsetX = e.clientX - rect.left;
  dragOffsetY = e.clientY - rect.top;
  
  document.addEventListener('mousemove', dragWindow);
  document.addEventListener('mouseup', stopDrag);
  
  focusWindow(activeWindow);
}

function dragWindow(e) {
  if (!activeWindow) return;
  
  let newX = e.clientX - dragOffsetX;
  let newY = e.clientY - dragOffsetY;
  
  // Prevent dragging outside the viewport
  newX = Math.max(0, Math.min(window.innerWidth - activeWindow.offsetWidth, newX));
  newY = Math.max(0, Math.min(window.innerHeight - activeWindow.offsetHeight, newY));
  
  activeWindow.style.left = `${newX}px`;
  activeWindow.style.top = `${newY}px`;
  
  // Show snap areas when dragging near edges
  handleSnapZones(e, newX, newY);
}

function stopDrag() {
  document.removeEventListener('mousemove', dragWindow);
  document.removeEventListener('mouseup', stopDrag);
  hideSnapZones();
  activeWindow = null;
}

// Window snapping functionality
function handleSnapZones(e, x, y) {
  if (!activeWindow) return;
  
  // Create snap indicators if they don't exist
  createSnapZones();
  
  const windowRect = activeWindow.getBoundingClientRect();
  const windowWidth = windowRect.width;
  const windowHeight = windowRect.height;
  
  // Check if near screen edges
  const snapThreshold = 30;
  
  // Near left edge
  if (x < snapThreshold) {
    showSnapZone('left');
  } 
  // Near right edge
  else if (x + windowWidth > window.innerWidth - snapThreshold) {
    showSnapZone('right');
  }
  // Near top (maximized)
  else if (y < snapThreshold) {
    showSnapZone('top');
  }
  // Reset if not near any edge
  else {
    hideSnapZones();
  }
  
  // Apply snap on mouseup
  document.addEventListener('mouseup', snapWindow, { once: true });
}

function snapWindow() {
  if (!activeWindow) return;
  
  const windowRect = activeWindow.getBoundingClientRect();
  const x = windowRect.left;
  const y = windowRect.top;
  const snapThreshold = 30;
  
  // Get visible snap zone
  const visibleZone = document.querySelector('.snap-zone:not(.hidden)');
  if (!visibleZone) return;
  
  // Apply based on zone id
  const zoneId = visibleZone.id;
  
  switch(zoneId) {
    case 'snap-left':
      activeWindow.style.left = '0';
      activeWindow.style.top = '0';
      activeWindow.style.width = '50%';
      activeWindow.style.height = '100%';
      break;
    case 'snap-right':
      activeWindow.style.left = '50%';
      activeWindow.style.top = '0';
      activeWindow.style.width = '50%';
      activeWindow.style.height = '100%';
      break;
    case 'snap-top':
      maximizeApp(activeWindow.id);
      break;
  }
  
  hideSnapZones();
}

function createSnapZones() {
  if (document.getElementById('snap-zones')) return;
  
  const snapZones = document.createElement('div');
  snapZones.id = 'snap-zones';
  
  // Create left, right, and top snap zones
  const zones = ['left', 'right', 'top'];
  
  zones.forEach(zone => {
    const snapZone = document.createElement('div');
    snapZone.id = `snap-${zone}`;
    snapZone.className = 'snap-zone hidden';
    
    // Add preview image for each zone
    const preview = document.createElement('div');
    preview.className = 'snap-preview';
    snapZone.appendChild(preview);
    
    snapZones.appendChild(snapZone);
  });
  
  document.body.appendChild(snapZones);
}

function showSnapZone(zone) {
  hideSnapZones();
  const snapZone = document.getElementById(`snap-${zone}`);
  if (snapZone) {
    snapZone.classList.remove('hidden');
  }
}

function hideSnapZones() {
  const zones = document.querySelectorAll('.snap-zone');
  zones.forEach(zone => zone.classList.add('hidden'));
}

function setupResizeHandles() {
  const windows = document.querySelectorAll('.app-window');
  
  windows.forEach(win => {
    if (win.querySelector('.resize-handle')) return;
    
    // Create resize handles for each corner and edge
    const positions = ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'];
    
    positions.forEach(pos => {
      const handle = document.createElement('div');
      handle.className = `resize-handle resize-${pos}`;
      handle.addEventListener('mousedown', e => {
        e.stopPropagation();
        startResize(e, win, pos);
      });
      win.appendChild(handle);
    });
  });
}

let resizePosition, initialWidth, initialHeight, initialX, initialY;

function startResize(e, win, position) {
  e.preventDefault();
  focusWindow(win);
  
  resizePosition = position;
  initialWidth = win.offsetWidth;
  initialHeight = win.offsetHeight;
  initialX = win.offsetLeft;
  initialY = win.offsetTop;
  
  const initialMouseX = e.clientX;
  const initialMouseY = e.clientY;
  
  function resize(e) {
    const dx = e.clientX - initialMouseX;
    const dy = e.clientY - initialMouseY;
    
    // Apply width/height changes based on which handle was grabbed
    if (position.includes('e')) {
      win.style.width = `${initialWidth + dx}px`;
    }
    if (position.includes('w')) {
      win.style.width = `${initialWidth - dx}px`;
      win.style.left = `${initialX + dx}px`;
    }
    if (position.includes('s')) {
      win.style.height = `${initialHeight + dy}px`;
    }
    if (position.includes('n')) {
      win.style.height = `${initialHeight - dy}px`;
      win.style.top = `${initialY + dy}px`;
    }
  }
  
  function stopResize() {
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
  }
  
  document.addEventListener('mousemove', resize);
  document.addEventListener('mouseup', stopResize);
}

function launchApp(id) {
  const app = document.getElementById(id);
  
  if (app.style.display === 'block') {
    focusWindow(app);
    return;
  }
  
  app.style.display = 'block';
  app.style.zIndex = getTopZIndex() + 1;
  
  if (!app.style.left) {
    app.style.left = `${window.innerWidth / 2 - 350}px`;
    app.style.top = `${window.innerHeight / 2 - 250}px`;
  }
  
  if (!document.getElementById(`task-${id}`)) {
    let icon;
    switch(id) {
      case 'about': icon = 'user'; break;
      case 'projects': icon = 'laptop-code'; break;
      case 'contact': icon = 'envelope'; break;
      case 'terminal': icon = 'terminal'; break;
      default: icon = 'window-maximize';
    }
    
    const btn = document.createElement('button');
    btn.id = `task-${id}`;
    btn.className = 'task-btn active';
    btn.innerHTML = `<i class="fas fa-${icon}"></i> ${id.charAt(0).toUpperCase() + id.slice(1)}`;
    btn.onclick = () => toggleApp(id);
    document.getElementById('task-items').appendChild(btn);
  } else {
    document.getElementById(`task-${id}`).classList.add('active');
  }
  
  focusWindow(app);
}

function toggleApp(id) {
  const app = document.getElementById(id);
  const taskBtn = document.getElementById(`task-${id}`);
  
  if (app.style.display === 'none') {
    app.style.display = 'block';
    taskBtn.classList.add('active');
    focusWindow(app);
  } else if (app === getActiveWindow()) {
    minimizeApp(id);
  } else {
    focusWindow(app);
  }
}

function minimizeApp(id) {
  const win = document.getElementById(id);
  win.style.display = 'none';
  document.getElementById(`task-${id}`).classList.remove('active');
}

function closeApp(id) {
  const win = document.getElementById(id);
  win.style.display = 'none';
  
  const taskBtn = document.getElementById(`task-${id}`);
  if (taskBtn) {
    taskBtn.remove();
  }
  
  if (id.startsWith('win-proj')) {
    win.remove();
  }
}

function maximizeApp(id) {
  const win = document.getElementById(id);
  
  if (win.classList.contains('maximized')) {
    win.classList.remove('maximized');
  } else {
    win.classList.add('maximized');
  }
}

function getActiveWindow() {
  let activeWindow = null;
  let topZ = 0;
  
  document.querySelectorAll('.app-window').forEach(win => {
    if (win.style.display === 'block') {
      const z = parseInt(win.style.zIndex || 0);
      if (z > topZ) {
        topZ = z;
        activeWindow = win;
      }
    }
  });
  
  return activeWindow;
}

function focusWindow(win) {
  document.querySelectorAll('.task-btn').forEach(btn => btn.classList.remove('active'));
  
  const id = win.id;
  const taskBtn = document.getElementById(`task-${id}`);
  if (taskBtn) {
    taskBtn.classList.add('active');
  }
  
  win.style.zIndex = getTopZIndex() + 1;
}

function getTopZIndex() {
  let topZ = 999;
  document.querySelectorAll('.app-window').forEach(win => {
    const z = parseInt(win.style.zIndex || 0);
    if (z > topZ) topZ = z;
  });
  return topZ;
}

function toggleStartMenu() {
  const menu = document.getElementById('start-menu');
  if (menu.style.display === 'block') {
    menu.style.display = 'none';
  } else {
    menu.style.display = 'block';
    document.addEventListener('click', closeStartMenu);
  }
}

function closeStartMenu(e) {
  const menu = document.getElementById('start-menu');
  const button = document.getElementById('start-menu-button');
  
  if (!menu.contains(e.target) && e.target !== button) {
    menu.style.display = 'none';
    document.removeEventListener('click', closeStartMenu);
  }
}

export { 
  startDrag, 
  dragWindow, 
  stopDrag, 
  setupResizeHandles, 
  launchApp, 
  toggleApp, 
  minimizeApp, 
  closeApp, 
  maximizeApp, 
  focusWindow, 
  toggleStartMenu, 
  closeStartMenu 
}; 