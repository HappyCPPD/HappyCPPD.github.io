// Boot Screen initialization
import { initDesktop } from './desktopManager.js';

export function initBootScreen() {
  const welcomeText = "Welcome To My Portfolio";
  const loadingText = "Loading Portfolio...";
  const bootScreen = document.getElementById('boot-screen');
  const welcomeEl = document.querySelector('#boot-screen h1');
  const loadingEl = document.querySelector('#boot-screen p');
  
  if (!welcomeEl || !loadingEl) {
    // If elements don't exist, skip boot screen
    setTimeout(() => {
      if (bootScreen) bootScreen.style.display = 'none';
      document.getElementById('desktop').style.display = 'flex';
      initDesktop();
    }, 500);
    return;
  }
  
  welcomeEl.textContent = '';
  loadingEl.textContent = '';
  
  let i = 0;
  const typeWelcome = setInterval(() => {
    if (i < welcomeText.length) {
      welcomeEl.textContent += welcomeText.charAt(i);
      i++;
    } else {
      clearInterval(typeWelcome);
      typeLoading();
    }
  }, 100);
  
  function typeLoading() {
    let j = 0;
    const typeLoad = setInterval(() => {
      if (j < loadingText.length) {
        loadingEl.textContent += loadingText.charAt(j);
        j++;
      } else {
        clearInterval(typeLoad);
        setTimeout(() => {
          bootScreen.style.animation = 'fadeOut 1s ease forwards';
          setTimeout(() => {
            bootScreen.style.display = 'none';
            document.getElementById('desktop').style.display = 'flex';
            initDesktop();
          }, 1000);
        }, 2000);
      }
    }, 50);
  }
}
