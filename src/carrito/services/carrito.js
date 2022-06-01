import { crearCarrito } from '../models/crearCarrito.js'
import dao from '../database/carritoDao.js'

//-----------------------------------------------------------------
function addProduct(p, carrito){
    const product = availableStock(p)
    const c = dao.agregarAlCarrito(product, carrito.idUser)
    dao.actualizarPrecioTotal(c)
    dao.actualizarCantidadProductosTotales(c)
}

function availableStock(product){
    return dao.stockDisponible(product)
}

//-----------------------------------------------------------------
export function addToCarrito(p, idUser){
    const carrito = crearCarrito(idUser)
    dao.guardarCarrito(carrito)
    const encontrado = dao.obtenerCarritosPorId(idUser)
    addProduct(p, encontrado)
    return encontrado;
}

export function getCarritos(){
    return dao.obtenerCarritos();
}

export function getCarritoById(id){
    return dao.obtenerCarritosPorId(id)
}

export function getProductsByUserId(idUser){
    return dao.obtenerProductosPorIdUser(idUser)
}

export function replaceProducts(userId, newProduct, oldProduct) {
    const carrito = dao.obtenerCarritosPorId(userId)
    dao.eliminarProducto(carrito, oldProduct)
    const producto = dao.stockDisponible(newProduct);
    dao.agregarAlCarrito(producto, userId)
    dao.actualizarCantidadProductosTotales(carrito)
    dao.actualizarPrecioTotal(carrito) 
    dao.actualizarCarrito(carrito)
    return carrito;
}

//------------------------------------------------------
export function deleteAllItems(id){
    return dao.eliminarTodosLosItemsDelCarrito(id)
}

export function deleteCarritos(){
    dao.eliminarCarritos();
}

export function deleteProduct(c, product) {
    dao.eliminarProducto(c, product)
    dao.actualizarPrecioTotal(c)
    dao.actualizarCantidadProductosTotales(c)
    dao.actualizarCarrito(c)
    return c;
}