'use babel'

import Grim from 'grim'

export default {
  activate () {
  },

  deactivate () {
  },

  provide () {
    Grim.deprecate('The environment package is deprecated. Use process.env directly instead. https://github.com/atom/atom/pull/12562')
    return Object.assign({}, process.env)
  }
}
