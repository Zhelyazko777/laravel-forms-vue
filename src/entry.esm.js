
// Import vue components
import * as components from '@/components/index';
import { initRules } from './validation-rules';
import { localize } from "vee-validate";
import { ValidationProvider, ValidationObserver } from 'vee-validate';

// install function executed by Vue.use()
const install = function installLaravelFormsVue(Vue, options) {
  initRules();
  localize(options.veeDefaultLocale, require(`vee-validate/dist/locale/${options.veeDefaultLocale}.json`));
  localize(options.veeTranslations);

  Vue.prototype.$laravelFormsConfig = {
    componentTranslations: options.componentTranslations,
  };
  
  Vue.component('validation-provider', ValidationProvider);
  Vue.component('validation-observer', ValidationObserver);
  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component);
  }); 
};

// Create module definition for Vue.use()
export default install;

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from '@/components/index';
