import { MODO_PERSISTENCIA } from '../../shared/config/config.js'
import * as daoArchivos from './ventasDaoArchivo.js'
import * as daoMemoria from './ventasDaoMemoria.js'
import * as daoDB from './ventasDaoBaseDeDatos.js'
import * as daoDesconectado from './ventasDaoDesconectado.js'

let daoVentas

switch (MODO_PERSISTENCIA) {
    case 'ARCHIVO':
        daoVentas = daoArchivos
        break
    case 'DB':
        daoVentas = daoDB
        break
    case 'DESCONECTADO':
        daoVentas = daoDesconectado
        break
    default:
        daoVentas = daoMemoria
}

export default daoVentas