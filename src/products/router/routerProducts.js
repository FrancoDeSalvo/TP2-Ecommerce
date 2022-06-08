import {Router} from 'express';
import * as controller from './controllersProducts.js'

const routerProducts = new Router();


routerProducts.get('/', controller.getProductsController)

routerProducts.get('/:id', controller.getProductController)

routerProducts.post('/', controller.postProductController)

routerProducts.delete('/:id', controller.deleteProductController)

routerProducts.put('/:id', controller.putProductsController)


export { routerProducts }