import { escapeHTML } from "../utilities/helpers.js";

/**
 * GalleryGrid.js
 * Grid of work-sample cards. Uses CSS-drawn placeholder tiles
 * (no binary image assets required) so the site stays dependency-free
 * until real photos are dropped into assets/images/placeholder/.
 *
 * @param {object} props
 * @param {Array} props.items - gallery.json entries: { id, image, title, description }
 */
export function GalleryGrid({ items = [] } = {}) {
  const card = (item) => `
    <figure class="gallery-card" data-gallery-id="${item.id}">
      <div class="gallery-image-placeholder" role="img" aria-label="${escapeHTML(item.title)}">
        <span class="gallery-placeholder-icon">🔧</span>
        <span class="gallery-placeholder-label">Photo coming soon</span>
      </div>
      <figcaption>
        <h4 class="gallery-card-title">${escapeHTML(item.title)}</h4>
        <p class="gallery-card-desc">${escapeHTML(item.description)}</p>
      </figcaption>
    </figure>
  `;

  const element = `
    <div class="gallery-grid">
      ${items.map(card).join("")}
    </div>
  `;

  const attachEvents = (container) => {
    const cards = container.querySelectorAll(".gallery-card");
    cards.forEach((cardEl) => {
      cardEl.addEventListener("click", () => {
        cardEl.classList.toggle("gallery-card-active");
      });
    });
  };

  return { element, attachEvents };
}
