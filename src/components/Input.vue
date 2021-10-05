<template>
    <div>
        <input
            v-model="binding"
            :min="min"
            :mix="max"
            :type="type"
            :placeholder="placeholder"
            :disabled="disabled"
            class="form-control"/>
        <input type="text" :value="binding" :name="name" hidden/>
    </div>
</template>

<script>
import FormInputMixin from './../mixins/form-input-mixin';

export default {
    mixins: [
        FormInputMixin
    ],
    props: {
        type: {
            type: String,
            required: true,
        },
        min: {
            type: Number,
        },
        max: {
            type: Number,
        }
    }
}
</script>

<style lang="scss" scoped>

input {
@import './../scss/vue.scss';
    @include md {
        font-size: .9em;
    }
}
</style>
