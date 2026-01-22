import { initBootScreen } from './components/bootScreen.js';
import { startDrag, toggleStartMenu, closeStartMenu, launchApp, minimizeApp, maximizeApp, closeApp, toggleApp } from './components/windowManager.js';
import { handleTerminal } from './components/terminalManager.js';
import { showNotification, closeNotification } from './components/notifications.js';
import { initTheme, toggleTheme } from './components/themeManager.js';
import { initWallpaper, createWallpaperSelector } from './components/wallpaperManager.js';
import { setupProjectFilters, populateProjects } from './components/projectsManager.js';

window.startDrag = startDrag;
window.toggleStartMenu = toggleStartMenu;
window.closeStartMenu = closeStartMenu;
window.launchApp = launchApp;
window.minimizeApp = minimizeApp;
window.maximizeApp = maximizeApp;
window.closeApp = closeApp;
window.toggleApp = toggleApp;
window.handleTerminal = handleTerminal;
window.showNotification = showNotification;
window.closeNotification = closeNotification;
window.toggleTheme = toggleTheme;
window.createWallpaperSelector = createWallpaperSelector;

window.onload = async () => {
  initBootScreen();
  initTheme();
  initWallpaper();
  setupProjectFilters();
  await populateProjects();
};