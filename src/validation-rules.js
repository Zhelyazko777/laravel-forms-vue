import { extend } from 'vee-validate';
import { required, ext, numeric, min_value, min, max } from 'vee-validate/dist/rules';

export const initRules = () => {
  extend('min', min);
  extend('max', max);
  extend('required', required);
  extend('min_value', min_value);
  extend('ext', ext);
  extend('numeric', numeric);
  extend('Phone',  {
      validate: value => {
          return /^(\+)?(359|0)(8|9)[0-9]{8}$/.test(value);
      },
      message: 'Въведеният телефон е невалиден'
  });
  extend("lt", {
      params: ["target"],
      validate(value, { target }) {
          return Number(value) < Number(target);
      },
      message: "Минималната цена трябва да е по-малка от максималната"
  });
  
  extend("gt", {
      params: ["target"],
      validate(value, { target }) {
          return Number(value) > Number(target);
      },
      message: "Максималната цена трябва да е по-голяма от минималната"
  });  
};
