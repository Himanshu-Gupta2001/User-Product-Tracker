import template from './Add.template.js'
import { getAuthHeader } from "../../../../utils/authentication.util.js";
import { useForm, Field, ErrorMessage } from '@vee-validate';
const { useRouter } = VueRouter;
import axios from '@axios'
import VueRouter from '@vue-router'

import TheNumberInput from '@number-input'
import VueformMultiselect from '../../../../assets/libraries/multiselect@2.6.6.js'
import TheFlatPickr from '../../../common/flatpickr/TheFlatPickr.js';
import TheContentEditable from '../../../common/content-editable/TheContentEditable.js';

export default {
    name: 'Add',
    components: {
        'Field': Field,
        'ErrorMessage': ErrorMessage,
        'TheNumberInput': TheNumberInput,
        'VueformMultiselect': VueformMultiselect,
        TheFlatPickr: TheFlatPickr,
        TheContentEditable: TheContentEditable,
    },
    setup() {
        const { handleSubmit, isSubmitting } = useForm();
        const router = useRouter()

        const handleAddProduct = handleSubmit(async (data) => {
            try {
                await axios({
                    url: '/api/products',
                    method: 'POST',
                    data: data,
                    headers: getAuthHeader()
                })
                router.push('/products')
            } catch (err) {
                console.error(err)
            }
        })

        return {
            handleAddProduct,
            isSubmitting,
        }
    },
    template: template
}