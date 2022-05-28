//--> Se ejecuta dependiendo del tipo de persistencia que vamos usar
import { MODO_PERSISTENCIA } from '../../config/config.js'
import * as daoArchivos from './carritoDaoArchivo'
import * as daoMemoria from './carritoDaoMemoria'

let dao

switch (MODO_PERSISTENCIA) {
    case 'ARCHIVO':
        dao = daoArchivos
        break
    default:
        dao = daoMemoria
}

export default dao