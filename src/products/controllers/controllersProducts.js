import * as api from '../services/products.js'

export async function getProductsController(req, res, next) {
    let products;
    if (req.query.productName) {
        products = await api.getProductByName(req.query.productName);
    } else {
        products = await api.getProducts();
    }
    res.json(products)
}

export async function getProductController(req, res, next) {
    try {
        const product = await api.getProductById(req.params.id)
        res.json(product)
    } catch (error) {
        next(error)
    }
}

export async function postProductController(req, res, next) {
    try {
        const product = req.body
        const addedProduct = await api.addProduct(product)
        res.status(201).json(addedProduct)
    } catch (error) {
        // res.status(400).json({error: error.message})
        next(error)
    }
}

export async function deleteProductController(req, res, next){
    try {
        await api.deleteProductById(req.params.id)
        res.sendStatus(204)
    } catch (error) {
        // res.status(404).json({
        //     error: error.message
        // })
        next(error)
    }
}

export async function putProductsController(req, res, next) {
    try {
        const productUpdate = req.body
        const productUpdated = await api.replaceProduct(req.params.id, productUpdate)
        res.json(productUpdated)
    } catch (error) {
        // if (error.tipo == 'not found') {
        //     res.status(404).json({
        //         error: error.message
        //     })
        // } else {
        //     res.status(400).json({
        //         error: error.message
        //     })
        // }
        next(error)
    }
}