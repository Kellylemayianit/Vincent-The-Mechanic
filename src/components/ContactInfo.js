/**
 * ContactInfo.js
 * Displays clickable phone, WhatsApp, location, and working hours.
 * Used on the Contact page (and could be reused elsewhere).
 *
 * @param {object} props
 * @param {object} props.business - business object from config.json
 * @param {string} props.whatsappLink - prebuilt wa.me link
 */
export function ContactInfo({ business = {}, whatsappLink = "#" } = {}) {
  const element = `
    <div class="contact-info-card">
      <h3 class="contact-info-heading">Get In Touch</h3>

      <a class="contact-row contact-row-link" href="tel:${business.phone || ""}">
        <span class="contact-icon">📞</span>
        <span>
          <span class="contact-label">Call</span>
          <span class="contact-value">${business.phone || ""}</span>
        </span>
      </a>

      <a class="contact-row contact-row-link" href="${whatsappLink}" target="_blank" rel="noopener noreferrer">
        <span class="contact-icon">💬</span>
        <span>
          <span class="contact-label">WhatsApp</span>
          <span class="contact-value">${business.whatsapp || ""}</span>
        </span>
      </a>

      <div class="contact-row">
        <span class="contact-icon">📍</span>
        <span>
          <span class="contact-label">Location</span>
          <span class="contact-value">${business.location || ""}</span>
        </span>
      </div>

      <div class="contact-row">
        <span class="contact-icon">🕒</span>
        <span>
          <span class="contact-label">Working Hours</span>
          <span class="contact-value">${business.workingHours || ""}</span>
        </span>
      </div>

      <div class="contact-row">
        <span class="contact-icon">🚨</span>
        <span>
          <span class="contact-label">Emergency</span>
          <span class="contact-value">${business.emergency || "24/7 On-call"}</span>
        </span>
      </div>

      <a class="btn btn-whatsapp btn-block" href="${whatsappLink}" target="_blank" rel="noopener noreferrer">
        💬 Message Us on WhatsApp
      </a>
    </div>
  `;

  const attachEvents = () => {
    // Static content, no extra event wiring needed.
  };

  return { element, attachEvents };
}
