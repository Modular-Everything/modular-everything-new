import gsap from "gsap";
import { Component } from "../classes/Component";
import each from "lodash/each";

export const Preloader = class Preloader extends Component {
  constructor() {
    super({
      id: "preloader",
      element: ".preloader",
      elements: {
        number: ".preloader__number",
        images: document.querySelectorAll("img"),
      },
    });

    this.length = 0;
    this.create();
    this.createPreloader();
  }

  create() {
    super.create();
  }

  createPreloader() {
    each(this.elements.images, (element) => {
      element.onload = (_) => this.onAssetLoaded(element);
      element.src = element.getAttribute("data-src");
    });
  }

  onAssetLoaded(img) {
    this.length += 1;
    const loadedVal = this.length / this.elements.images.length;
    this.elements.number.innerHTML = loadedVal.toFixed(8);

    if (loadedVal === 1) {
      this.onLoaded();
    }
  }

  onLoaded() {
    return new Promise((resolve) => {
      this.animateOut = gsap.timeline({
        delay: 2,
      });

      this.animateOut.to(
        this.element,
        {
          duration: 1,
          ease: "expo.out",
          autoAlpha: 0,
          transformOrigin: "center",
        },
        "-=1"
      );

      this.animateOut.call(() => {
        this.emit("completed");
      });
    });
  }

  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
};
