import template from './Edit.template.js'
import { getAuthHeader } from "../../../../utils/authentication.util.js";
import { useForm, Field, ErrorMessage } from '@vee-validate';
import VueRouter from '@vue-router'
const { useRouter, useRoute } = VueRouter;
const { ref } = Vue;
import axios from '@axios'

import TheNumberInput from '@number-input'
import VueformMultiselect from '../../../../assets/libraries/multiselect@2.6.6.js'

export default {
    name: 'Add',
    components: {
        'Field': Field,
        'ErrorMessage': ErrorMessage,
        'TheNumberInput': TheNumberInput,
        'VueformMultiselect': VueformMultiselect,
    },
    setup() {
        const { handleSubmit, isSubmitting, resetForm } = useForm();
        const router = useRouter();
        const route = useRoute();
        const isLoading = ref(false)

        Vue.onMounted(() => {
            getProductById()
        })

        const getProductById = async () => {
            try {
                isLoading.value = true;
                const res = await axios({
                    url: `/api/products/${route.params.id}`,
                    method: 'GET',
                    headers: getAuthHeader()
                });
                resetForm({ values: res.data.product })
            } catch (err) {
                console.error(err)
            } finally {
                isLoading.value = false;
            }
        }

        const handleAddProduct = handleSubmit(async (data) => {
            try {
                await axios({
                    url: `/api/products/${route.params.id}`,
                    method: 'PUT',
                    data: data,
                    headers: getAuthHeader()
                })
                router.push(`/products/${route.params.id}`)
            } catch (err) {
                console.error(err)
            }
        })

        return {
            handleAddProduct,
            isSubmitting,
            isLoading,
        }
    },
    template: template
}