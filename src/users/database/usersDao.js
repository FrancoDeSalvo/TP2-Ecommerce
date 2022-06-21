import { MODO_PERSISTENCIA } from '../../config/config.js'
import * as daoMemory from './usersDaoMemory.js'
import * as daoMongoDB from './usersDaoMongoDB.js'

 let dao

switch (MODO_PERSISTENCIA) {
    case 'DB':
        dao = daoMongoDB
        break
    default:
        dao = daoMemory
}

export default dao