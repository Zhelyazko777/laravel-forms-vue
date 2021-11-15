<template>
    <validation-observer v-slot="{valid, dirty}">
        <form :action="config.action" @submit="onFormSubmit" method="post">
            <input type="hidden" name="_token" :value="csrf">
            <div class="row">
                <div
                    v-for="control of config.controls"
                    :key="control.name"
                    :class="getColumnSize(control.columnsToTake, control.columnsToTakeOnMobile) + (control.hidden ? ' d-none' : '')"
                    class="reusable-form-group form-group">
                        <validation-provider
                            v-slot="v"
                            :rules="control.rules | rules(ruleBindings, rulesToSkip)"
                            :name="control.label"
                            :customMessages="customErrorMessages[control.name]"
                        >
                            <label
                                :class="control.rules.includes('required') ? 'required' : ''">
                                {{control.label}}
                            </label>
                            <reusable-input
                                v-if="control.type === 'input'"
                                v-model="control.value"
                                :disabled="control.disabled"
                                :type="control.inputType"
                                :name="control.name"
                            ></reusable-input>
                            <reusable-textarea
                                v-else-if="control.type === 'textarea'"
                                v-model="control.value"
                                :disabled="control.disabled"
                                :maxlength="control.maxLength"
                                :minlength="control.minLength"
                                :name="control.name"
                                :cols="control.cols"
                                :rows="control.rows">
                            </reusable-textarea>
                            <reusable-select
                                v-else-if="control.type === 'select'"
                                v-model="control.value"
                                :disabled="control.disabled"
                                :name="control.name"
                                :options="control.options">
                            </reusable-select>
                            <reusable-tags-input
                                v-else-if="control.type === 'multiselect'"
                                v-model="control.value"
                                :options="control.options"
                                :disabled="control.disabled"
                                :name="control.name">
                            </reusable-tags-input>
                            <reusable-image-uploader
                                v-else-if="control.type === 'galleryUploader'"
                                v-model="control.value"
                                :uploadRoute="control.uploadRoute"
                                :loadRoute="control.loadImagesRoute"
                                :removeRoute="control.removeImageRoute"
                                :supportedMimes="control.supportedMimes.split(',')"
                                :maxImageFileSize="control.maxImageFileSize"
                            ></reusable-image-uploader>
                            <span class="form-error">{{ v.errors[0] }}</span>
                        </validation-provider>
                </div>
            </div>
            <div class="btn-container">
                <button
                    v-if="config.submitButton"
                    :disabled="!valid || !dirty"
                    type="submit"
                    class="btn btn-primary">
                    {{config.submitButton.text}}
                </button>
            </div>
        </form>
    </validation-observer>
</template>

<script>
import CsrfMixin from './../mixins/csrf-mixin';
import Input from './Input.vue';
import ImageUploader from './ImageUploader.vue';
import Select from './Select.vue';
import SwitchTabs from './SwitchTabs.vue';
import TagsInput from './TagsInput.vue';
import Textarea from './Textarea.vue';

export default {
    data () {
        return {
            customErrorMessages: {},
            ruleBindings: {
                'gt': 'max_min_price',
                'lt': 'min_max_price',
                'Phone': 'phone',
            },
            rulesToSkip: [
              'exists',
            ]
        };
    },
    name: 'reusable-form',
    components: {
        'reusable-input': Input,
        'reusable-select': Select,
        'reusable-switch-tabs': SwitchTabs,
        'reusable-tags-input': TagsInput,
        'reusable-textarea': Textarea,
        'reusable-image-uploader': ImageUploader,
    },
    mixins: [
        CsrfMixin,
    ],
    props: {
        config: {
            type: Object,
            required: true,
        },
    },
    filters: {
        rules (rules, ruleBindings, rulesToSkip) {
            if (!rules) {
                return undefined;
            }
            
            return rules
              .map((rule) => {
                const ruleParts = rule.split(':');
                const ruleName = ruleParts[0];
                if (rulesToSkip && rulesToSkip.includes(ruleName)) {
                    return undefined;
                }
                
                if (ruleParts.length > 1) {
                    const ruleValue = ruleParts[1];
                    let jsRule = ruleBindings[ruleName];
                    if (!jsRule) {
                        jsRule = rule;
                    }

                    return jsRule + ':@' + ruleValue
                } else {
                    let jsRule = ruleBindings[ruleName]
                    if (!jsRule) {
                        jsRule = rule;
                    }

                    return jsRule;
                }
              })
              .filter(r => !!r)
              .join('|');
        },
    },
    created () {
        this.setCustomValidationMessages(this.config.controls);
    },
    methods: {
        onFormSubmit ($event) {
          if (this.config.callback && !this.config.action) {
            $event.preventDefault();
            window[this.config.callback](
              this.config.controls.map(c => { return { name: c.name, value: c.value }; })
            );
          }
        },
        getColumnSize (desktopSize, mobileSize) {
            return `col-lg-${desktopSize} col-md-${mobileSize}`;
        },
        setCustomValidationMessages (controls) {
            for (const control of controls) {
                const messages = control.clientErrorMessages;
                this.customErrorMessages[control.name] = {};

                for (const rule in messages) {
                    const message = messages[rule];
                    if (message && message.length > 0) {
                        let jsRuleName = this.ruleBindings[rule]?.name;
                        if (!jsRuleName) {
                            jsRuleName = rule;
                        }
                        this.customErrorMessages[control.name][jsRuleName] = message;
                    }
                }
            }
        },
    }
}
</script>

<style lang="scss" scoped>
@import './../scss/vue.scss';
    .btn-container {
        margin-top: 15px;

        button {
            display: block;
        }
    }
</style>
