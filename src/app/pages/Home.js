import Prefix from "prefix";
import gsap from "gsap";
import { getOffset } from "../utils/dom";
import { Page } from "../classes/Page";
import each from "lodash/each";

export const HomePage = class HomePage extends Page {
  constructor() {
    super({
      id: "home",
      element: ".home",
      elements: {
        meta: ".home__meta",
        projects: ".home__projects__wrapper",
        content: ".home__content",
        projectItems: ".home__projects__item",
      },
    });

    this.transformPrefix = Prefix("transform");
    this.onMouseWheelEvent = this.onMouseWheel.bind(this);
  }

  /**
   * Create the page and project items,
   * and add the scroll hijacking
   */

  create() {
    super.create();

    this.scroll = {
      current: 0,
      target: 0,
      limit: this.itemsTotalHeight,
      last: 0,
    };

    each(this.elements.projectItems, (element) => {
      this.createNavFromItem(element);

      const offset = getOffset(element);
      element.extra = 0;
      element.height = offset.height;
      element.offset = offset.top;
      element.position = 0;
    });

    this.itemHeight =
      this.elements.projectItems[0].getBoundingClientRect().height;

    this.itemsTotalHeight =
      this.elements.projects.getBoundingClientRect().height;
  }

  /**
   * Handle Y-axis transforms
   */
  transformY(element, y) {
    element.style[this.transformPrefix] = `translate3d(0, ${Math.floor(
      y
    )}px, 0)`;
  }

  /**
   * Create a navigation item from each project item
   */

  createNavFromItem(item) {
    const { projectId } = item.children[0].dataset;
    const active = item.querySelector(".home__projects__item__link--active");

    if (active) {
      document.body.dataset.selectedProject = active.dataset.projectId;
    }

    item.addEventListener("click", () => {
      document.body.dataset.selectedProject = projectId;
    });
  }

  /**
   * Reveal the page
   * This happens after the preloader because
   * this.page.show() isn't called until after
   * the preloader has finished
   */

  show() {
    this.timelineIn = gsap.timeline();
    this.timelineIn.fromTo(
      this.element,
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
        duration: 1,
      }
    );
    super.show(this.timelineIn);
    this.timelineIn.call(() => {
      this.callAfterPreloader();
    });
  }

  /**
   * Call this after the preloader
   */
  callAfterPreloader() {
    this.addEventListeners();
  }

  /**
   * Adjust scroll target when scrolling
   */

  onMouseWheel(e) {
    const { deltaY } = e;
    this.scroll.target += deltaY;
  }

  /**
   * Scroll hijacking
   */

  update() {
    const scrollClamp = Math.round(this.scroll.current % this.itemsTotalHeight);

    this.scroll.current = gsap.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      0.1
    );

    if (this.scroll.current < this.scroll.last) {
      this.direction = "down";
    } else {
      this.direction = "up";
    }

    each(this.elements.projectItems, (element) => {
      element.position = -this.scroll.current - element.extra;

      const offset = element.position + element.offset + element.height;

      element.isBefore = offset < 0;
      element.isAfter = offset > this.itemsTotalHeight;

      if (this.direction === "up" && element.isBefore) {
        element.extra = element.extra - this.itemsTotalHeight;

        element.isBefore = false;
        element.isAfter = false;
      }

      if (this.direction === "down" && element.isAfter) {
        element.extra = element.extra + this.itemsTotalHeight;

        element.isBefore = false;
        element.isAfter = false;
      }

      element.clamp = element.extra % scrollClamp;
      this.transformY(element, element.position);
    });

    this.scroll.last = this.scroll.current;
    this.scroll.clamp = scrollClamp;
  }

  /**
   * Adjust scroll limit on resize
   */

  onResize() {
    this.scroll.limit =
      this.elements.projects.clientHeight - window.innerHeight;

    each(this.elements.projectItems, (element) => {
      this.transformY(element, 0);

      const offset = getOffset(element);
      element.extra = 0;
      element.height = offset.height;
      element.offset = offset.top;
      element.position = 0;
    });

    this.itemHeight =
      this.elements.projectItems[0].getBoundingClientRect().height;

    this.itemsTotalHeight =
      this.elements.projects.getBoundingClientRect().height;
  }

  /**
   * Event listeners
   */

  addEventListeners() {
    window.addEventListener("mousewheel", this.onMouseWheelEvent);
  }

  removeEventListeners() {
    window.removeEventListener("mousewheel", this.onMouseWheelEvent);
  }
};
