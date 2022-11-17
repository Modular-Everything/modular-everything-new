import gsap from "gsap";
import { Page } from "../classes/Page";

export const HomePage = class HomePage extends Page {
  constructor() {
    super({
      id: "home",
      element: ".home",
      elements: {
        meta: ".home__meta",
        projects: ".home__projects",
        content: ".home__content",
        projectItems: ".home__projects__item",
      },
    });
  }

  create() {
    super.create();
    this.createProjectItems();
  }

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
  }
};
