"use babel";

import {CompositeDisposable} from "atom";
import {Environment} from "./environment";

export default {
  environment: null,
  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable();
    this.environment = new Environment();
    this.subscriptions.add(this.environment);
  },

  deactivate() {
    this.subscriptions.dispose();
    this.environment = null;
    this.subscriptions = null;
  },

  provide() {
    return this.environment.current();
  },
};
