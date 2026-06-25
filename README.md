# Kimana Auto Care — Website

A 3-page mobile mechanic website for **Vincent Mutinda (Kimana Auto Care)**,
built with the **Modular Vanilla Architecture (MVA)** — pure HTML/CSS/JS,
no frameworks, no build tools, no backend.

> 📖 For a deep dive into how the code is organized, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## What's Included

- **Home (`pages/index.html`)** — Vincent's story, mobile service badge,
  24/7 emergency banner, work gallery, customer reviews, WhatsApp CTA.
- **Services (`pages/services.html`)** — Service categories with pricing,
  an "Add to Cart" flow that compiles selected services into one WhatsApp
  message, and the collaborative-network message.
- **Contact (`pages/contact.html`)** — Clickable phone/WhatsApp, embedded
  Google Map, working hours, and FAQs.

All content (business info, services, prices, reviews, gallery captions,
FAQs) lives in the `data/*.json` files and can be edited without touching
any code.

---

## Quick Start (View Locally)

Because the site uses native ES Modules (`import`/`export`) and `fetch()`
to load JSON, opening `pages/index.html` directly via `file://` **will not
work** in most browsers (CORS restrictions on local file fetches). You need
a local static server. Pick any one of these:

### Option A — Python (already installed on most systems)
```bash
cd kimana-mechanic-website
python3 -m http.server 8000
```
Then open: `http://localhost:8000/pages/index.html`

### Option B — Node.js
```bash
cd kimana-mechanic-website
npx serve .
```

### Option C — VS Code "Live Server" extension
Right-click `pages/index.html` → "Open with Live Server".

---

## Deployment

This is a **fully static site** — no backend, no database, no environment
variables required. It deploys as-is to any static host.

### Deploy to Netlify

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** →
   **Deploy manually**.
2. Drag and drop the entire `kimana-mechanic-website` folder onto the
   upload area.
3. Once deployed, set the **Publish directory** if prompted — leave it as
   the project root (Netlify will serve `pages/index.html` once you set
   the homepage redirect below).
4. **Recommended:** add a `_redirects` file at the project root with:
   ```
   /   /pages/index.html   200
   ```
   so visiting your root domain shows the home page directly.

### Deploy to Vercel

1. Install the CLI: `npm i -g vercel` (or use the Vercel dashboard's
   drag-and-drop import).
2. From the project root, run:
   ```bash
   vercel
   ```
3. Accept the defaults — it's a static project, no build command needed.
4. Optionally add a `vercel.json` with a redirect from `/` to
   `/pages/index.html`, similar to the Netlify `_redirects` example above.

### Deploy to GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages** → set source to the branch you pushed
   (e.g. `main`) and root folder.
3. Your site will be live at `https://<username>.github.io/<repo>/pages/index.html`.
4. Optionally add a simple `index.html` redirect at the repo root:
   ```html
   <meta http-equiv="refresh" content="0; url=pages/index.html">
   ```

---

## Updating Content (No Coding Required)

| To change...                          | Edit this file        |
|----------------------------------------|------------------------|
| Phone, WhatsApp, hours, story, tagline | `data/config.json`     |
| Services and prices                    | `data/services.json`   |
| Customer reviews                       | `data/reviews.json`    |
| Gallery photos/captions                | `data/gallery.json`    |
| FAQs                                   | `data/faqs.json`       |

Open any of these in a plain text editor, change the text between the
quotes, save, and re-deploy (or just refresh, if testing locally).

To add **real photos** to the gallery, see the instructions in
`assets/images/placeholder/README.md`.

---

## Tech Notes

- **No dependencies** — pure vanilla JavaScript using native ES Modules
  (`import`/`export`). Nothing to `npm install`.
- **Mobile-first responsive design**, tested down to small phone widths.
- **WhatsApp-first CTAs** throughout, using `wa.me` deep links with
  pre-filled messages — no contact form, no backend required.
- **Cart state** persists in the browser's `localStorage`, so a customer's
  selected services survive a page refresh.
- **Color system**: Blue (`#1a56db`) for trust/professionalism, Gold
  (`#f59e0b`) as the accent, WhatsApp green (`#25d366`) reserved
  specifically for WhatsApp actions.

---

## Support

This site was built for **Vincent Mutinda** of Kimana Auto Care.
For technical changes beyond editing the JSON data files, refer to
[ARCHITECTURE.md](./ARCHITECTURE.md) for how the component system works.
