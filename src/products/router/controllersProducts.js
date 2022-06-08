import {
    getProducts,
    addProduct,
    getProductById,
    getProductByName,
    deleteProductById,
    replaceProduct
} from '../services/products.js'

export function getProductsController(req, res, next) {
    let products;
    if (req.query.productName) {
        products = getProductByName(req.query.productName);
    } else {
        products = getProducts();
    }
    res.json(products)
}

export function getProductController(req, res, next) {
    try {
        const product = getProductById(req.params.id)
        res.json(product)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

export function postProductController(req, res, next) {
    try {
        const product = req.body
        const addedProduct = addProduct(product)
        res.status(201).json(addedProduct)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

export function deleteProductController(req, res, next){
    try {
        deleteProductById(req.params.id)
        res.sendStatus(204)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

export function putProductsController(req, res, next) {
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
}