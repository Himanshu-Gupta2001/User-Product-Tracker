import { makeSession } from '../../utils/authentication.util.js';
import template from './Login.template.js'
import { Form, Field, ErrorMessage, useForm } from '@vee-validate'
import axios from '@axios'
import VueRouter from '@vue-router'

console.log('login')

export default {
    name: 'Login',
    components: {
        'v-form': Form,
        'v-field': Field,
        'error-message': ErrorMessage,
    },
    setup() {
        const { setErrors, handleSubmit, isSubmitting } = useForm();
        const { useRouter, useRoute } = VueRouter;
        const router = useRouter();
        const route = useRoute()

        const handleLogin = handleSubmit(async (data) => {
            try {
                const res = await axios({
                    url: '/api/login',
                    method: 'POST',
                    data: data,
                });
                makeSession(res.data)
                router.replace(route.query.redirect ?? '/')
            } catch (err) {
                console.error(err);
                if (err?.response?.data?.status === "NOT_EXISTS") {
                    setErrors({
                        email: 'Email Not Exists!'
                    })
                } else if (err?.response?.data?.status === "PASSWORD_NOT_MATCHED") {
                    setErrors({
                        password: 'Password Not Matched!'
                    })
                }
            }
        });

        return {
            handleLogin,
            isSubmitting,
        }
    },
    template: template
}