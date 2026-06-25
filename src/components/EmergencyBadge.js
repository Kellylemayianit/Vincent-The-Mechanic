/**
 * EmergencyBadge.js
 * Floating, persistent 24/7 emergency call/WhatsApp button.
 * Designed to stay fixed in the viewport on every page.
 *
 * @param {object} props
 * @param {string} props.phone - business phone number, e.g. "+254793812140"
 * @param {string} props.whatsappLink - prebuilt wa.me link with emergency message
 */
export function EmergencyBadge({ phone = "", whatsappLink = "#" } = {}) {
  const element = `
    <div class="emergency-badge" id="emergency-badge">
      <button class="emergency-fab" aria-label="Emergency contact options" aria-expanded="false">
        🚨 <span class="emergency-fab-text">24/7 Emergency</span>
      </button>
      <div class="emergency-menu" hidden>
        <a class="emergency-menu-item" href="tel:${phone}">📞 Call Now</a>
        <a class="emergency-menu-item emergency-menu-whatsapp" href="${whatsappLink}" target="_blank" rel="noopener noreferrer">💬 WhatsApp Now</a>
      </div>
    </div>
  `;

  const attachEvents = (container) => {
    const fab = container.querySelector(".emergency-fab");
    const menu = container.querySelector(".emergency-menu");

    if (fab && menu) {
      fab.addEventListener("click", () => {
        const isHidden = menu.hasAttribute("hidden");
        if (isHidden) {
          menu.removeAttribute("hidden");
          fab.setAttribute("aria-expanded", "true");
        } else {
          menu.setAttribute("hidden", "");
          fab.setAttribute("aria-expanded", "false");
        }
      });

      // Close the menu if user taps/clicks elsewhere on the page.
      document.addEventListener("click", (event) => {
        if (!container.contains(event.target)) {
          menu.setAttribute("hidden", "");
          fab.setAttribute("aria-expanded", "false");
        }
      });
    }
  };

  return { element, attachEvents };
}
