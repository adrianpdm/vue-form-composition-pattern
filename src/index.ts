import { VueConstructor } from 'vue/types/umd'
import _kebabCase from 'lodash/kebabCase'
import { PluginOptions } from '../types'
import {
  Form,
  FormField,
} from './components'

const defaultOptions: PluginOptions = {
  prefix: 'vue',
}

const VuePatternFormPlugin = {
  install (Vue: VueConstructor, options = defaultOptions): void {
    const components = {
      Form,
      FormField,
    }

    const { prefix } = options
    Object.entries(components).forEach(([_name, c]) => {
      const name = `${prefix}-${_kebabCase(_name)}`
      Vue.component(name, c)
    })
  },
}

export { VuePatternFormPlugin }
export default VuePatternFormPlugin
