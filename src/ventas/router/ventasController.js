import { 
    getVentaByUsername, getVentas, getVentaById, addVenta, cancelVenta, changeProduct
} from '../services/ventas.js'


export function getVentasController(req, res, next){
    try {
        let ventas
    if (req.query.username) {
        ventas = getVentaByUsername(req.query.username)
    } else {
        ventas = getVentas()
    }
    res.json(ventas)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

export function getVentasByIdController(req, res, next){
    try {
        const venta = getVentaById(req.params.id)
        res.json(venta)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

export function postVentaController(req, res, next){
    try {
        const users = req.body.user
        const carrito = req.body.carrito
        const addedVenta = addVenta(users, carrito)
        res.status(201).json(addedVenta)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

export function putVentasCancelController(req, res, next) {
    try {
        const ventaUpdated = cancelVenta(req.params.id)
        res.json(ventaUpdated)
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

export function putVentasChangeController(req, res, next){
    try {
        const newProduct = req.body.np
        const oldProduct = req.body.op
        const ventaUpdated = changeProduct(req.params.id, newProduct, oldProduct)
        res.json(ventaUpdated)
    } catch (error) {
        if (error.tipo == 'not found') {
            res.status(404).json({
                error: error.message
            })
        } 
        if (error.message === 'ERROR. MISMO_NOMBRE') {
            res.status(409).json({
                error: error.message
            })
        }else {
            res.status(400).json({
                error: error.message
            })
        }
    }
}