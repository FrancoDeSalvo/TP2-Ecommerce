import {Router} from 'express';

import {
    getVentasController, getVentasByIdController, postVentaController, putVentasCancelController, putVentasChangeController
} from '../router/ventasController.js'

//=========================================================================
const routerVentas = new Router();

//=========================================================================
routerVentas.use((req, res, next) => {
    console.log('Entrando a VENTAS')
    next()
})

routerVentas.get('/', getVentasController)

routerVentas.get('/:id', getVentasByIdController)

routerVentas.post('/', postVentaController)

routerVentas.put('/cancel/:id', putVentasCancelController)

routerVentas.put('/change/:id', putVentasChangeController)

export { routerVentas }