import {obtenerNuevoId} from '../../shared/id/ids.js';

export function crearVenta(u, c) {

    if(!u){
        throw new Error('USUARIO NO DEBE SER NULO')
    }
    if (!c){
        throw new Error('CARRITO NO DEBE SER NULO')
    }
  
    let venta = {
        id: obtenerNuevoId('venta'),
        user: u,
        productos: c.products,
        precio: c.totalPrice,
        estado: 'REALIZADA'
    }

    return venta;
}