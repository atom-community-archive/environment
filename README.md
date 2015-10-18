# environment [![Build Status](https://travis-ci.org/atom-community/environment.svg)](https://travis-ci.org/atom-community/environment)

A package for the [Atom Editor](https://atom.io) that provides a normalized environment as a service to other packages. The service can be consumed by placing the following in your `package.json` file:

```json
{
  "name": "your-package-name",
  "main": "./lib/main",
  "<...>": "<other parts of your package.json here>",
  "consumedServices": {
    "environment": {
      "versions": {
        "1.0.0": "consumeEnvironment"
      }
    }
  }
}
```

Then, in your `main.js` file, add the following:

```javascript
consumeEnvironment (environment) {
  this.environment = environment
}
```

The environment is a hash, of the same format as that provided by `process.env`.

## What Does This Package Actually Do?

On platforms other than Mac OS X, the environment that this package provides is identical to `process.env`.

On Mac OS X, a check is made to determine whether `atom` was launched from a terminal, or if it was launched via `Dock`, `Finder`, `Spotlight`, or `open` (i.e. `launchctl` launched processes).

If `atom` was launched by a `launchctl` launched process, the environment available to `atom` is anaemic. This is particularly problematic for packages that depend on a sane environment to function correctly (e.g. anything that launches an external process).

If the environment is not sane, this package will launch the user's shell (as defined in `process.env.SHELL`) and then run `env` from that shell. The resulting environment is captured and then provided to any consumer of this service.

This package will also delete the `DYLD_INSERT_LIBRARIES` environment variable (if set) from the environment on OS X.
