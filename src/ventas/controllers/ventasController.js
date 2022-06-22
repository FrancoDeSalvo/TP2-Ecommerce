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

/*
export async function getAll(req, res){
    let ventas
    try {
    if (req.query.username) {
        ventas = await getVentaByUsername(req.query.username)
    } else {
        ventas = await getVentas()
    }
    res.json(ventas)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

export async function getById(req, res){
    try {
        const venta = await getVentaById(req.params.id)
        res.json(venta)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

export async function post(req, res){
    try {
        const u = req.body.user
        const c = req.body.carrito
        const addedVenta = await addVenta(u, c)
        res.status(201).json(addedVenta)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

export async function putCancel(req, res) {
    try {
        const ventaUpdated = await cancelVenta(req.params.id)
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

export async function putChange(req, res){
    try {
        const newProduct = req.body.np
        const oldProduct = req.body.op
        const ventaUpdated = await changeProduct(req.params.id, newProduct, oldProduct)
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
*/