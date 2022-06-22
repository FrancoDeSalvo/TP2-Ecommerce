import { crearCarrito } from '../models/crearCarrito.js'
import dao from '../database/carritoDao.js'
import { crearErrorNoHayStock } from '../../shared/errors/models/ErrorFaltaDeStock.js'
import { crearErrorProductoNulo } from '../../shared/errors/models/ErrorProductoNulo.js'

import {getTotalAmountProducts, getTotalPrice} from '../../shared/codeReuse/codeReuse.js';

//-----------------------------------------------------------------
export async function createCarrito(idUser){
    const carrito = crearCarrito(idUser)
    await dao.guardarCarrito(carrito)
}

//-----------------------------------------------------------------
export async function addToCarrito(p, idUser){
    await addProduct(p, idUser)
    return await dao.obtenerCarritosPorId(idUser);
}

async function addProduct(p, idUser){
    const carrito = await dao.obtenerCarritosPorId(idUser)
    const product = await verifyProduct(p)
    await dao.agregarAlCarrito(product, carrito.idUser)
    await updateCarrito(carrito.id);
}

async function updateCarrito(id){
    const carrito = await dao.obtenerCarritosPorId(id)
    const products = await dao.obtenerProductosDelCarritoPorId(carrito.id)

    const precioTotal =  await getTotalPrice(products)
    const productosTotales = await getTotalAmountProducts(products)

    await dao.actualizarPrecioTotal(carrito.id, precioTotal)
    await dao.actualizarCantidadProductosTotales(carrito.id, productosTotales)
    
    await dao.actualizarCarrito(carrito.id)
}

//-----------------------------------------------------------------
export async function getCarritos(){
    return await dao.obtenerCarritos();
}

export async function getCarritoById(id){
    return await dao.obtenerCarritosPorId(id)
}

export async function getProductsById(id){
    return await dao.obtenerProductosDelCarritoPorId(id)
}

//------------------------------------------------------
export async function deleteAllItemsFromCarrito(id){
    return await dao.eliminarTodosLosItemsDelCarrito(id)
}

export async function deleteCarritos(){
    await dao.eliminarCarritos();
}

export async function deleteProduct(c, p, amount) {
    let i = 0;
    const producto = await verifyProduct(p);
    while(i < amount){
        await dao.eliminarProducto(c, producto)
        i++;
    }
    await updateCarrito(c.id);
    return await dao.obtenerCarritosPorId(c.idUser);
}

//------------------------------------------------------
export async function replaceProducts(userId, newProduct) {  //--> cambiar nombre por addNewProducts()
    const carrito = await dao.obtenerCarritosPorId(userId)

    newProduct.forEach(async (x) => {
        let producto = await verifyProduct(x);
        await dao.agregarAlCarrito(producto, userId)
    })

    await updateCarrito(carrito.id)
}

//--------------------------- OTROS --------------------------------------
async function verifyProduct(product){
    if(!product){
        throw crearErrorProductoNulo()
    }
    if(product.stock <= 0){
        throw crearErrorNoHayStock()
    }
    return product;
}