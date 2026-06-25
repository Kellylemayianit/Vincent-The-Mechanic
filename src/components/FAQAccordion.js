import { escapeHTML } from "../utilities/helpers.js";

/**
 * FAQAccordion.js
 * Expand/collapse accordion of frequently asked questions.
 *
 * @param {object} props
 * @param {Array<{q: string, a: string}>} props.faqs
 */
export function FAQAccordion({ faqs = [] } = {}) {
  const item = (faq, index) => `
    <div class="faq-item" data-faq-index="${index}">
      <button class="faq-question" aria-expanded="false" aria-controls="faq-answer-${index}">
        <span>${escapeHTML(faq.q)}</span>
        <span class="faq-icon" aria-hidden="true">+</span>
      </button>
      <div class="faq-answer" id="faq-answer-${index}" hidden>
        <p>${escapeHTML(faq.a)}</p>
      </div>
    </div>
  `;

  const element = `
    <div class="faq-accordion">
      ${faqs.map(item).join("")}
    </div>
  `;

  const attachEvents = (container) => {
    const items = container.querySelectorAll(".faq-item");
    items.forEach((faqItem) => {
      const question = faqItem.querySelector(".faq-question");
      const answer = faqItem.querySelector(".faq-answer");
      const icon = faqItem.querySelector(".faq-icon");

      question.addEventListener("click", () => {
        const isOpen = question.getAttribute("aria-expanded") === "true";

        // Close any other open items for a clean single-open accordion.
        items.forEach((otherItem) => {
          if (otherItem === faqItem) return;
          otherItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
          otherItem.querySelector(".faq-answer").setAttribute("hidden", "");
          otherItem.querySelector(".faq-icon").textContent = "+";
        });

        if (isOpen) {
          question.setAttribute("aria-expanded", "false");
          answer.setAttribute("hidden", "");
          icon.textContent = "+";
        } else {
          question.setAttribute("aria-expanded", "true");
          answer.removeAttribute("hidden");
          icon.textContent = "−";
        }
      });
    });
  };

  return { element, attachEvents };
}
