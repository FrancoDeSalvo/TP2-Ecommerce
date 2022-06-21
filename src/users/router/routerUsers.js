import {Router} from 'express';
import * as controller from '../controllers/controllersUsers.js'

const routerUsers = new Router();

/*********************************************************************/
// routerUsers.get('/', (req, res) => {
//     res.send('<h1>Ecommerce</h1>')
// })

routerUsers.get('/', controller.getUsersController)

routerUsers.get('/:id', controller.getUserController)

routerUsers.post('/', controller.postUserController)

routerUsers.delete('/:id', controller.deleteUserController)

routerUsers.put('/:id', controller.putUserController)

export { routerUsers }
