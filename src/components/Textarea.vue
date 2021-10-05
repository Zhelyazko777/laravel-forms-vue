<template>
    <div class="w-100">
        <textarea
            v-model="binding"
            :class="classList"
            :disabled="disabled"
            :cols="cols"
            :rows="rows"
            :placeholder="placeholder"
            :maxlength="maxlength"
            :minlength="minlength"
            class="form-control">
        </textarea>
        <textarea
              type="text"
              hidden
              :value="binding"
              :name="name"
              :disabled="disabled">
        </textarea>

        <div v-if="maxlength" class="char-counter mt-1 text-right">
            {{i18n('chars_left')}}: {{maxlength - charsTyped}} / {{maxlength}}
        </div>
    </div>
</template>

<script>
import FormInputMixin from './../mixins/form-input-mixin';

export default {
    data () {
      return {
          translationsPath: 'vue_components/form/textarea',
      };
    },
    mixins: [
        FormInputMixin
    ],
    props: {
        cols: {
            type: Number|null,
        },
        rows: {
            type: Number|null,
        },
        classList: {
            type: String,
        },
        maxlength:  {
            type: Number|null,
            default: null,
        },
        minlength:  {
            type: Number|null,
            default: null,
        },
    },
    computed: {
        charsTyped() {
            return this.binding ? this.binding.length : 0;
        }
    }
}
</script>

<style lang="scss" scoped>
@import './../scss/vue.scss';
textarea {
    @include md {
        font-size: .9em;
    }
}
.char-counter {
    font-size: .9em;
}
</style>
