const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const sections = document.querySelectorAll('section');
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const contactForm = document.getElementById('contactForm');
const typedTextElement = document.querySelector('.typed-text');

const typedTextStrings = ['Cybersecurity & Penetration Testing', 'Game Development', 'UI/UX Design'];
let currentStringIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingDelay = 200;

function typeEffect() {
    const currentString = typedTextStrings[currentStringIndex];
    
    typingDelay = isDeleting ? 100 : 200;
    
    if (!isDeleting && currentCharIndex < currentString.length) {
        typedTextElement.textContent = currentString.substring(0, currentCharIndex + 1);
        currentCharIndex++;
    } else if (isDeleting && currentCharIndex > 0) {
        typedTextElement.textContent = currentString.substring(0, currentCharIndex - 1);
        currentCharIndex--;
    } else if (currentCharIndex === 0 && isDeleting) {
        isDeleting = false;
        currentStringIndex = (currentStringIndex + 1) % typedTextStrings.length;
    } else if (currentCharIndex === currentString.length && !isDeleting) {
        typingDelay = 1500;
        isDeleting = true;
    }
    
    setTimeout(typeEffect, typingDelay);
}

function toggleNav() {
    navLinks.classList.toggle('active');
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function highlightNavOnScroll() {
    let scrollPosition = window.scrollY;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelector(`.nav-links a[href="#${sectionId}"]`).classList.add('active');
        } else {
            document.querySelector(`.nav-links a[href="#${sectionId}"]`).classList.remove('active');
        }
    });
}

function filterPortfolio() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === itemCategory) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = 1;
                        item.style.transform = 'scale(1)';
                    }, 200);
                } else {
                    item.style.opacity = 0;
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 500);
                }
            });
        });
    });
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.about-content, .portfolio-item, .skill-item, .service-item, .contact-item');
    
    const revealCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1
    });
    
    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
}

function animateSkills() {
    const skillLevels = document.querySelectorAll('.skill-level');
    
    const animateCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                
                entry.target.style.width = '0%';
                
                setTimeout(() => {
                    entry.target.style.transition = 'width 1s ease-in-out';
                    entry.target.style.width = width;
                }, 200);
                
                skillObserver.unobserve(entry.target);
            }
        });
    };
    
    const skillObserver = new IntersectionObserver(animateCallback, {
        threshold: 0.1
    });
    
    skillLevels.forEach(level => {
        skillObserver.observe(level);
    });
}

function handleFormSubmit() {
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            const formResponse = document.createElement('div');
            formResponse.className = 'form-response success';
            formResponse.innerHTML = `<p>Thanks ${name}! Your message has been sent successfully.</p>`;
            
            contactForm.style.opacity = 0;
            setTimeout(() => {
                contactForm.parentNode.appendChild(formResponse);
                contactForm.reset();
                contactForm.style.opacity = 1;
                
                setTimeout(() => {
                    formResponse.style.opacity = 0;
                    setTimeout(() => {
                        formResponse.remove();
                    }, 500);
                }, 5000);
            }, 500);
            
            console.log('Form submitted:', { name, email, subject, message });
        });
    }
}

function initParticleBackground() {
    const heroSection = document.getElementById('home');
    
    const canvas = document.createElement('canvas');
    canvas.className = 'particles-canvas';
    
    heroSection.insertBefore(canvas, heroSection.firstChild);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = heroSection.offsetHeight;
    
    const particlesArray = [];
    const numberOfParticles = 100;
    const colors = ['#4a6de5', '#7b92f0', '#ff6b6b', '#ffffff'];
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.speedY = -this.speedY;
            }
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    function createParticles() {
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = particlesArray[i].color;
                    ctx.globalAlpha = 0.2;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
        
        requestAnimationFrame(animateParticles);
    }
    
    createParticles();
    animateParticles();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = heroSection.offsetHeight;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (typedTextElement) {
        setTimeout(typeEffect, 1000);
    }
    
    if (navToggle) {
        navToggle.addEventListener('click', toggleNav);
    }
    
    initSmoothScrolling();
    
    filterPortfolio();
    
    initScrollReveal();
    
    animateSkills();
    
    handleFormSubmit();
    
    initParticleBackground();
    
    window.addEventListener('scroll', highlightNavOnScroll);
});

