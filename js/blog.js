const BLOG_POSTS = [
    {
        title: "Lab Notes: Building an Asynchronous Chatroom with WebSockets",
        excerpt: "As part of my journey into cybersecurity, I wanted to really understand how data moves back and forth in real-time. Before I can secure a network, I need to know how to build one.",
        date: "April 2025",
        category: "Lab Notes",
        tags: ["Python", "WebSockets", "Networking", "Asyncio"],
        featured: true,
        link: "posts/async-chatroom.html"
    }
];

function createBlogCard(post, isFeatured = false) {
    const card = document.createElement('div');
    card.className = `blog-card fade-in${isFeatured ? ' blog-featured' : ''}`;

    const tagsHtml = post.tags && post.tags.length > 0
        ? `<div class="blog-tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`
        : '';

    const featuredBadge = isFeatured ? '<span class="featured-badge">Featured</span>' : '';

    card.innerHTML = `
        <div class="blog-card-content">
            ${featuredBadge}
            <div class="blog-card-meta">
                <span class="blog-date">${post.date}</span>
                <span class="blog-category">${post.category}</span>
            </div>
            <h2><a href="${post.link}">${post.title}</a></h2>
            <p class="blog-excerpt">${post.excerpt}</p>
            ${tagsHtml}
            <a href="${post.link}" class="blog-read-more">Read more &rarr;</a>
        </div>
    `;

    return card;
}

function renderBlogPosts() {
    const blogGrid = document.getElementById('blog-grid');
    const blogEmpty = document.getElementById('blog-empty');

    if (!blogGrid) return;

    blogGrid.innerHTML = '';

    if (BLOG_POSTS.length === 0) {
        blogGrid.style.display = 'none';
        if (blogEmpty) blogEmpty.style.display = 'block';
        return;
    }

    blogGrid.style.display = 'grid';
    if (blogEmpty) blogEmpty.style.display = 'none';

    BLOG_POSTS.forEach((post, index) => {
        const isFeatured = post.featured && index === BLOG_POSTS.findIndex(p => p.featured);
        const card = createBlogCard(post, isFeatured);
        blogGrid.appendChild(card);
    });

    initBlogAnimations();
}

function initBlogAnimations() {
    const fadeElements = document.querySelectorAll('.blog-card.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(element => observer.observe(element));
}

document.addEventListener('DOMContentLoaded', () => {
    renderBlogPosts();
});
