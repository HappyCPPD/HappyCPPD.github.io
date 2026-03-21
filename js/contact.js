const COOLDOWN_SECONDS = 60;
const STORAGE_KEY = 'lastFormSubmit';

function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (!form) return;

    checkCooldown();

    form.addEventListener('submit', (e) => {
        const remainingTime = getRemainingCooldown();
        if (remainingTime > 0) {
            e.preventDefault();
            showFormMessage(`Please wait ${remainingTime} seconds before sending another message.`, 'error');
            return;
        }

        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        if (!data.name || !data.email || !data.message) {
            e.preventDefault();
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }

        if (!isValidEmail(data.email)) {
            e.preventDefault();
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        localStorage.setItem(STORAGE_KEY, Date.now().toString());
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
    });
}

function getRemainingCooldown() {
    const lastSubmit = localStorage.getItem(STORAGE_KEY);
    if (!lastSubmit) return 0;

    const elapsed = (Date.now() - parseInt(lastSubmit)) / 1000;
    const remaining = Math.ceil(COOLDOWN_SECONDS - elapsed);
    return remaining > 0 ? remaining : 0;
}

function checkCooldown() {
    const submitBtn = document.getElementById('submit-btn');
    const cooldownNote = document.getElementById('cooldown-note');

    if (!submitBtn || !cooldownNote) return;

    const remaining = getRemainingCooldown();

    if (remaining > 0) {
        submitBtn.disabled = true;
        cooldownNote.style.display = 'block';
        cooldownNote.textContent = `You can send another message in ${remaining} seconds.`;

        const interval = setInterval(() => {
            const newRemaining = getRemainingCooldown();
            if (newRemaining <= 0) {
                clearInterval(interval);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                cooldownNote.style.display = 'none';
            } else {
                cooldownNote.textContent = `You can send another message in ${newRemaining} seconds.`;
            }
        }, 1000);
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormMessage(message, type) {
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) existingMessage.remove();

    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 8px;
        text-align: center;
        animation: fadeIn 0.3s ease;
        ${type === 'success'
            ? 'background: rgba(100, 255, 218, 0.1); color: #64ffda; border: 1px solid rgba(100, 255, 218, 0.3);'
            : 'background: rgba(255, 100, 100, 0.1); color: #ff6464; border: 1px solid rgba(255, 100, 100, 0.3);'
        }
    `;

    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.parentNode.insertBefore(messageEl, submitBtn.nextSibling);
    }

    setTimeout(() => {
        messageEl.style.opacity = '0';
        messageEl.style.transition = 'opacity 0.3s ease';
        setTimeout(() => messageEl.remove(), 300);
    }, 5000);
}

function initContactLinkEffects() {
    document.querySelectorAll('.contact-link').forEach(link => {
        const icon = link.querySelector('.contact-link-icon');

        link.addEventListener('mouseenter', () => {
            if (icon) {
                icon.style.transform = 'scale(1.1)';
                icon.style.background = 'rgba(100, 255, 218, 0.2)';
            }
        });

        link.addEventListener('mouseleave', () => {
            if (icon) {
                icon.style.transform = 'scale(1)';
                icon.style.background = 'rgba(100, 255, 218, 0.1)';
            }
        });
    });
}

function initInputEffects() {
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        const label = input.previousElementSibling;

        input.addEventListener('focus', () => {
            if (label) label.style.color = '#64ffda';
        });

        input.addEventListener('blur', () => {
            if (label) label.style.color = '#a0a0a0';
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initContactForm();
    initContactLinkEffects();
    initInputEffects();
});
