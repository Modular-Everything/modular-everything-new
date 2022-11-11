export const Page = class Page {
  constructor({ id, element, elements }) {
    this.id = id;
    this.selector = element;
    this.selectors = { ...elements };
  }

  create() {
    this.initElement(this.selector);
    this.initElements(this.selectors);
  }

  initElement(selector) {
    if (!selector) {
      return;
    }

    if (selector instanceof window.HTMLElement) {
      this.element = selector;
    } else {
      this.element = document.querySelector(selector);
    }
  }

  initElements(selectors) {
    this.elements = {};

    for (const key in selectors) {
      const selector = selectors[key];
      if (selector === window) {
        this.elements[key] = window;
      } else if (selector instanceof window.HTMLElement) {
        this.elements[key] = selector;
      } else {
        this.elements[key] = document.querySelectorAll(selector);
        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = this.elements[key][0];
        }
      }
    }
  }
};
