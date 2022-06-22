import {obtenerNuevoId} from '../../shared/id/ids.js';
import { crearErrorDeDatosFaltantes } from '../../shared/errors/models/ErrorDeDatosFaltantes.js'

export function createProduct(p) {
    if (!p.productName){
        throw crearErrorDeDatosFaltantes('name')
    }
    if (!p.description){
        throw crearErrorDeDatosFaltantes('description')
    }
    if (!p.price){
        throw crearErrorDeDatosFaltantes('price')
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