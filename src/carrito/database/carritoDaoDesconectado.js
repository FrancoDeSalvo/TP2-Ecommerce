import { crearErrorDePersistencia } from '../../shared/errors/models/ErrorDePersistencia.js';

//-----------------------------------------------------------------
export function guardarCarrito(c) {
    throw crearErrorDePersistencia()
}

//-----------------------------------------------------------------
export function obtenerCarritosPorId(id){
    throw crearErrorDePersistencia()
}

export function obtenerCarritos(){
    throw crearErrorDePersistencia()
}

export function obtenerProductosDelCarritoPorId(id){
    throw crearErrorDePersistencia()
}

//-----------------------------------------------------------------
export function actualizarCarrito(id){
    throw crearErrorDePersistencia()
}

export function actualizarPrecioTotal(id, precioTotal){
    throw crearErrorDePersistencia()
}

export function actualizarCantidadProductosTotales(id, cantProductos){
    throw crearErrorDePersistencia()
}

export function agregarAlCarrito(p, idUser){
    throw crearErrorDePersistencia()       
}

//----------------------------------------------------------------
export function eliminarCarritos(){
    throw crearErrorDePersistencia()
}

export function eliminarTodosLosItemsDelCarrito(id){
    throw crearErrorDePersistencia() 
}

export function eliminarProducto(c, product){
    throw crearErrorDePersistencia()
}

