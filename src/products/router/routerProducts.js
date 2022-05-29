import {Router} from 'express';

import {
    getProducts,
    addProduct,
    getProductById,
    getProductByName,
    deleteProductById,
    replaceProduct
} from '../services/products.js'

const routerProducts = new Router();


routerProducts.get('/', (req, res) => {
    let products;
    if (req.query.productName) {
        products = getProductByName(req.query.productName);
    } else {
        products = getProducts();
    }
    res.json(products)
})

routerProducts.get('/:id', (req, res) => {
    try {
        const product = getProductById(req.params.id)
        res.json(product)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
})

routerProducts.post('/', (req, res) => {
    try {
        const product = req.body
        const addedProduct = addProduct(product)
        res.status(201).json(addedProduct)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

routerProducts.delete('/:id', (req, res) => {
    try {
        deleteProductById(req.params.id)
        res.sendStatus(204)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
})

routerProducts.put('/:id', (req, res) => {
    try {
        const productUpdate = req.body
        const productUpdated = replaceProduct(req.params.id, productUpdate)
        res.json(productUpdated)
    } catch (error) {
        if (error.tipo == 'not found') {
            res.status(404).json({
                error: error.message
            })
        } else {
            res.status(400).json({
                error: error.message
            })
        }
    }
})


export { routerProducts }