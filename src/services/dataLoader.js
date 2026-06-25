/**
 * dataLoader.js
 * Centralized service for fetching JSON data from /data.
 * All components/pages get their content through this layer,
 * so the data source can change later (e.g. to a real API)
 * without touching any component code.
 */

const cache = new Map();

/**
 * Fetches and caches a JSON file from the /data directory.
 * Path is relative so it works the same on Netlify, Vercel,
 * GitHub Pages, and when opened directly from disk.
 * @param {string} fileName - e.g. "config.json"
 * @returns {Promise<any>}
 */
async function loadJSON(fileName) {
  if (cache.has(fileName)) {
    return cache.get(fileName);
  }

  const response = await fetch(`../data/${fileName}`);
  if (!response.ok) {
    throw new Error(`Failed to load ${fileName}: ${response.status}`);
  }

  const data = await response.json();
  cache.set(fileName, data);
  return data;
}

/** @returns {Promise<object>} business config */
export function loadConfig() {
  return loadJSON("config.json");
}

/** @returns {Promise<object>} services categories + collaborative message */
export function loadServices() {
  return loadJSON("services.json");
}

/** @returns {Promise<Array>} customer reviews */
export function loadReviews() {
  return loadJSON("reviews.json");
}

/** @returns {Promise<Array>} gallery items */
export function loadGallery() {
  return loadJSON("gallery.json");
}

/** @returns {Promise<Array>} FAQ entries */
export function loadFAQs() {
  return loadJSON("faqs.json");
}

/**
 * Loads every data file in parallel. Handy for pages that need
 * most of the site's data up front (e.g. the home page).
 * @returns {Promise<{config:object, services:object, reviews:Array, gallery:Array, faqs:Array}>}
 */
export async function loadAll() {
  const [config, services, reviews, gallery, faqs] = await Promise.all([
    loadConfig(),
    loadServices(),
    loadReviews(),
    loadGallery(),
    loadFAQs(),
  ]);
  return { config, services, reviews, gallery, faqs };
}
