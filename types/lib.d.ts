declare module '@apdm/vue-form-composition-pattern/lib' {
  import { VueConstructor } from "vue/types/umd";
  
  const Form: VueConstructor
  const FormField: VueConstructor

  export {
    Form,
    FormField
  }
}