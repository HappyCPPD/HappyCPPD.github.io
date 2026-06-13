import { defineConfig } from 'astro/config';

// Set this to your live URL (used for canonical + OG links).
// Start with your Cloudflare Pages URL, e.g. 'https://ashton-portfolio.pages.dev',
// then switch to your custom domain once it's connected.
export default defineConfig({
  site: 'https://ashton-portfolio.pages.dev',
  build: {
    // Clean directory-style URLs: /projects/ instead of /projects.html
    format: 'directory',
  },
});
