export default {
    data () {
        return {
            binding: this.value,
        }
    },
    props: {
        name: {
            type: String,
            required: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        value: {
            required: true,
        },
        id: {
           type: String,
        },
        placeholder: {
            type: String,
        }
    },
    watch: {
        binding (newVal) {
            this.$emit('input', newVal);
        }
    }
}
