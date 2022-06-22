import {obtenerNuevoId} from '../../shared/id/ids.js';
import { crearErrorDeDatosFaltantes } from '../../shared/errors/models/ErrorDeDatosFaltantes.js'

export function createUser(u) {

    if (!u.name){
        throw crearErrorDeDatosFaltantes('name')
    }
    if (!u.username){
        throw crearErrorDeDatosFaltantes('username')
    }
    if (!u.dni){
        throw crearErrorDeDatosFaltantes('dni')
    }
    if (!u.phone){
        throw crearErrorDeDatosFaltantes('phone')
    }
    if (!u.paymethod){
        throw crearErrorDeDatosFaltantes('paymethod')
    }
    if (!u.password){
        throw crearErrorDeDatosFaltantes('password')
    }
    if (!u.lastname){
        throw crearErrorDeDatosFaltantes('lastname')
    }
  
    let user = {
        id: obtenerNuevoId('user'),
        username: u.username,
        password: u.password,
        name: u.name,
        lastname: u.lastname,
        dni: u.dni,
        phone: u.phone,
        paymethod: u.paymethod,
    }

    return user;
}