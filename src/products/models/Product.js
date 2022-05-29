import {obtenerNuevoId} from '../../shared/id/ids.js';

export function createProduct(p) {
    if (!p.productName){
        throw new Error('El campo NOMBRE es obligatorio')
    }
    if (!p.description){
        throw new Error('El campo DESCRIPCIÓN es obligatorio')
    }
    if (!p.price){
        throw new Error('El campo PRECIO es obligatorio')
    }
  
    let product = {
        id: obtenerNuevoId('product'),
        productName: p.productName,
        description: p.description,
        price: p.price, 
        stock: p.stock
    }
    return product;
}   