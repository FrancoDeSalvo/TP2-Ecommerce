 import { MODO_PERSISTENCIA } from '../../config/config.js'
import * as daoMemory from './productsDaoMemory.js'
import * as daoMongoDB from './productsDaoMongoDB.js'


 let dao

switch ('DB') {
    case 'DB':
        dao = daoMongoDB
        break
    default:
        dao = daoMemory
}

export default dao