import { Form, Local, Model, Origin } from '@/utils/provider.symbol';
import Vue, { PropType } from 'vue'
import _isEqual from 'lodash/isEqual'
import _set from 'lodash/set'
import _get from 'lodash/get'
import _cloneDeep from 'lodash/cloneDeep'

/* @vue/component */
export default Vue.extend({
  name: 'Form',
  provide(): Record<string, any> {
    return {
      [Form]: this,
      [Model]: this.$props.model,
      [Origin]: this.origin$,
      [Local]: this.local,
    }
  },
  props: {
    model: {
      type: Object as PropType<Record<string, any>>,
      required: true,
      default: () => null
    },
    origin: {
      type: [
        Object,
        Function
      ] as PropType<Record<string, any> | {(): Promise<any>}>,
      default: () => null
    },
    tag: {
      type: String,
      default: 'div'
    },
    slim: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    local: null,
    origin$: null,
    isLoading: false,
    error: null,
  }),
  computed: {
    isActuallySlim (): boolean {
      return Object.keys(this.$scopedSlots).length === 1
    },
    hasCombinedSlot (): boolean {
      return typeof this.$scopedSlots['combined'] === 'function'
    },
    pristine (): boolean {
      return _isEqual(this.origin$, this.local)
    },
    dirty (): boolean {
      return !this.pristine
    },
  },
  watch: {
    origin: {
      immediate: true,
      deep: true,
      async handler (val): Promise<void> {
        this.error = null
        this.isLoading = false

        let origin;
        if (typeof val !== 'function') {
          this.origin$ = _cloneDeep(val)
          return
        }
        try {
          origin = val()
          if (origin instanceof Promise) {
            this.isLoading = true
            origin = await origin
          }
          this.origin$ = val
        } catch (e) {
          this.error = e
        } finally {
          this.isLoading = false
        }
      }
    }
  },
  methods: {
    set (name: string, value: any) {
      if (!this.local) {
        return
      }
      if (name.includes('.')) {
        _set((this.local as any), name, value)
      } else {
        this.$set((this.local as any), name, value)
      }
    },
    get$ (obj: Record<string, any> | null, name?: string) {
      if (!name) {
        throw new Error('name must be supplied')
      } else if (name.includes('.')) {
        return _get(obj, name)
      } else {
        return obj?.[name]
      }
    },
    get (name?: string) {
      return this.get$(this.local, name)
    },
    getOrigin (name?: string) {
      return this.get$(this.origin, name)
    },
    reset (): void {
      this.local = _cloneDeep(this.origin$)
    },
    renderScopedSlot (slotName: string, props?: any) {
      const scopedSlots = this.$scopedSlots[slotName]?.(props)
      if (this.slim && this.isActuallySlim) {
        return scopedSlots?.[0]
      }
      return this.$createElement(this.tag, scopedSlots)
    }
  },
  render (h): any {
    const errorSlotProps = {
      error: this.error
    }
    const loadingSlotProps = {
      pending: this.isLoading
    }
    const defaultSlotProps = {
      model: this.model,
      origin: this.origin$,
      local: this.local,
      reset: this.reset,
      pristine: this.pristine,
      dirty: this.dirty,
    }
    if (this.hasCombinedSlot) {
      return this.renderScopedSlot('combined', {
        ...errorSlotProps,
        ...loadingSlotProps,
        ...defaultSlotProps
      })
    }
    if (this.isLoading) {
      return this.renderScopedSlot('pending', loadingSlotProps)
    }

    if (this.error) {
      return this.renderScopedSlot('error', errorSlotProps)
    }

    return this.renderScopedSlot('default', defaultSlotProps)
  }
})