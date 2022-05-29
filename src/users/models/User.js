import {obtenerNuevoId} from '../../shared/id/ids.js';

export function createUser(u) {

    if (!u.name){
        throw new Error('El campo NOMBRE es obligatorio')
    }
    if (!u.username){
        throw new Error('El campo USERNAME es obligatorio')
    }
    if (!u.dni){
        throw new Error('El campo DNI es obligatorio')
    }
    if (!u.phone){
        throw new Error('El campo TELEFONO es obligatorio')
    }
    if (!u.paymethod){
        throw new Error('El campo METODO DE PAGO es obligatorio')
    }
    if (!u.password){
        throw new Error('El campo CONTRASEÑA es obligatorio')
    }
    if (!u.lastname){
        throw new Error('El campo APELLIDO es obligatorio')
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