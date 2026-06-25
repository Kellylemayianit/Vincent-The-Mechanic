/**
 * app.js
 * Application entry point. Detects the current page, loads the data
 * it needs via dataLoader.js, builds each component, and mounts it
 * into the DOM. This is the only file that wires components together,
 * keeping individual components self-contained and reusable.
 */

import { loadAll } from "./services/dataLoader.js";
import { buildWhatsAppLink, buildGeneralMessage } from "./utilities/whatsapp.js";
import { setActiveNavLink, createElementFromHTML } from "./utilities/helpers.js";

import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";
import { Hero } from "./components/Hero.js";
import { ServiceCard } from "./components/ServiceCard.js";
import { ServiceCart } from "./components/ServiceCart.js";
import { ReviewCard } from "./components/ReviewCard.js";
import { GalleryGrid } from "./components/GalleryGrid.js";
import { FAQAccordion } from "./components/FAQAccordion.js";
import { ContactInfo } from "./components/ContactInfo.js";
import { EmergencyBadge } from "./components/EmergencyBadge.js";

/**
 * Mounts a component object ({ element, attachEvents }) into a target
 * DOM node, replacing its current contents, then wires up its events.
 * @param {string} targetSelector
 * @param {{element: string, attachEvents: Function}} component
 */
function mount(targetSelector, component) {
  const target = document.querySelector(targetSelector);
  if (!target || !component) return;
  target.innerHTML = component.element;
  component.attachEvents(target);
}

/**
 * Appends a component's element into a target node (rather than replacing),
 * useful for building lists of repeated components (service cards, reviews...).
 * @param {string} targetSelector
 * @param {{element: string, attachEvents: Function}} component
 */
function append(targetSelector, component) {
  const target = document.querySelector(targetSelector);
  if (!target || !component) return;
  const node = createElementFromHTML(`<div class="component-wrapper">${component.element}</div>`);
  // Unwrap the wrapper so we don't pollute markup with extra divs.
  while (node.firstChild) {
    target.appendChild(node.firstChild);
  }
  component.attachEvents(target);
}

/**
 * Mounts the Header, Footer, and EmergencyBadge shared across every page.
 * @param {object} config
 * @param {string} currentPage
 */
function mountSharedLayout(config, currentPage) {
  const business = config.business;
  const generalMessage = buildGeneralMessage(business.name);
  const generalWhatsAppLink = buildWhatsAppLink(business.whatsapp, generalMessage);

  mount("#header-root", Header({ businessName: business.name, currentPage }));

  // Wire the header's WhatsApp CTA link (data-whatsapp-cta) now that we know the link.
  document.querySelectorAll("[data-whatsapp-cta]").forEach((el) => {
    el.setAttribute("href", generalWhatsAppLink);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });

  mount("#footer-root", Footer({ config }));

  const emergencyMessage = `Hi ${business.name}, I have a car emergency and need help right now in Kimana.`;
  const emergencyLink = buildWhatsAppLink(business.whatsapp, emergencyMessage);
  mount("#emergency-badge-root", EmergencyBadge({ phone: business.phone, whatsappLink: emergencyLink }));

  setActiveNavLink();
}

/**
 * Builds the Home page (index.html).
 * @param {object} data - result of loadAll()
 */
function renderHomePage(data) {
  const { config, reviews, gallery } = data;
  const business = config.business;
  const generalLink = buildWhatsAppLink(business.whatsapp, buildGeneralMessage(business.name));

  mount("#hero-root", Hero({ business, whatsappLink: generalLink }));

  const galleryRoot = document.querySelector("#gallery-root");
  if (galleryRoot) {
    mount("#gallery-root", GalleryGrid({ items: gallery }));
  }

  const reviewsRoot = document.querySelector("#reviews-root");
  if (reviewsRoot) {
    reviewsRoot.innerHTML = "";
    reviews.forEach((review) => append("#reviews-root", ReviewCard({ review })));
  }

  document.querySelectorAll("[data-cta-whatsapp]").forEach((el) => {
    el.setAttribute("href", generalLink);
  });
}

/**
 * Builds the Services page (services.html).
 * @param {object} data - result of loadAll()
 */
function renderServicesPage(data) {
  const { config, services } = data;
  const business = config.business;

  const categoriesRoot = document.querySelector("#service-categories-root");
  if (categoriesRoot) {
    categoriesRoot.innerHTML = "";

    services.categories.forEach((category) => {
      const categoryEl = document.createElement("div");
      categoryEl.className = "service-category";
      categoryEl.innerHTML = `
        <div class="service-category-header">
          <span class="service-category-icon">${category.icon}</span>
          <div>
            <h3 class="service-category-title">${category.name}</h3>
            <p class="service-category-desc">${category.description}</p>
          </div>
        </div>
        <div class="service-grid" data-category="${category.name}"></div>
      `;
      categoriesRoot.appendChild(categoryEl);

      const grid = categoryEl.querySelector(".service-grid");
      category.services.forEach((service) => {
        const card = ServiceCard({ service });
        const node = createElementFromHTML(card.element);
        grid.appendChild(node);
        card.attachEvents(grid);
      });
    });
  }

  const collabRoot = document.querySelector("#collaborative-root");
  if (collabRoot) {
    collabRoot.innerHTML = `
      <h3>${services.collaborative.title}</h3>
      <p>${services.collaborative.description}</p>
    `;
  }

  mount("#service-cart-root", ServiceCart({ whatsappPhone: business.whatsapp }));
}

/**
 * Builds the Contact page (contact.html).
 * @param {object} data - result of loadAll()
 */
function renderContactPage(data) {
  const { config, faqs } = data;
  const business = config.business;
  const generalLink = buildWhatsAppLink(business.whatsapp, buildGeneralMessage(business.name));

  mount("#contact-info-root", ContactInfo({ business, whatsappLink: generalLink }));
  mount("#faq-root", FAQAccordion({ faqs }));

  const mapFrame = document.querySelector("#map-embed");
  if (mapFrame) {
    const query = encodeURIComponent(business.location || "Kimana Town");
    mapFrame.src = `https://www.google.com/maps?q=${query}&output=embed`;
  }

  const mapLink = document.querySelector("#map-directions-link");
  if (mapLink && business.googleMapsUrl) {
    mapLink.href = business.googleMapsUrl;
  }
}

/**
 * Entry point: detects current page and runs the matching renderer.
 */
async function init() {
  const page = document.body.dataset.page;

  try {
    const data = await loadAll();
    mountSharedLayout(data.config, `${page}.html`);

    if (page === "index") renderHomePage(data);
    if (page === "services") renderServicesPage(data);
    if (page === "contact") renderContactPage(data);
  } catch (error) {
    console.error("Failed to initialize Kimana Auto Care site:", error);
    const main = document.querySelector("main");
    if (main) {
      main.innerHTML = `
        <div class="container" style="padding: 4rem 0; text-align:center;">
          <p>Something went wrong loading this page. Please refresh, or contact us directly on WhatsApp.</p>
        </div>
      `;
    }
  }
}

document.addEventListener("DOMContentLoaded", init);
