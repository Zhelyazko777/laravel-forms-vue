<template>
    <div>
        <select v-model="binding" class="form-control" :disabled="disabled">
            <option
                v-for="option of options"
                :value="option.value">
                {{option.text}}
            </option>
        </select>
        <select :name="name" hidden>
            <option
                v-for="option of options"
                :value="option.value"
                :selected="binding == option.value">
                {{option.text}}
            </option>
        </select>
    </div>
</template>

<script>
import FormInputMixin from './../mixins/form-input-mixin';

export default {
    mixins: [
        FormInputMixin,
    ],
    props: {
        options: {
            type: Array,
            required: true,
        },
    }
}
</script>

<style>

</style>
