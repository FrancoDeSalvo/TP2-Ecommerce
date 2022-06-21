 import { MODO_PERSISTENCIA } from '../../config/config.js'
import * as daoMemory from './productsDaoMemory.js'
import * as daoMongoDB from './productsDaoMongoDB.js'


 let dao

switch (MODO_PERSISTENCIA) {
    case 'DB':
        dao = daoMongoDB
        break
    default:
        dao = daoMemory
}

export default dao