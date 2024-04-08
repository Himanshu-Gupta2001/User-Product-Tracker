const Home = () => import('./components/home/Home.js')
const Login = () => import('./components/login/Login.js')
const Registration = () => import('./components/registration/Registration.js')
const Dashboard = () => import('./components/user/dashboard/Dashboard.js')
const About = () => import('./components/user/about/About.js')
const Contact = () => import('./components/user/contact/Contact.js')
const Products = () => import('./components/user/products/Products.js')
const AddProduct = () => import('./components/user/products/add/Add.js')
const EditProduct = () => import('./components/user/products/edit/Edit.js')
const ViewProduct = () => import('./components/user/products/view/View.js')
const Logout = () => import('./components/logout/Logout.js')

export default [
    { path: '/', name: 'Home', component: Home },
    { path: '/login', name: 'Login', component: Login, meta: { guest: true } },
    { path: '/registration', name: 'Registration', component: Registration, meta: { guest: true } },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiredAuth: true } },
    { path: '/about', name: 'About', component: About, meta: { requiredAuth: true } },
    { path: '/contact', name: 'Contact', component: Contact, meta: { requiredAuth: true } },
    { path: '/products', name: 'Products', component: Products, meta: { requiredAuth: true } },
    { path: '/products/add', name: 'AddProducts', component: AddProduct, meta: { requiredAuth: true } },
    { path: '/products/edit/:id', name: 'EditProducts', component: EditProduct, meta: { requiredAuth: true } },
    { path: '/products/:id', name: 'ViewProduct', component: ViewProduct, meta: { requiredAuth: true } },
    { path: '/logout', name: 'Logout', component: Logout },
    { path: '/:pathMatch(.*)*', name: 'Error404', component: { template: '404' } },
]