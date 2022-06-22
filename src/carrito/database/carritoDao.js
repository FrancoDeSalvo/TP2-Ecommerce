//--> Se ejecuta dependiendo del tipo de persistencia que vamos usar
import { MODO_PERSISTENCIA } from '../../shared/config/config.js'
import * as daoArchivos from './carritoDaoArchivo.js'
import * as daoMemoria from './carritoDaoMemoria.js'
import * as daoDB from './carritoDaoBaseDeDatos.js'
import * as daoDesconectado from './carritoDaoDesconectado.js'

let daoCarrito

switch (MODO_PERSISTENCIA) {
    case 'ARCHIVO':
        daoCarrito = daoArchivos
        break
    case 'DB':
        daoCarrito = daoDB
        break
    case 'DESCONECTADO':
        daoCarrito = daoDesconectado
        break
    default:
        daoCarrito = daoMemoria
}

export default daoCarrito