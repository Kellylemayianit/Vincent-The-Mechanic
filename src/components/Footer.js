/**
 * Footer.js
 * Site-wide footer with business summary, quick links, and contact snippet.
 *
 * @param {object} props
 * @param {object} props.config - the business config object from config.json
 */
export function Footer({ config } = {}) {
  const business = config?.business || {};
  const year = new Date().getFullYear();

  const element = `
    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-col">
          <h3 class="footer-heading">${business.name || "Kimana Auto Care"}</h3>
          <p class="footer-tagline">${business.tagline || ""}</p>
          <p class="footer-text">${business.story ? business.story.slice(0, 110) + "..." : ""}</p>
        </div>

        <div class="footer-col">
          <h4 class="footer-subheading">Quick Links</h4>
          <ul class="footer-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="services.html">Services</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-subheading">Contact</h4>
          <ul class="footer-links">
            <li>📞 <a href="tel:${business.phone || ""}">${business.phone || ""}</a></li>
            <li>📍 ${business.location || ""}</li>
            <li>🕒 ${business.workingHours || ""}</li>
            <li>🚨 ${business.emergency || "24/7 On-call"}</li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom container">
        <p>&copy; ${year} ${business.name || "Kimana Auto Care"}. All rights reserved.</p>
        <p class="footer-credit">Built for ${business.owner || "Vincent Mutinda"} — Kimana's Mobile Mechanic</p>
      </div>
    </footer>
  `;

  const attachEvents = () => {
    // No interactive behavior needed for the footer currently.
  };

  return { element, attachEvents };
}
