import { renderStars, formatDate, escapeHTML } from "../utilities/helpers.js";

/**
 * ReviewCard.js
 * Single customer testimonial card.
 *
 * @param {object} props
 * @param {object} props.review - { customer, location, rating, comment, date }
 */
export function ReviewCard({ review } = {}) {
  const { customer = "Anonymous", location = "", rating = 5, comment = "", date = "" } = review || {};

  const element = `
    <article class="review-card">
      <div class="review-stars" aria-label="${rating} out of 5 stars">${renderStars(rating)}</div>
      <p class="review-comment">"${escapeHTML(comment)}"</p>
      <div class="review-meta">
        <span class="review-customer">${escapeHTML(customer)}</span>
        <span class="review-location">${escapeHTML(location)}</span>
      </div>
      <time class="review-date" datetime="${date}">${formatDate(date)}</time>
    </article>
  `;

  const attachEvents = () => {
    // Static card, no interactivity required.
  };

  return { element, attachEvents };
}
