/**
 * whatsapp.js
 * Utility functions for building WhatsApp deep links and pre-filled messages.
 * No dependencies - pure vanilla JS.
 */

/**
 * Strips non-numeric characters from a phone number (keeps leading +).
 * @param {string} phone
 * @returns {string}
 */
function sanitizePhone(phone) {
  return phone.replace(/[^\d]/g, "");
}

/**
 * Builds a wa.me link with an optional pre-filled, URL-encoded message.
 * @param {string} phone - phone number, e.g. "+254793812140"
 * @param {string} [message] - plain text message to pre-fill
 * @returns {string} full https://wa.me/... URL
 */
export function buildWhatsAppLink(phone, message = "") {
  const digits = sanitizePhone(phone);
  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds the default "general enquiry" message used across the site.
 * @param {string} businessName
 * @returns {string}
 */
export function buildGeneralMessage(businessName) {
  return `Hi ${businessName}, I'd like to enquire about your mechanic services in Kimana.`;
}

/**
 * Builds a structured WhatsApp checkout message from a list of cart items.
 * @param {Array<{name: string, price: string}>} items
 * @param {object} [opts]
 * @param {string} [opts.customerName]
 * @param {string} [opts.notes]
 * @returns {string} formatted multi-line message
 */
export function buildCartMessage(items, opts = {}) {
  const lines = [];
  lines.push("Hello Kimana Auto Care! I'd like to request a quote for:");
  lines.push("");

  items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.name} (${item.price})`);
  });

  lines.push("");

  if (opts.customerName) {
    lines.push(`My name: ${opts.customerName}`);
  }

  if (opts.notes) {
    lines.push(`Notes: ${opts.notes}`);
  }

  lines.push("Please confirm availability and total cost. Thank you!");

  return lines.join("\n");
}

/**
 * Opens a WhatsApp link in a new tab/window.
 * @param {string} link
 */
export function openWhatsApp(link) {
  window.open(link, "_blank", "noopener,noreferrer");
}
