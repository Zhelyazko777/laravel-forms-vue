<template>
    <div>
        <select
            v-if="isThereNotSelectedOptions"
            :value="selectValue"
            @change="onSelectChange"
            class="form-control">
                <option value="" :selected="selectValue == null" disabled>{{ placeholder }}</option>
                <option v-for="option in notSelectedOptions" :key="option.value" :value="option.value">
                    {{ option.text }}
                </option>
        </select>
        <div class="labels-container" :class="isThereNotSelectedOptions ? 'mt-3' : ''">
            <span class="badge badge-primary" v-for="selectedOption in selectedOptions" :key="selectedOption.value">
                {{ selectedOption.text }}
                <i class="fas fa-times" @click="onTagRemoveClick(selectedOption.value)"></i>
            </span>
        </div>

        <select
            :name="name + '[]'"
            :id="name"
            multiple
            hidden>
            <option
                v-for="option in options"
                :key="option.value"
                :selected="binding.some(x => x.value == option.value)"
                :value="option.value">
            </option>
        </select>
    </div>
</template>

<script>
import FormInputMixin from './../mixins/form-input-mixin';

export default {
    data () {
        return {
            binding: [ ...this.value ],
            selectValue: null,
            selectOptions: [ ...this.options ],
        }
    },
    mixins: [
        FormInputMixin
    ],
    props: {
        options: {
            type: Array,
            default: _ => [],
        },
        label: {
            type: String,
            default: null,
        },
        required: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
            default: '',
        }
    },
    computed: {
        notSelectedOptions () {
            return this.selectOptions.filter(o => !this.binding.some(x => x.value == o.value));
        },
        isThereNotSelectedOptions () {
            return this.notSelectedOptions.length > 0;
        },
        selectedOptions () {
            return this.selectOptions.filter(o => this.binding.some(x => x.value == o.value));
        }
    },
    methods: {
        onSelectChange ($event) {
            const chosenOption = this.selectOptions.filter(o => o.value == $event.target.value)[0];
            this.binding = [...this.binding, chosenOption];
            this.selectValue = null;
        },
        onTagRemoveClick (optionValue) {
            const optionToRemoveIndex = this.binding.findIndex(o => o.value === optionValue);
            this.binding.splice(optionToRemoveIndex, 1);
        }
    },
}
</script>

<style lang="scss" scoped>
@import './../scss/vue.scss';
.labels-container {
    span {
        margin: 6px;
        font-size: 14px;
        padding: 7px 10px;
        color: white;
        border-radius: 22px;

        i {
            margin-left: 5px;
            font-size: 13px;
            cursor: pointer;
        }
    }
}
</style>
