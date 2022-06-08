import { 
    getCarritos, getCarritoById, getProductsByUserId, addToCarrito, deleteProduct, deleteAllItems
} from '../services/carrito.js'

//CONTROLLER SON AQUELLOS MIDDLEWARES QUE NOS DAN UNA RESPUESTA (res.json(), res.send(), etc.)
/*
export function getCarritoController(req, res, next){
    try {
        let c
        if (req.query.idUser) {
            c = getProductsByUserId(req.query.idUser)
        } else {
            c = getCarritos();
        }
        res.json(c)
    } catch (error) {
        error.tipo = 'NOT_FOUND'
        next(error)
    }
}

export function getCarritoByIdController(req, res, next){
    if(req.params.id) {
        const carrito = getCarritoById(req.params.id)
        res.json(carrito)
    } else{
        const errorNoEncontrado = new Error('NO SE ENCONTRO DICHO CARRITO')
        errorNoEncontrado.tipo = 'NOT_FOUND'
        next(errorNoEncontrado)
    }
}

export function putCarritoController(req, res, next){
    try {
        const newProduct = req.body.np;
        const carrito = req.body.c;
        const deletedProduct = req.body.dp;
        let carritoUpdated;
        if(newProduct){
            carritoUpdated = addToCarrito(newProduct, carrito.idUser)
            res.json(carritoUpdated)
        }
        else{
            carritoUpdated = deleteProduct(carrito, deletedProduct)
            res.json(carritoUpdated)
        }
    } catch (error) {
        if (error.tipo == 404) {
            error.tipo = 'NOT_FOUND'
            next(error)
        } else {
            error.tipo = 'NO_CONTENT'
            next(error)
        }
    }
}

export function deleteCarritoController(req, res, next){
    if(req.params.id) {
        deleteAllItems(req.params.id)
        res.sendStatus(204)
    } else{
        const errorNoEncontrado = new Error('NO SE ENCONTRO DICHO CARRITO')
        errorNoEncontrado.tipo = 'NOT_FOUND'
        next(errorNoEncontrado)
    }
}
*/
export function getCarritoController(req, res, next){
    try {
        let c
        if (req.query.idUser) {
            c = getProductsByUserId(req.query.idUser)
        } else {
            c = getCarritos();
        }
        res.json(c)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

export function getCarritoByIdController(req, res, next){
    try {
        const carrito = getCarritoById(req.params.id)
        res.json(carrito)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

export function putCarritoController(req, res, next){
    try {
        const newProduct = req.body.np;
        const carrito = req.body.c;
        const deletedProduct = req.body.dp;
        let carritoUpdated;
        if(newProduct){
            carritoUpdated = addToCarrito(newProduct, carrito.idUser)
            res.json(carritoUpdated)
        }
        else{
            carritoUpdated = deleteProduct(carrito, deletedProduct)
            res.json(carritoUpdated)
        }
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

export function deleteCarritoController(req, res, next){
    try {
        deleteAllItems(req.params.id)
        res.sendStatus(204)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}