import {obtenerNuevoId} from '../../shared/id/ids.js';
import { crearErrorDeDatosFaltantes } from '../../shared/errors/models/ErrorDeDatosFaltantes.js'

export function crearVenta(u, c) {

    if(!u){
        throw crearErrorDeDatosFaltantes("USUARIO")
    }
    if (!c){
        throw crearErrorDeDatosFaltantes("CARRITO")
    }
  
    let venta = {
        id: obtenerNuevoId('venta'),
        username: u.username,
        idUser: u.id,
        productosTotales: c.productsAmount,
        precioTotal: c.totalPrice,
        estado: 'REALIZADA',
        productosCambiados: null,
        diferenciaAPagar: null
    }

    return venta;
}