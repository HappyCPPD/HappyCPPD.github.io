# Deploying your portfolio to Cloudflare Pages

A step-by-step guide for **this Astro project**, starting from "it's only on my computer."

Your project folder: `C:\Users\Ashton\Claude\Projects\Portfolio Main`

What you'll need (all free):

- A **Cloudflare account** — sign up at https://dash.cloudflare.com/sign-up
- A **GitHub account** (for the recommended path) — https://github.com/signup
- **Node.js** installed (you already have it)

---

## Step 1 — Put your résumé on the site (PDF)

Your site's "Résumé" button links to `/resume.pdf`, so the file has to be a PDF named `resume.pdf` inside the `public` folder. Here's how to turn the new résumé into that file:

1. Open `Ashton-Ang-Resume.html` (in your project folder) in your browser — double-click it.
2. Press **Ctrl + P** to open Print.
3. Set **Destination** to **Save as PDF**.
4. Set **Paper size** to **Letter** and **Margins** to **Default**.
5. Make sure **Headers and footers** is **unchecked** (so no date/URL prints on it).
6. Click **Save**, name the file **`resume.pdf`**, and save it into:
   `C:\Users\Ashton\Claude\Projects\Portfolio Main\public\`
   Replace the existing `resume.pdf` when asked.

Check it worked: in the project folder, run `npm run dev`, open http://localhost:4321, and click **Résumé**. It should open your new résumé.

> When the sandbox is back, I can also generate this PDF (and an editable .docx) for you automatically so you don't have to print it by hand.

---

## Step 2 — Choose how to deploy

There are two ways. **Path A is recommended** because every time you save a change, your live site updates automatically.

| | Path A — GitHub + Pages | Path B — Direct upload (Wrangler) |
|---|---|---|
| Auto-deploy on every change | Yes | No (you run a command each time) |
| Needs a GitHub account | Yes | No |
| Best for | Almost everyone | Quick one-off, or if you don't want GitHub |

Pick one and follow it below.

---

## Path A — GitHub + Cloudflare Pages (recommended)

### A1. Get your code onto GitHub

Open a terminal in your project folder (in the folder, type `cmd` in the address bar and press Enter, or use Git Bash). Then run these one at a time:

```bash
git init
git add .
git commit -m "Initial portfolio"
```

Now create an empty repo on GitHub:

1. Go to https://github.com/new
2. Name it something like `portfolio` (keep it **Public** or **Private**, your choice).
3. **Do not** tick "Add a README" / .gitignore / license — leave it empty.
4. Click **Create repository**.

GitHub then shows a "push an existing repository" command. Copy the two lines it gives you, which look like this (replace the URL with yours):

```bash
git remote add origin https://github.com/HappyCPPD/portfolio.git
git branch -M main
git push -u origin main
```

> Your code is now on GitHub. A note on safety: your contact form's Web3Forms `access_key` is **meant** to be public, so it's fine that it's in the code. Don't add any private passwords or API secrets to the repo.

### A2. Connect Cloudflare Pages to the repo

1. Go to https://dash.cloudflare.com and sign in.
2. In the left sidebar, click **Workers & Pages**.
3. Click **Create** → choose the **Pages** tab → **Connect to Git**.
4. Authorize Cloudflare to access your GitHub, then **select your `portfolio` repo**.

### A3. Build settings (important — use these exactly)

| Setting | Value |
|---|---|
| Framework preset | **Astro** |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(leave default / blank)* |

Then expand **Environment variables (advanced)** and add one:

| Variable name | Value |
|---|---|
| `NODE_VERSION` | `20` |

(Astro 5 needs a modern Node; Cloudflare's default can be too old, and this prevents a confusing build failure.)

### A4. Deploy

Click **Save and Deploy**. Cloudflare installs your packages, runs the build, and publishes the site. After ~1–2 minutes you'll get a URL like:

`https://portfolio-xxx.pages.dev` (or `https://ashton-portfolio.pages.dev` if that name is free)

**From now on:** every time you `git push`, Cloudflare rebuilds and redeploys automatically.

---

## Path B — Direct upload with Wrangler (no GitHub)

In a terminal in your project folder:

```bash
npm install
npm run build
npx wrangler pages deploy dist --project-name=ashton-portfolio
```

- The first time, Wrangler opens your browser to log in to Cloudflare — approve it (you do the clicking).
- It uploads the `dist` folder and gives you your `.pages.dev` URL.
- **To update the site later**, just run the last two lines again (`npm run build`, then the `wrangler pages deploy` command).

---

## Step 3 — Verify after the first deploy

1. **Open your new URL** and click through Home, Projects, Blog, Contact, and Résumé.
2. **Check your security headers** (this is the fun part for a cybersecurity portfolio): paste your URL into https://securityheaders.com. Because you already have a `public/_headers` file, you should score an **A or A+**. If you get an F, the `_headers` file didn't make it into `dist` — confirm it's at `public/_headers` and redeploy.
3. **Fix the canonical URL if needed.** Your `astro.config.mjs` currently says:
   `site: 'https://ashton-portfolio.pages.dev'`
   If your actual URL is different, change that line to match your real URL, then commit + push (Path A) or rebuild + redeploy (Path B). This keeps your SEO/social-share links correct.

---

## Step 4 — Custom domain (optional, later)

If you buy a domain (e.g. `ashtonang.com`):

1. In your Pages project → **Custom domains** → **Set up a domain** → enter it.
2. Follow Cloudflare's DNS instructions (it usually adds the record for you if the domain is on Cloudflare).
3. Update `site:` in `astro.config.mjs` to the new domain, then push/redeploy.

---

## Quick troubleshooting

- **Build fails mentioning Node / engine version** → make sure the `NODE_VERSION = 20` environment variable is set (Path A), then retry the deploy.
- **Pages load but links 404** → confirm Build output directory is `dist`. (Your `astro.config.mjs` already uses directory-style URLs, so this should just work.)
- **Security headers not applying** → the `_headers` file must end up at the site root. It lives in `public/_headers`, and Astro copies everything in `public/` to the root of `dist` at build time, so this is already correct — just don't move it.
- **Contact form doesn't send** → check your spam folder; your CSP already allows `api.web3forms.com`. (Tip from the earlier review: add a free hCaptcha to the form later to cut spam, since the access key is public.)

---

## TL;DR

1. Print `Ashton-Ang-Resume.html` → save as `public/resume.pdf`.
2. `git init` → commit → push to a new GitHub repo.
3. Cloudflare → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
4. Build command `npm run build`, output `dist`, add `NODE_VERSION = 20`. Save and Deploy.
5. Check the URL, run it through securityheaders.com, fix `site:` in `astro.config.mjs` if the URL differs.
