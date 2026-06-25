/**
 * helpers.js
 * Small, generic utility functions shared across components.
 */

/**
 * Selects a single element within a container (or document).
 * @param {string} selector
 * @param {ParentNode} [scope]
 * @returns {Element|null}
 */
export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

/**
 * Selects all matching elements within a container (or document).
 * @param {string} selector
 * @param {ParentNode} [scope]
 * @returns {Element[]}
 */
export function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

/**
 * Creates a DOM element from an HTML string.
 * Useful for mounting a component's `element` string into a real node.
 * @param {string} htmlString
 * @returns {Element}
 */
export function createElementFromHTML(htmlString) {
  const template = document.createElement("template");
  template.innerHTML = htmlString.trim();
  return template.content.firstElementChild;
}

/**
 * Renders a list of star icons (filled/empty) for a rating out of 5.
 * @param {number} rating
 * @returns {string} HTML string of stars
 */
export function renderStars(rating) {
  const fullStar = "★";
  const emptyStar = "☆";
  const safeRating = Math.max(0, Math.min(5, Math.round(rating)));
  return fullStar.repeat(safeRating) + emptyStar.repeat(5 - safeRating);
}

/**
 * Formats an ISO date string (YYYY-MM-DD) into a friendly display format.
 * @param {string} isoDate
 * @returns {string} e.g. "20 Jun 2026"
 */
export function formatDate(isoDate) {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (err) {
    return isoDate;
  }
}

/**
 * Escapes HTML special characters to prevent markup injection
 * when interpolating user/data-driven strings into templates.
 * @param {string} str
 * @returns {string}
 */
export function escapeHTML(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Formats a Kenyan phone number for clickable tel: links.
 * @param {string} phone
 * @returns {string}
 */
export function telLink(phone) {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

/**
 * Debounce helper - delays invoking fn until after `wait` ms
 * have elapsed since the last call.
 * @param {Function} fn
 * @param {number} wait
 * @returns {Function}
 */
export function debounce(fn, wait = 200) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), wait);
  };
}

/**
 * Highlights the nav link matching the current page filename.
 * @param {string} containerSelector
 */
export function setActiveNavLink(containerSelector = ".nav-links") {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const links = qsa(`${containerSelector} a`);
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}
