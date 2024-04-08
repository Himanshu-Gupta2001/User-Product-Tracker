import VueFlatpickr from '@vue-flatpickr-component'

export default {
    components: {
        VueFlatpickr: VueFlatpickr
    },
    props: {
        name: {
            type: String,
            required: false,
        },
        value: {
            type: String,
            required: false,
        },
        modelValue: {
            type: String,
            required: false,
        },
    },
    emits: ['blur', 'change', 'input', 'update:model-value', 'input:model-value'],
    setup(props, { emit }) {
        const fieldValue = Vue.ref(props.value ?? props.modelValue ?? null);

        const config = Vue.ref({
            disableMobile: true,
            enableTime: true,
            dateFormat: "m/d/Y",
            allowInput: "true",
            monthSelectorType: "dropdown",
        })

        Vue.watch(() => props.modelValue, (newValue) => {
            fieldValue.value = newValue
        })

        Vue.watch(() => props.value, (newValue) => {
            fieldValue.value = newValue
        })

        Vue.watch(() => fieldValue, (newValue) => {
            emit('update:model-value', newValue.value)
        }, { deep: true })

        return {
            fieldValue,
            config,
        }
    },
    template: `<VueFlatpickr v-model="fieldValue" :config="config" />`
}
