import { escapeHTML } from "../utilities/helpers.js";
import { getItems, removeItem, clearCart, subscribe, getCount } from "../utilities/cart.js";
import { buildWhatsAppLink, buildCartMessage } from "../utilities/whatsapp.js";

/**
 * ServiceCart.js
 * Floating cart drawer used on the Services page. Lets the customer
 * review selected services and "checkout" by sending a formatted
 * WhatsApp message with the full list - no backend required.
 *
 * @param {object} props
 * @param {string} props.whatsappPhone - business WhatsApp number
 */
export function ServiceCart({ whatsappPhone = "" } = {}) {
  const renderItemRow = (item) => `
    <li class="cart-item" data-cart-item-id="${item.id}">
      <div class="cart-item-info">
        <span class="cart-item-name">${escapeHTML(item.name)}</span>
        <span class="cart-item-price">${escapeHTML(item.price)}</span>
      </div>
      <button class="cart-item-remove" data-remove-id="${item.id}" aria-label="Remove ${escapeHTML(item.name)} from cart">✕</button>
    </li>
  `;

  const renderEmptyState = () => `
    <p class="cart-empty">No services selected yet. Tap "Add to Cart" on any service above.</p>
  `;

  const renderItemsList = (items) => {
    if (!items.length) return renderEmptyState();
    return `<ul class="cart-items-list">${items.map(renderItemRow).join("")}</ul>`;
  };

  const element = `
    <div class="service-cart" id="service-cart">
      <button class="cart-toggle" id="cart-toggle" aria-expanded="false" aria-controls="cart-panel">
        🛒 <span class="cart-toggle-label">My Selection</span>
        <span class="cart-count" id="cart-count">${getCount()}</span>
      </button>

      <div class="cart-panel" id="cart-panel" hidden>
        <div class="cart-panel-header">
          <h3>Your Selected Services</h3>
          <button class="cart-panel-close" id="cart-panel-close" aria-label="Close cart">✕</button>
        </div>

        <div class="cart-panel-body" id="cart-panel-body">
          ${renderItemsList(getItems())}
        </div>

        <div class="cart-panel-footer">
          <button class="btn btn-text" id="cart-clear">Clear All</button>
          <a class="btn btn-whatsapp btn-block" id="cart-checkout" href="#" target="_blank" rel="noopener noreferrer">
            💬 Send via WhatsApp
          </a>
        </div>
      </div>
    </div>
  `;

  const attachEvents = (container) => {
    const toggleBtn = container.querySelector("#cart-toggle");
    const panel = container.querySelector("#cart-panel");
    const closeBtn = container.querySelector("#cart-panel-close");
    const clearBtn = container.querySelector("#cart-clear");
    const checkoutBtn = container.querySelector("#cart-checkout");
    const countBadge = container.querySelector("#cart-count");
    const bodyEl = container.querySelector("#cart-panel-body");

    const openPanel = () => {
      panel.removeAttribute("hidden");
      toggleBtn.setAttribute("aria-expanded", "true");
    };

    const closePanel = () => {
      panel.setAttribute("hidden", "");
      toggleBtn.setAttribute("aria-expanded", "false");
    };

    const updateCheckoutLink = (items) => {
      if (!items.length) {
        checkoutBtn.setAttribute("aria-disabled", "true");
        checkoutBtn.classList.add("btn-disabled");
        checkoutBtn.href = "#";
        return;
      }
      checkoutBtn.removeAttribute("aria-disabled");
      checkoutBtn.classList.remove("btn-disabled");
      const message = buildCartMessage(items);
      checkoutBtn.href = buildWhatsAppLink(whatsappPhone, message);
    };

    const rerender = (items) => {
      bodyEl.innerHTML = renderItemsList(items);
      countBadge.textContent = String(items.length);
      updateCheckoutLink(items);

      // Re-wire remove buttons after re-render since innerHTML wipes listeners.
      bodyEl.querySelectorAll(".cart-item-remove").forEach((btn) => {
        btn.addEventListener("click", () => {
          removeItem(btn.dataset.removeId);
        });
      });
    };

    toggleBtn.addEventListener("click", () => {
      const isOpen = !panel.hasAttribute("hidden");
      isOpen ? closePanel() : openPanel();
    });

    closeBtn.addEventListener("click", closePanel);

    clearBtn.addEventListener("click", () => {
      clearCart();
    });

    checkoutBtn.addEventListener("click", (event) => {
      if (checkoutBtn.classList.contains("btn-disabled")) {
        event.preventDefault();
      }
    });

    // Wire up the initial remove buttons rendered server-side (in the template string).
    bodyEl.querySelectorAll(".cart-item-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        removeItem(btn.dataset.removeId);
      });
    });

    updateCheckoutLink(getItems());

    // React to cart changes triggered from ServiceCard "Add to Cart" buttons elsewhere on the page.
    subscribe(rerender);
  };

  return { element, attachEvents };
}
