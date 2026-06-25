/**
 * Hero.js
 * Home page hero section: Vincent's story, tagline, trust signals,
 * and primary WhatsApp call-to-action.
 *
 * @param {object} props
 * @param {object} props.business - business object from config.json
 * @param {string} props.whatsappLink - prebuilt wa.me link with general enquiry message
 */
export function Hero({ business = {}, whatsappLink = "#" } = {}) {
  const specialties = Array.isArray(business.specialties) ? business.specialties : [];

  const element = `
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-content">
          <span class="badge badge-mobile-service hero-badge">📍 Mobile Service Across Kimana</span>

          <h1 class="hero-title">${business.tagline || "From Petrol Station to Your Driveway"}</h1>

          <p class="hero-subtitle">${business.story || ""}</p>

          <div class="hero-trust-signals">
            <div class="trust-pill">⭐ ${business.experience || "5+ Years"} Experience</div>
            <div class="trust-pill">🚗 All Car Models</div>
            <div class="trust-pill">🤝 Collaborative Network</div>
          </div>

          <div class="hero-cta-row">
            <a class="btn btn-whatsapp btn-lg" href="${whatsappLink}" target="_blank" rel="noopener noreferrer">
              💬 Chat on WhatsApp
            </a>
            <a class="btn btn-outline btn-lg" href="services.html">
              View Services
            </a>
          </div>

          <ul class="hero-specialties">
            ${specialties.map((item) => `<li>✅ ${item}</li>`).join("")}
          </ul>
        </div>

        <div class="hero-visual">
          <div class="hero-emergency-banner">
            <span class="emergency-icon">🚨</span>
            <div>
              <strong>24/7 Emergency Service</strong>
              <p>Broken down? We're on call around the clock.</p>
            </div>
          </div>
          <div class="hero-owner-card">
            <div class="hero-owner-avatar" aria-hidden="true">👨🔧</div>
            <div>
              <strong>${business.owner || "Vincent Mutinda"}</strong>
              <p>Founder &amp; Lead Mechanic</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  const attachEvents = () => {
    // Hero is currently static aside from the standard CTA links.
  };

  return { element, attachEvents };
}
