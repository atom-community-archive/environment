"use babel";

import {CompositeDisposable} from "atom";
import {fs} from "fs";
import os from "os";
import {spawnSync} from "child_process";

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

    if (this.shouldPatchEnvironment()) {
      this.env = this.patchEnvironment();
    } else {
      this.env = this.processenv();
    }

    return this.env;
  }

  patchEnvironment() {
    let result = this.execSync(this.shell(), null, this.processenv(), ["--login"], "env");
    if (result && result.code === 0 && result.stdout && result.stdout.length > 0) {
      let newenv = {};
      for (let line of result.stdout.split(os.EOL)) {
        if (line.includes("=")) {
          let components = line.split("=");
          if (components.length === 2) {
            newenv[components[0]] = components[1];
          } else if (components.length > 2) {
            let k = components.shift();
            let v = components.join("=");
            newenv[k] = v;
          }
        }
      }
      return newenv;
    }

    return this.processenv();
  }

  execSync(command, cwd, env = this.processenv(), args = [], input = null) {
    let options = {cwd: null, env: env, encoding: "utf8"};
    if (cwd && cwd.length > 0) {
      options.cwd = fs.realpathSync(cwd);
    }

    if (input && input.length) {
      options.input = input;
    }

    let done = spawnSync(command, args, options);
    let code = done.status;

    let stdout = "";
    if (done.stdout && done.stdout.length > 0) {
      stdout = done.stdout;
    }
    let stderr = "";
    if (done.stderr && done.stderr.length > 0) {
      stderr = done.stderr;
    }
    let error = done.error;
    if (error && error.code) {
      switch(error.code) {
        case "ENOENT":
          code = 127;
          break;
        case "ENOTCONN": // https://github.com/iojs/io.js/pull/1214
          error = null;
          code = 0;
          break;
      }
    }

    return {code: code, stdout: stdout, stderr: stderr, error: error};
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

  shell() {
    let p = this.processenv();
    return p && p.SHELL;
  }
}
