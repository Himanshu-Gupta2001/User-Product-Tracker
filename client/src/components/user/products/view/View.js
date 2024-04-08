import { getAuthHeader } from '../../../../utils/authentication.util.js';
import template from './View.template.js'
const { ref, onMounted } = Vue;
import VueRouter from '@vue-router'
const { useRoute } = VueRouter;
import { formatCurrency } from '../../../../utils/format.util.js';
import axios from '@axios' 

export default {
    name: 'Products',
    setup() {
        const route = useRoute()
        const product = ref({});
        const isLoading = ref(false)

        onMounted(() => {
            getProductById()
        })

        const getProductById = async () => {
            try {
                isLoading.value = true;
                const res = await axios({
                    url: `/api/products/${route.params.id}`,
                    method: 'GET',
                    headers: getAuthHeader()
                })
                product.value = res.data.product
            } catch (err) {
                console.error(err);
            } finally {
                isLoading.value = false;
            }
        }

        return {
            product,
            isLoading,
            formatCurrency,
        }
    },
    template: template
}