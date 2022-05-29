// import { MODO_PERSISTENCIA } from '../../config/config.js'
import * as daoMemory from './productsDaoMemory.js'
import * as daoAnotherPeristence from './productsDaoAnotherPersistence.js'


// let dao

// switch (MODO_PERSISTENCIA) {
//     case 'ARCHIVO':
//         dao = daoAnotherPeristence
//         break
//     default:
//         dao = daoMemory
// }

export default daoMemory