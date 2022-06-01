import {obtenerNuevoId} from '../../shared/id/ids.js';

export function crearCarrito(idUser){
    let carrito = {
        id: obtenerNuevoId('carrito'),
        idUser: idUser,
        products: [],
        totalPrice: 0, 
        productsAmount:{}
    } 
    
    return carrito;
}