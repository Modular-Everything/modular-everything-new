import { Preloader } from "../components/Preloader";

export const Application = class Application {
  constructor() {
    this.createPreloader();
    this.initContainer();
  }

  createPreloader() {
    this.preloader = new Preloader();
    this.preloader.once("completed", this.onPreloaded.bind(this));
  }

  onPreloaded() {
    this.preloader.destroy();
    this.page.show();
  }

  initContainer() {
    this.content = document.querySelector("#app");
    this.template = this.content.dataset.template;
    if (!this.template) {
      console.error(
        "The attribute `data-template` is required in `.app` for the application to run properly."
      );
    }
  }

  initRoutes(routes) {
    this.routes = routes;
    this.pages = {};

    routes.forEach(({ component: Component, template }) => {
      this.pages[template] = new Component();
    });

    this.page = this.pages[this.template];
    this.page.create();
  }
};
