import {Router} from 'express';
import * as ventasController from '../controllers/ventasController.js'

//=========================================================================
const routerVentas = new Router();

routerVentas.use((req, res, next) => {
    console.log('Entrando a VENTAS')
    next()
})

routerVentas.get('/', ventasController.getAll)
routerVentas.get('/:id', ventasController.getById)
routerVentas.post('/', ventasController.post)
routerVentas.put('/cancel/:id', ventasController.putCancel)
routerVentas.put('/change/:id', ventasController.putChange)

export default routerVentas