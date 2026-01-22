const THEME_KEY = 'portfolio-theme-preference';

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDarkMode ? 'dark' : 'light');
  }
  
  createThemeToggle();
}

function createThemeToggle() {
  const taskbar = document.getElementById('taskbar');
  const datetime = document.getElementById('datetime');
  
  const themeToggle = document.createElement('div');
  themeToggle.id = 'theme-toggle';
  themeToggle.className = 'theme-toggle';
  themeToggle.innerHTML = `
    <i class="fas fa-sun"></i>
    <i class="fas fa-moon"></i>
  `;
  
  themeToggle.addEventListener('click', toggleTheme);
  
  taskbar.insertBefore(themeToggle, datetime);
  
  updateToggleState();
}

function toggleTheme() {
  const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  setTheme(newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
}

function setTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }
  
  updateToggleState();
}

function updateToggleState() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  
  const isLight = document.body.classList.contains('light-theme');
  
  toggle.classList.toggle('light-active', isLight);
  toggle.classList.toggle('dark-active', !isLight);
}

export { initTheme, toggleTheme };