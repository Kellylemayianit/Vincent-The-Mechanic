/**
 * Header.js
 * Site-wide navigation header with logo, nav links, mobile menu toggle,
 * and a persistent "Mobile Service" badge.
 *
 * @param {object} props
 * @param {string} props.businessName
 * @param {string} props.currentPage - "index.html" | "services.html" | "contact.html"
 */
export function Header({ businessName = "Kimana Auto Care", currentPage = "index.html" } = {}) {
  const navItem = (href, label) => {
    const isActive = href === currentPage ? " active" : "";
    return `<li><a href="${href}" class="nav-link${isActive}">${label}</a></li>`;
  };

  const element = `
    <header class="site-header">
      <div class="header-inner container">
        <a href="index.html" class="logo">
          <span class="logo-icon">🔧</span>
          <span class="logo-text">${businessName}</span>
        </a>

        <span class="badge badge-mobile-service" title="We come to you anywhere in Kimana">
          📍 Mobile Service
        </span>

        <button class="nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
          <span class="nav-toggle-bar"></span>
          <span class="nav-toggle-bar"></span>
          <span class="nav-toggle-bar"></span>
        </button>

        <nav class="main-nav" id="main-nav">
          <ul class="nav-links">
            ${navItem("index.html", "Home")}
            ${navItem("services.html", "Services")}
            ${navItem("contact.html", "Contact")}
          </ul>
          <a class="btn btn-whatsapp btn-nav-cta" href="#" data-whatsapp-cta>
            💬 WhatsApp Us
          </a>
        </nav>
      </div>
    </header>
  `;

  const attachEvents = (container) => {
    const toggle = container.querySelector(".nav-toggle");
    const nav = container.querySelector("#main-nav");

    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.classList.toggle("nav-toggle-active", isOpen);
      });

      // Close mobile menu after a nav link is tapped
      container.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
          nav.classList.remove("nav-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.classList.remove("nav-toggle-active");
        });
      });
    }
  };

  return { element, attachEvents };
}
