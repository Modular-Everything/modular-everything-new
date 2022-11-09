export const App = class App {
  constructor() {
    this.initContainer();
  }

  initContainer() {
    this.content = document.querySelector("#app");
    this.template = this.content.dataset.template;
    if (!this.template) {
      console.warn(
        "The attribute `data-template` is required in `.app` for the application to run properly."
      );
    }
  }
};
