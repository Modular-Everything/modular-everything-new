import { Page } from "@/classes/Page";

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
};
