import { getAuthHeader } from '../../../utils/authentication.util.js';
import template from './Products.template.js'
const { reactive, ref, onMounted, watch } = Vue;
const { useRouter } = VueRouter;
import axios from '@axios';
import VueRouter from '@vue-router'
console.log('products')

class AsyncDebounce {
    timeout
    timer
    constructor(timer) {
        this.timer = timer
    }
    call(callback, ...args) {
        console.log('initiate')
        clearTimeout(this.timeout)
        this.timeout = setTimeout(async () => {
            console.log('call', await callback(...args))
        }, this.timer)
    }
}

export default {
    name: 'Products',

    setup() {
        const router = useRouter()
        const products = ref({
            skip: 0,
            limit: 15,
            hasMore: false,
            list: [],
            isScrollLoading: false,
            isLoading: false,
        });
        const search = reactive({
            name: ''
        })
        const debounce = new AsyncDebounce(500)

        onMounted(() => {
            getProducts()
        })

        watch(search, () => {
            debounce.call(getProducts)
        })

        const goToAddProduct = () => router.push('/products/add')

        const getProducts = async (isScroll) => {
            try {
                if (isScroll) {
                    products.value.isScrollLoading = true
                    products.value.skip = 0
                } else
                    products.value.isLoading = true

                const res = await axios({
                    url: '/api/products',
                    method: 'GET',
                    params: {
                        search,
                        skip: isScroll ? products.value.skip : 0,
                        limit: products.value.limit,
                    },
                    headers: getAuthHeader()
                });

                products.value.hasMore = res.data.products.length === products.value.limit;
                products.value.skip += products.value.limit;

                if (isScroll) {
                    products.value.list = products.value.list.concat(res.data.products);
                } else {
                    products.value.list = res.data.products;
                }

            } catch (err) {
                console.error(err);
            } finally {
                products.value.isScrollLoading = false
                products.value.isLoading = false
            }
        }

        return {
            products,
            goToAddProduct,
            getProducts,
            search,
        }
    },
    template: template
}