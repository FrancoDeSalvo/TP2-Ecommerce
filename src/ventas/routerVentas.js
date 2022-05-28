import {Router} from 'express';

import { 
    getVentaByUsername, getVentas, getVentaById, addVenta, cancelVenta, changeProduct
} from '../ventas/ventas.js'

const routerVentas = new Router();

/*********************************************************************/
routerVentas.get('/', (req, res) => {
    let ventas
    if (req.query.username) {
        ventas = getVentaByUsername(req.query.username)
    } else {
        ventas = getVentas()
    }
    res.json(ventas)
})

routerVentas.get('/:id', (req, res) => {
    try {
        const venta = getVentaById(req.params.id)
        res.json(venta)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
})

routerVentas.post('/', (req, res) => {
    try {
        const users = req.body.user
        const carrito = req.body.carrito
        const addedVenta = addVenta(users, carrito)
        res.status(201).json(addedVenta)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

routerVentas.put('/cancel/:id', (req, res) => {
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
})

routerVentas.put('/change/:id', (req, res) => {
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
})

export { routerVentas }