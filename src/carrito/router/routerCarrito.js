import {Router} from 'express';

import {
    getCarritoController, getCarritoByIdController, putCarritoController, deleteCarritoController
} from '../router/carritoController.js'

//=========================================================================
const routerCarrito = new Router();

//=========================================================================
routerCarrito.use((req, res, next) => {
    console.log('Entrando a CARRITO')
    next()
})

routerCarrito.get('/', getCarritoController)

routerCarrito.get('/:id', getCarritoByIdController)

routerCarrito.put('/', putCarritoController)

routerCarrito.delete('/:id', deleteCarritoController)

export { routerCarrito }