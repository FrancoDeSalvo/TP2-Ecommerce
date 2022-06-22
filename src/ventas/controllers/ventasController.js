import { 
    getVentaByUsername, getVentas, getVentaById, addVenta, cancelVenta, changeProduct
} from '../services/serviceVentas.js'

//--------------------------------------------------------------------------------
export async function getAll(req, res, next){
    let ventas
    try {
    if (req.query.username) {
        ventas = await getVentaByUsername(req.query.username)
    } else {
        ventas = await getVentas()
    }
    res.json(ventas)
    } catch (error) {
        next(error)
    }
}

export async function getById(req, res, next){
    try {
        const venta = await getVentaById(req.params.id)
        res.json(venta)
    } catch (error) {
        next(error)
    }
}

export async function post(req, res, next){
    try {
        const u = req.body.user
        const c = req.body.carrito
        const addedVenta = await addVenta(u, c)
        res.status(201).json(addedVenta)
    } catch (error) {
        next(error)
    }
}

export async function putCancel(req, res, next) {
    try {
        const ventaUpdated = await cancelVenta(req.params.id)
        res.json(ventaUpdated)
    } catch (error) {
        next(error)
    }
}

export async function putChange(req, res, next){
    try {
        const newProduct = req.body.np
        const oldProduct = req.body.op
        const ventaUpdated = await changeProduct(req.params.id, newProduct, oldProduct)
        res.json(ventaUpdated)
    } catch (error) {
        next(error)
    }
}