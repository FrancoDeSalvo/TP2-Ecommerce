import { MODO_PERSISTENCIA } from '../../shared/config/config.js'
import * as daoMemory from './usersDaoMemory.js'
import * as daoMongoDB from './usersDaoMongoDB.js'
import * as daoDisconnected from './usersDaoDisconnected.js'

 let dao

switch (MODO_PERSISTENCIA) {
    case 'DB':
        dao = daoMongoDB
        break
    case 'DESCONECTADO':
        dao = daoDisconnected
        break
    default:
        dao = daoMemory
}

export default dao