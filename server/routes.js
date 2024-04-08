const AuthenticationController = require('./controllers/authentication.controller');
const ProductController = require('./controllers/product.controller');
const { checkUserAuthentication } = require('./middlewares/authentication.middleware');

const router = require('express').Router();

router.post('/signup', AuthenticationController.signup)
router.post('/login', AuthenticationController.login)

router.post('/session', checkUserAuthentication, AuthenticationController.session)

router.get('/products', checkUserAuthentication, ProductController.getProducts)
router.get('/products/:id', checkUserAuthentication, ProductController.getProductById)
router.post('/products', checkUserAuthentication, ProductController.addProduct)
router.put('/products/:id', checkUserAuthentication, ProductController.updateProductById)

module.exports = router