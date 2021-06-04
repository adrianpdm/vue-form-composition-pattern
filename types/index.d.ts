import { PluginFunction } from "vue/types/umd"
import './lib'

export interface PluginOptions {
  prefix: string;
}

export interface VueFormPattern {
  install: PluginFunction<PluginOptions>
}

export default VueFormPattern

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
