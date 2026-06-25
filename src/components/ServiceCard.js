import { escapeHTML } from "../utilities/helpers.js";
import { toggleItem, hasItem } from "../utilities/cart.js";

/**
 * ServiceCard.js
 * Single service line item with price/time and an Add-to-Cart toggle.
 * "Call for quote" services still get added to the cart so the
 * customer can request a quote for several jobs in one WhatsApp message.
 *
 * @param {object} props
 * @param {object} props.service - { id, name, description, price, time, popular?, featured? }
 */
export function ServiceCard({ service } = {}) {
  const { id, name, description, price, time, popular, featured } = service || {};

  const badge = popular
    ? '<span class="service-tag service-tag-popular">🔥 Popular</span>'
    : featured
    ? '<span class="service-tag service-tag-featured">⭐ Featured</span>'
    : "";

  const inCartInitially = hasItem(id);

  const element = `
    <article class="service-card" data-service-id="${id}">
      ${badge}
      <h4 class="service-card-name">${escapeHTML(name)}</h4>
      <p class="service-card-desc">${escapeHTML(description)}</p>
      <div class="service-card-meta">
        <span class="service-card-price">${escapeHTML(price)}</span>
        <span class="service-card-time">⏱ ${escapeHTML(time)}</span>
      </div>
      <button
        class="btn btn-add-to-cart ${inCartInitially ? "btn-in-cart" : ""}"
        data-service-id="${id}"
        data-service-name="${escapeHTML(name)}"
        data-service-price="${escapeHTML(price)}"
        aria-pressed="${inCartInitially}"
      >
        ${inCartInitially ? "✓ Added to Cart" : "+ Add to Cart"}
      </button>
    </article>
  `;

  const attachEvents = (container) => {
    const button = container.querySelector(`.btn-add-to-cart[data-service-id="${id}"]`);
    if (!button) return;

    button.addEventListener("click", () => {
      toggleItem({ id, name, price });
      const nowInCart = hasItem(id);
      button.classList.toggle("btn-in-cart", nowInCart);
      button.setAttribute("aria-pressed", String(nowInCart));
      button.textContent = nowInCart ? "✓ Added to Cart" : "+ Add to Cart";
    });
  };

  return { element, attachEvents };
}
