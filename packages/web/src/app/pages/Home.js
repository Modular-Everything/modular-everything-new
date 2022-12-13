import Prefix from "prefix";
import gsap from "gsap";
import { getOffset } from "../utils/dom";
import { Page } from "../classes/Page";
import each from "lodash/each";
import Sanity from "../data/sanity/Sanity";

export const HomePage = class HomePage extends Page {
  constructor() {
    super({
      id: "home",
      element: ".home",
      elements: {
        meta: ".home__meta",
        projects: ".home__projects__wrapper",
        content: ".home__content",
        content_transition: ".home__content__transition",
        projectItems: ".home__projects__item",
        project_meta_info: ".home__project__meta__info",
        project_meta_caption_copy: ".home__project__meta__caption__copy",
        project_meta_caption_link: ".home__project__meta__caption__link",
        project_meta_media: ".home__project__meta__media",
      },
    });

    this.transformPrefix = Prefix("transform");
    this.onMouseWheelEvent = this.onMouseWheel.bind(this);
    this.sanity = new Sanity();
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

    this.itemHeight =
      this.elements.projectItems[0].getBoundingClientRect().height;

    this.itemsTotalHeight =
      this.elements.projects.getBoundingClientRect().height;

    each(this.elements.projectItems, (element) => {
      const offset = getOffset(element);
      element.extra = 0;
      element.height = offset.height;
      element.offset = offset.top;
      element.position = 0;

      this.createNavFromElement(element);
      this.findActiveNavElement(element);
    });
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
   * Update project content from Sanity data
   */
  async updateProjectContent(projectId) {
    const data = await this.sanity.getProject(projectId).then((data) => {
      this.timeline = gsap.timeline();

      this.timeline.to(this.elements.content_transition, {
        transformOrigin: "left",
        scaleX: 1,
        duration: 0.3,
      });

      this.timeline.call(() => {
        this.elements.project_meta_caption_copy.innerHTML = data.title;
      });

      this.timeline.to(this.elements.content_transition, {
        transformOrigin: "right",
        scaleX: 0,
        duration: 0.3,
      });
    });
  }

  /**
   * Create a navigation item from each project item
   */

  createNavFromElement(element) {
    const { projectId } = element.children[0].dataset;
    element.children[0].addEventListener("click", async () => {
      document.body.dataset.selectedProject = projectId;
      this.setActiveNavElement(element, projectId);
      this.updateProjectContent(projectId);
    });
  }

  /**
   * Set navigation item as 'active' if it's closest to the middle of the page
   */
  findActiveNavElement(element) {
    const midPointMin = window.innerHeight / 2 - element.height;
    const midPointMax = window.innerHeight / 2;
    const button = element.children[0];

    if (element.offset >= midPointMin && element.offset <= midPointMax) {
      button.classList.add("home__projects__item__link--active");
      const { projectId } = element.children[0].dataset;
      document.body.dataset.selectedProject = projectId;
      this.updateProjectContent(projectId);
    }
  }

  /**
   * Set the active element
   */
  setActiveNavElement(element) {
    const activeElement = this.elements.projects.querySelector(
      ".home__projects__item__link--active"
    );
    activeElement.classList.remove("home__projects__item__link--active");
    element.children[0].classList.add("home__projects__item__link--active");
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
        duration: 0.18,
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
