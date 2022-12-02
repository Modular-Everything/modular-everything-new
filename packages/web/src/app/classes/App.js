import AutoBind from "auto-bind";
import { Preloader } from "../components/Preloader";

export const Application = class Application {
  constructor() {
    AutoBind(this);
    this.createPreloader();
    this.initContainer();
    this.addEventListeners();
  }

  /**
   * Preloader
   */

  createPreloader() {
    this.preloader = new Preloader();
    this.preloader.once("completed", this.onPreloaded.bind(this));
  }

  onPreloaded() {
    this.preloader.destroy();
    this.onResize();
    this.page.show();
  }

  /**
   * Init when page has finished preloading
   */

  init() {
    this.update();
  }

  /**
   * Create the container
   */

  initContainer() {
    this.content = document.querySelector("#app");
    this.template = this.content.dataset.template;
    if (!this.template) {
      console.error(
        "The attribute `data-template` is required in `.app` for the application to run properly."
      );
    }
  }

  /**
   * Routes
   */

  initRoutes(routes) {
    this.routes = routes;
    this.pages = {};

    routes.forEach(({ component: Component, template }) => {
      this.pages[template] = new Component();
    });

    this.page = this.pages[this.template];
    this.page.create();
  }

  /**
   * Update - called on each frame of the browser
   */

  update() {
    this.page?.update?.();
    this.frame = window.requestAnimationFrame(this.update);
  }

  /**
   * Resize
   */

  onResize() {
    this.page?.onResize?.();
  }

  /**
   * Event listeners
   */

  addEventListeners() {
    window.addEventListener("resize", this.onResize.bind(this));
  }
};
