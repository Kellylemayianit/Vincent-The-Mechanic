/**
 * cart.js
 * Lightweight cart state manager for the Services page.
 * Persists to localStorage so the cart survives a page refresh,
 * and exposes a simple pub/sub so components can react to changes.
 */

const STORAGE_KEY = "kimana_auto_care_cart";

let items = [];
const listeners = new Set();

/**
 * Loads cart items from localStorage into memory.
 */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    items = raw ? JSON.parse(raw) : [];
  } catch (err) {
    items = [];
  }
}

/**
 * Persists current in-memory items to localStorage.
 */
function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    // localStorage unavailable (e.g. private mode) - fail silently,
    // cart still works for the current session via in-memory state.
  }
}

/**
 * Notifies all subscribed listeners of a cart change.
 */
function notify() {
  listeners.forEach((fn) => fn(getItems()));
}

/**
 * Subscribes a callback to cart change events.
 * @param {(items: Array) => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribe(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

/**
 * Returns a shallow copy of current cart items.
 * @returns {Array<{id: string, name: string, price: string}>}
 */
export function getItems() {
  return [...items];
}

/**
 * Adds a service to the cart. Prevents duplicate ids.
 * @param {{id: string, name: string, price: string}} service
 */
export function addItem(service) {
  if (items.some((item) => item.id === service.id)) return;
  items.push(service);
  saveToStorage();
  notify();
}

/**
 * Removes a service from the cart by id.
 * @param {string} id
 */
export function removeItem(id) {
  items = items.filter((item) => item.id !== id);
  saveToStorage();
  notify();
}

/**
 * Toggles a service in/out of the cart.
 * @param {{id: string, name: string, price: string}} service
 */
export function toggleItem(service) {
  const exists = items.some((item) => item.id === service.id);
  if (exists) {
    removeItem(service.id);
  } else {
    addItem(service);
  }
}

/**
 * Checks whether a service id is currently in the cart.
 * @param {string} id
 * @returns {boolean}
 */
export function hasItem(id) {
  return items.some((item) => item.id === id);
}

/**
 * Empties the cart completely.
 */
export function clearCart() {
  items = [];
  saveToStorage();
  notify();
}

/**
 * Returns the number of items currently in the cart.
 * @returns {number}
 */
export function getCount() {
  return items.length;
}

// Initialize from storage as soon as the module loads.
loadFromStorage();
