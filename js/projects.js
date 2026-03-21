function initProjectHoverEffects() {
    document.querySelectorAll('.project-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.boxShadow = '0 8px 30px rgba(100, 255, 218, 0.1)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.boxShadow = 'none';
        });
    });
}

function initStaggerAnimation() {
    document.querySelectorAll('.project-item.fade-in').forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });
}

function initTagFilter() {
    document.querySelectorAll('.project-tech .tag').forEach(tag => {
        tag.style.cursor = 'default';
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'scale(1.05)';
        });
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'scale(1)';
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initProjectHoverEffects();
    initStaggerAnimation();
    initTagFilter();
});
