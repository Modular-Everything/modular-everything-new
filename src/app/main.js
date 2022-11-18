import "../styles/index.css";

import { Application } from "./classes/App";
import { HomePage } from "./pages/Home";

const App = new Application();
App.init();

const routes = [
  {
    component: HomePage,
    template: "home",
  },
];

App.initRoutes(routes);

window.App = App;
