import Prefix from "prefix";
import gsap from "gsap";
import { Page } from "../classes/Page";

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
    this.createProjectItems();

    this.scroll = {
      current: 0,
      target: 0,
      limit: 500,
    };
  }

  /**
   * Create a navigation item from each project item
   */

  createProjectItems() {
    const { projectItems } = this.elements;

    projectItems.forEach((item) => {
      const activeProjectId = item.querySelector(
        ".home__projects__item__link--active"
      );

      if (activeProjectId) {
        document.body.dataset.selectedProject =
          activeProjectId.dataset.projectId;
      }

      const projectId = item.children[0].dataset.projectId;

      item.addEventListener(
        "click",
        () => (document.body.dataset.selectedProject = projectId)
      );
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
    this.scroll.target = gsap.utils.clamp(
      0,
      this.scroll.limit,
      this.scroll.target
    );

    this.scroll.current = gsap.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      0.1
    );

    if (this.scroll.current < 0.01) {
      this.scroll.current = 0;
    }

    this.elements.projectItems.forEach((item) => {
      item.style[
        this.transformPrefix
      ] = `translateY(-${this.scroll.current}px)`;
    });
  }

  /**
   * Adjust scroll limit on resize
   */

  onResize() {
    this.scroll.limit =
      this.elements.projects.clientHeight - window.innerHeight;
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
