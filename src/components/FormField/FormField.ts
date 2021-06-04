import { Form, Local, Model, Origin } from '@/utils/provider.symbol'
import Vue from 'vue'
import { VueConstructor } from 'vue/types/umd'

interface FormInjectedComponent {
  form: Record<string, unknown> | null,
  model: Record<string, unknown> | null,
  origin: Record<string, unknown> | null,
  local: Record<string, unknown> | null
}

export default (Vue as VueConstructor<Vue & FormInjectedComponent>).extend({
  inject: {
    form: {
      from: Form,
      default: () => null,
    },
    model: {
      from: Model,
      default: () => null,
    },
    origin: {
      from: Origin,
      default: () => null,
    },
    local: {
      from: Local,
      default: () => null,
    },
  },
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  computed: {
    isSlotValid (): boolean {
      return Object.keys(this.$scopedSlots).length === 1
    },
    originValue() {
      const { getOrigin } = this.form || {}
      if (typeof getOrigin === 'function') {
        return getOrigin(this.name)
      }
      return undefined;
    },
    localValue: {
      get () {
        const { get } = this.form || {}
        if (typeof get === 'function') {
          return get(this.name)
        }
        return undefined
      },
      set (val) {
        this.onInput(val)
      },
    },
    pristine (): boolean {
      return this.localValue === this.originValue
    },
    dirty (): boolean {
      return !this.pristine
    },
  },
  methods: {
    onInput (newVal: unknown) {
      const { setField } = this.form || {}
      if (typeof setField === 'function') {
        setField(this.name, newVal)
      }
      this.$emit('input', this.name, newVal)
    },
    reset () {
      const { setField } = this.form || {}
      if (typeof setField === 'function') {
        setField(this.name, this.originValue)
      }
      this.onInput(this.originValue)
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  render (h): any {
    if (!this.isSlotValid) {
      throw new Error('FormField can only contain one root element')
    }
    const { default: defaultSlot } = this.$scopedSlots;
    if (defaultSlot) {
      const vnodes = defaultSlot({
        name: this.name,
        model: this.model,
        origin: this.origin,
        pristine: this.pristine,
        dirty: this.dirty,
        value: this.localValue,
        reset: this.reset,
      })
      return Array.isArray(vnodes) && vnodes.length ? vnodes[0] : null
    }

    return null
  },
})
