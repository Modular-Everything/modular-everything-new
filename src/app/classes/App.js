import AutoBind from "auto-bind";
import { Preloader } from "../components/Preloader";

export const Application = class Application {
  constructor() {
    AutoBind(this);
    this.createPreloader();
    this.initContainer();
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
    this.page.show();
  }

  /**
   * Init when page has finished preloading
   */

  init() {
    this.addEventListeners();
    this.onResize();
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
    this.page.sizes = {
      inner: this.windowInnerSizes,
      outer: this.windowOuterSizes,
    };
    this.page.create();
  }

  /**
   * Scroll hijacking
   */

  onMouseWheel(e) {
    const { deltaY } = e;
    this.page.scroll.target += deltaY;
  }

  /**
   * Resize handling
   */

  onResize() {
    // Set both inner and outer sizes
    this.windowInnerSizes = {
      height: window.innerHeight,
      width: window.innerWidth,
    };

    this.windowOuterSizes = {
      height: window.outerHeight,
      width: window.outerWidth,
    };
  }

  /**
   * Event listeners
   */

  addEventListeners() {
    window.addEventListener("mousewheel", this.onMouseWheel);
    window.addEventListener("resize", this.onResize);
  }

  removeEventListeners() {}

  /**
   * Update - called on each frame of the browser
   */

  update() {
    this.page?.update?.();
    this.frame = window.requestAnimationFrame(this.update);
  }
};
