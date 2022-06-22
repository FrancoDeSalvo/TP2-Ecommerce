import {Router} from 'express';
import * as carritoController from '../controllers/carritoController.js'

//=========================================================================
const routerCarrito = new Router();

routerCarrito.use((req, res, next) => {
    console.log('Entrando a CARRITO')
    next()
})

routerCarrito.get('/', carritoController.getAll)
routerCarrito.get('/:id', carritoController.getById)
routerCarrito.get('/productos/:id', carritoController.getProductsFromCarrito)
routerCarrito.put('/agregarProducto', carritoController.putNewProduct)
routerCarrito.put('/remover', carritoController.putRemoveProducts)
routerCarrito.delete('/:id', carritoController.deleteAllItems)

export default routerCarrito