'use babel'

import environmentHelpers from './environment-helpers'
import semver from 'semver'

export default {
  activate () {
    if (semver.satisfies(this.version(), '<1.7.0')) {
      environmentHelpers.normalize()
    }
  },

  deactivate () {
  },

  provide () {
    return Object.assign({}, process.env)
  },

  version () {
    return semver.major(atom.appVersion) + '.' + semver.minor(atom.appVersion) + '.' + semver.patch(atom.appVersion)
  }
}
