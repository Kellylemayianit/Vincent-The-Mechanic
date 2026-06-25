# Architecture Guide — Kimana Auto Care

This project follows the **Modular Vanilla Architecture (MVA)** pattern: a
component-based structure built with zero frameworks and zero build tools,
using native ES Modules, the Fetch API, and the DOM directly.

If you've used React, Vue, or similar frameworks before, this will feel
familiar — components, props, data flow — just without JSX, a bundler, or
a virtual DOM.

---

## 1. Folder Structure Explained

```
kimana-mechanic-website/
│
├── data/                     # Content — never hardcoded in JS or HTML
│   ├── config.json           # Business info: name, phone, hours, story
│   ├── services.json         # Service categories + pricing
│   ├── reviews.json          # Customer testimonials
│   ├── gallery.json          # Work-sample gallery items
│   └── faqs.json             # FAQ question/answer pairs
│
├── src/
│   ├── components/           # One file per UI component (see pattern below)
│   ├── utilities/            # Pure helper functions (no DOM-mounting logic)
│   │   ├── whatsapp.js       # Builds wa.me links + pre-filled messages
│   │   ├── cart.js           # Cart state (add/remove/subscribe) + localStorage
│   │   └── helpers.js        # DOM selectors, formatting, escaping, etc.
│   ├── services/
│   │   └── dataLoader.js     # Fetches and caches JSON from /data
│   └── app.js                # The ONLY file that wires data → components → DOM
│
├── styles/
│   ├── main.css               # Design tokens (CSS variables), resets, shared sections
│   ├── components/            # One CSS file per component, same name pattern
│   └── utilities/              # Cross-cutting styles: buttons, forms, responsive
│
├── assets/images/placeholder/ # Where real photos go (see its own README)
│
├── pages/                     # The 3 actual HTML pages users visit
│   ├── index.html             # Home
│   ├── services.html          # Services + Cart + WhatsApp checkout
│   └── contact.html           # Contact info, map, FAQs
│
├── ARCHITECTURE.md            # This file
└── README.md                  # Deployment instructions
```

**Why this structure?**
- **`data/`** is the single source of truth for content. A non-developer can
  update prices, reviews, or business hours by editing JSON — no JS knowledge
  required.
- **`src/components/`** isolates each visual piece so it can be tested, reused,
  or replaced independently.
- **`src/utilities/`** holds logic with *no* DOM rendering — these are pure
  functions you could unit test without a browser.
- **`styles/components/`** mirrors `src/components/` 1:1 where it makes sense,
  so finding the CSS for a component is never a guessing game.
- **`pages/`** contains only HTML skeletons with empty "root" divs
  (`<div id="hero-root">`) — components fill them in at runtime.

---

## 2. The Component Pattern

Every component in `src/components/` follows this exact shape:

```javascript
export function ComponentName(props) {
  const element = `<div>HTML string here</div>`;

  const attachEvents = (container) => {
    // Add event listeners here, scoped to `container`
  };

  return { element, attachEvents };
}
```

- **`element`** is a template string of HTML. It is pure rendering — no side
  effects, no DOM access. This makes components trivially testable: call the
  function, inspect the string.
- **`attachEvents(container)`** runs *after* `element` has been inserted into
  the real DOM. It receives the container node so it can safely query for
  child elements and wire up listeners (clicks, toggles, etc.) without
  touching anything outside its own subtree.
- Components return an **object**, not JSX or a class instance. `app.js`
  treats every component the same way: read `.element`, insert it, then call
  `.attachEvents()`.

### Example: mounting a component

```javascript
import { Hero } from "./components/Hero.js";

const hero = Hero({ business, whatsappLink });
document.querySelector("#hero-root").innerHTML = hero.element;
hero.attachEvents(document.querySelector("#hero-root"));
```

This two-step "render then attach" cycle is the core of MVA. It's simple
enough to read in five minutes, yet scales to dozens of components without
becoming spaghetti, because **every component manages only its own subtree.**

---

## 3. Data Flow: JSON → Components → App

```
   data/*.json
        │
        ▼
src/services/dataLoader.js   (fetch + cache)
        │
        ▼
   src/app.js                 (the only orchestrator)
        │
        ├──► Header(props)        ──► #header-root
        ├──► Hero(props)          ──► #hero-root
        ├──► ServiceCard(props)   ──► #service-categories-root (looped)
        ├──► ReviewCard(props)    ──► #reviews-root (looped)
        ├──► FAQAccordion(props)  ──► #faq-root
        └──► ... etc
```

1. **`dataLoader.js`** fetches the relevant `.json` files (relative to the
   page, e.g. `../data/config.json`) and caches them in memory so repeat
   calls don't re-fetch.
2. **`app.js`** calls `loadAll()` once on `DOMContentLoaded`, detects which
   page it's on via `document.body.dataset.page` (set in each HTML file's
   `<body data-page="...">`), and calls the matching `render*Page()` function.
3. Each `render*Page()` function builds the needed components by passing
   them **props** (plain JS objects/strings) — never raw JSON blobs unless
   that's literally what the component needs.
4. Components never fetch data themselves. This keeps them dumb, reusable,
   and framework-agnostic — you could lift any component file into a
   completely different project and it would still work, as long as you
   feed it the right props.

### The Cart is the one exception worth knowing about

`src/utilities/cart.js` holds cart state **outside** of any single
component, using a simple pub/sub (`subscribe()` / `notify()`) pattern. This
is necessary because `ServiceCard.js` (which adds items) and
`ServiceCart.js` (which displays them) are two separate components on the
same page that need to stay in sync without knowing about each other
directly. Cart state also persists to `localStorage` so a customer's
selections survive a page refresh.

---

## 4. How to Add a New Component

1. **Create the file**: `src/components/MyComponent.js`, following the
   exact pattern above (`element` + `attachEvents`, returned together).
2. **Create matching CSS** (if needed): `styles/components/my-component.css`.
3. **Link the CSS** in whichever `pages/*.html` file will use it:
   ```html
   <link rel="stylesheet" href="../styles/components/my-component.css" />
   ```
4. **Import and mount it** in `src/app.js`:
   ```javascript
   import { MyComponent } from "./components/MyComponent.js";
   // inside the relevant render*Page() function:
   mount("#my-component-root", MyComponent({ someProp: "value" }));
   ```
5. **Add the mount point** in the relevant HTML page:
   ```html
   <div id="my-component-root"></div>
   ```

That's it — no build step, no registration file, no compiler. Refresh the
browser and it's live.

---

## 5. How to Update Content

All real content lives in `data/*.json`. You do **not** need to touch any
`.js` or `.html` file to:

| Want to change...                  | Edit this file              |
|-------------------------------------|------------------------------|
| Phone number, hours, story, tagline | `data/config.json`          |
| Services, prices, categories        | `data/services.json`        |
| Customer testimonials               | `data/reviews.json`         |
| Gallery captions/images             | `data/gallery.json`         |
| FAQ questions and answers           | `data/faqs.json`            |

Each file is plain JSON — open it in any text editor, change the values
between the quotes, save, and refresh the site. No JavaScript knowledge
required for these day-to-day updates.

---

## 6. Design Decisions Worth Knowing

- **No frameworks, no bundler.** Every file runs natively in the browser via
  `<script type="module">`. This means zero `npm install`, zero build step,
  and instant deployment to any static host.
- **Relative paths everywhere.** All `import`, `fetch`, and `<link>` paths
  use relative references (`../`, `./`) so the site works identically
  whether it's opened from `file://`, a subdirectory on GitHub Pages, or the
  root domain on Netlify/Vercel.
- **Cart and WhatsApp logic are decoupled.** `whatsapp.js` only knows how to
  build links and messages; `cart.js` only knows how to manage selected
  items. Neither imports the other — `ServiceCart.js` (a component) is what
  combines them.
- **Accessibility basics are built in**: skip link, visible focus states,
  `aria-expanded`/`aria-pressed` on interactive elements, and reduced-motion
  support for the pulsing emergency button.
