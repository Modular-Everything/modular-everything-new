import { Component } from "./Component";

export const Page = class Page extends Component {
  constructor({ id, element, elements }) {
    super({ id, element, elements });
  }

  create() {
    super.create();
  }

  show(anim) {
    return new Promise(async (resolve) => {
      if (anim) {
        await anim.play();
      } else {
        console.warn(`Page ${this.id} doesn't have an animation set.`);
      }

      resolve();
    });
  }
};
