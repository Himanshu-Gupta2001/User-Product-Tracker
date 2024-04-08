import { removeToken } from "../../utils/authentication.util.js"

export default {
    name: 'Logout',
    setup() {
        console.log('logut initiated')
        removeToken()
        window.location.replace('/')
    },
    template: ''
}