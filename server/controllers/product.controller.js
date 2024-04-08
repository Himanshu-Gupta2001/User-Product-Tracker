const ProductModel = require('../models/product.model');

// to test loader, pagination loader, disable button
const sleep = async (duration) => new Promise((resolve) => setTimeout(() => resolve(), duration))

const addProduct = async (req, res) => {
    try {
        await sleep(500)
        await ProductModel.create({
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            amount: req.body.amount,
            tags: req.body.tags,
            userId: req.user._id,
        })
        res.status(200).send({ message: 'Add Product Successfully' });
    } catch (err) {
        console.log('addProduct', err);
        res.status(500).send({ message: 'Something went wrong' });
    }
}

const getProducts = async (req, res) => {
    try {
        await sleep(req.query.search.name !== '' ? 3000 : 500)
        const products = await ProductModel
            .find({
                userId: req.user._id, name: new RegExp(req.query.search.name, 'i')
            }, {
                name: 1, category: 1, createdOn: 1
            })
            .skip(Number(req.query.skip))
            .limit(Number(req.query.limit))
            .sort({ createdOn: -1 });

        res.status(200).send({ products });
    } catch (err) {
        console.log('getProducts', err);
        res.status(500).send({ message: 'Something went wrong' });
    }
}

const getProductById = async (req, res) => {
    try {
        await sleep(500)
        const product = await ProductModel.findOne({
            _id: req.params.id, userId: req.user._id
        }, {
            name: 1,
            category: 1,
            description: 1,
            amount: 1,
            tags: 1,
        })
        res.status(200).send({ product });
    } catch (err) {
        console.log('getProductById', err);
        res.status(500).send({ message: 'Something went wrong' });
    }
}

const updateProductById = async (req, res) => {
    try {
        await sleep(500)
        await ProductModel.updateOne({ _id: req.params.id, userId: req.user._id }, {
            $set: {
                name: req.body.name,
                category: req.body.category,
                description: req.body.description,
                amount: req.body.amount,
                tags: req.body.tags
            }
        })
        res.status(200).send({ message: 'Product Update Successfully' });
    } catch (err) {
        console.log('updateProductById', err);
        res.status(500).send({ message: 'Something went wrong' });
    }
}

module.exports = {
    addProduct,
    getProducts,
    getProductById,
    updateProductById,
}