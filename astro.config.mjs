import { defineConfig } from 'astro/config';

import cloudflare from "@astrojs/cloudflare";

// Set this to your live URL (used for canonical + OG links).
// This MUST match the deployment you actually share with people, or canonical
// tags and OG previews will point at the wrong place. Update it here if you
// later connect a custom domain.
export default defineConfig({
  site: 'https://happycppd-github-io.ashtonang77.workers.dev',

  build: {
    // Clean directory-style URLs: /projects/ instead of /projects.html
    format: 'directory',
  },

  adapter: cloudflare()
});