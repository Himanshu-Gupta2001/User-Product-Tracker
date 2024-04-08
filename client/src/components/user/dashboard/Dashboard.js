import store from '../../../store.js';
import template from './Dashboard.template.js'

export default {
    name: 'Dashboard',
    setup() {

        return {
            store
        }
    },
    template: template
}