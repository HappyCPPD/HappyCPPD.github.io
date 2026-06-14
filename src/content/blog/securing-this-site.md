---
title: "Locking down my own site with a strict CSP and security headers"
description: "A static portfolio has a small attack surface, but it can still leak trust. Here is how I hardened this site with a content security policy, HSTS, and a few other headers, and what each one actually buys me."
pubDate: 2026-06-14
---

A portfolio for a cybersecurity internship has one extra job: the site itself is part of the pitch. If I cannot lock down the one server I fully control, why would anyone trust me near theirs? So I treated this site as a small case study and shipped a set of security headers. Here is what I added and why.

## The setup

This is a static [Astro](https://astro.build) site on Cloudflare Pages. There is no server I run and no database to misconfigure, which is already a much smaller attack surface than a typical web app. But static does not mean safe by default. A site can still be framed by someone else, served over a downgraded connection, or run injected scripts if I am careless. Headers close those gaps.

Cloudflare Pages reads a plain `_headers` file at the site root, so the whole policy is one file in version control. No dashboard clicking, and the rules live next to the code they protect.

## What each header does

**Content-Security-Policy.** This is the one that took real thought. It tells the browser exactly which sources are allowed to load. My policy is `default-src 'self'`, which means by default everything has to come from my own domain. Then I open up only the few things the site truly needs:

- `script-src 'self'` — scripts must be same-origin files. This is why my contact form logic and the hero animation live in `/public` as external `.js` files instead of inline `<script>` blocks. An inline script would force me to weaken the policy, so I moved the code instead.
- `connect-src 'self' https://api.web3forms.com` — the contact form posts to Web3Forms, so that one origin is allowed and nothing else.
- `frame-ancestors 'none'` — no other site can embed mine in an iframe.

The useful mental shift was writing the policy as a deny-list-by-default and then granting the minimum. Every `unsafe-inline` or wildcard I avoided is one less way for injected content to run.

**Strict-Transport-Security.** `max-age` with `includeSubDomains; preload` tells browsers to only ever reach the site over HTTPS, even if someone types `http://`. It shuts the door on a downgrade attack before the first insecure request happens.

**X-Content-Type-Options: nosniff.** Stops the browser from guessing a file's type and, for example, treating a text file as a script.

**X-Frame-Options: DENY** and **Referrer-Policy: strict-origin-when-cross-origin.** Clickjacking protection (a belt-and-braces partner to `frame-ancestors`) and a promise not to leak full URLs to other sites in the referer header.

**Permissions-Policy.** Explicitly switches off camera, microphone, and geolocation. A static portfolio never needs them, so I deny them outright rather than leave them available.

## What I learned

The content security policy taught me more than the rest combined, because it forced a real architectural choice. The moment I committed to `script-src 'self'`, inline scripts were off the table, and that pushed every bit of JavaScript into its own same-origin file. A security control changed how I structured the code, not just a header I bolted on at the end. That is the version of "secure by design" that finally made sense to me.

## Limits

Headers are a deploy-time promise, not a guarantee. They only take effect once the build that contains the `_headers` file is actually live, which is its own lesson: I check the running site, not the repo. After every deploy I confirm the policy with `curl -I https://happycppd-github-io.pages.dev` and a pass through [securityheaders.com](https://securityheaders.com). A header that exists only in git protects nobody.

A CSP also will not save a site from a flaw in its own allowed origins, and `style-src` still allows `'unsafe-inline'` for now because of inline styles I have not yet refactored out. That is the next thing to tighten.
