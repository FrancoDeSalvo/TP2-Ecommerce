import { MODO_PERSISTENCIA } from '../../config/config.js'
import * as daoMemory from './usersDaoMemory.js'
import * as daoAnotherPeristence from './usersDaoAnotherPersistence.js'


 let dao

switch (MODO_PERSISTENCIA) {
    case 'ARCHIVO':
        dao = daoAnotherPeristence
        break
    default:
        dao = daoMemory
}

export default dao