"use babel";

import {CompositeDisposable} from "atom";

export class Environment {
  constructor() {
    this.subscriptions = new CompositeDisposable();
  }

  dispose() {
    if (this.subscriptions) {
      this.subscriptions.dispose();
    }
    this.subscriptions = null;
    this.env = null;
  }

  processenv() {
    return process.env;
  }

  current() {
    if (this.env) {
      return this.env;
    }

    if (this.platform() === "darwin") {
      // Need to substitute this once we have tests that fail because of launchd's env.
      return this.processenv();
    } else {
      this.env = this.processenv();
    }
  }

  shouldPatchEnvironment() {
    let p = this.processenv();
    if (this.platform() === "darwin" && p.PATH === "/usr/bin:/bin:/usr/sbin:/sbin") {
      return true;
    } else {
      return false;
    }
  }

  platform() {
    return process.platform;
  }

}
