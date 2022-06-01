import {Router} from 'express';

import { 
    getCarritos, getCarritoById, getProductsByUserId, addToCarrito, deleteProduct, deleteAllItems
} from '../services/carrito.js'

const routerCarrito = new Router();

/*********************************************************************/
routerCarrito.get('/', (req, res) => {
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
})

routerCarrito.get('/:id', (req, res) => {
    try {
        const carrito = getCarritoById(req.params.id)
        res.json(carrito)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
})

routerCarrito.put('/', (req, res) => {
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
})

routerCarrito.delete('/:id', (req, res) => {
    try {
        deleteAllItems(req.params.id)
        res.sendStatus(204)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
})

// routerCarrito.post('/', (req, res) => {
//     try {
//         const idUser = req.body.idUser;
//         const products = req.body.products;
//         const addedCarrito = addToCarrito(products, idUser)
//         res.status(201).json(addedCarrito)
//     } catch (error) {
//         res.status(400).json({error: error.message})
//     }
// })

// routerCarrito.put('/change/:id', (req, res) => {
//     try {
//         const newProduct = req.body.np
//         const oldProduct = req.body.op
//         const ventaUpdated = changeProduct(req.params.id, newProduct, oldProduct)
//         res.json(ventaUpdated)
//     } catch (error) {
//         if (error.tipo == 'not found') {
//             res.status(404).json({
//                 error: error.message
//             })
//         } else {
//             res.status(400).json({
//                 error: error.message
//             })
//         }
//     }
// })

export { routerCarrito }